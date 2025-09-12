const User = require('../models/User');

// Try initialize PhonePe Backend SDK (optional)
let phonePeSdkClient = null;
try {
  const clientId = process.env.PHONEPE_SDK_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_SDK_CLIENT_SECRET;
  const clientVersion = process.env.PHONEPE_SDK_CLIENT_VERSION;
  const envPref = process.env.PHONEPE_SDK_ENV || 'SANDBOX';
  if (clientId && clientSecret) {
    const { StandardCheckoutClient, Env } = require('pg-sdk-node');
    const env = Env.PRODUCTION;
    phonePeSdkClient = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
  }
} catch (_) {
  phonePeSdkClient = null;
}

// Create PhonePe payment (redirect flow)
async function createPhonePePayment(req, res) {
  try {
    const userId = req.user?.sub;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isPremium) {
      return res.status(400).json({ message: 'User already has premium membership' });
    }

    const clientBase = process.env.CLIENT_BASE_URL || 'http://localhost:5173';

    const merchantTransactionId = `premium_${userId}_${Date.now()}`;
    const amount = 100; // in paise
    if (phonePeSdkClient) {
      const { StandardCheckoutPayRequest, MetaInfo } = require('pg-sdk-node');
      const metaInfo = MetaInfo.builder()
        .udf1('premium')
        .udf2(String(userId))
        .build();
      const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(merchantTransactionId)
        .amount(amount)
        .redirectUrl(`${clientBase}/payment/callback?mtid=${merchantTransactionId}`)
        .metaInfo(metaInfo)
        .build();
      const response = await phonePeSdkClient.pay(request);
      const redirectUrl = response?.redirectUrl || response?.data?.redirectUrl || response?.data?.instrumentResponse?.redirectInfo?.url;
      if (!redirectUrl) {
        return res.status(500).json({ message: 'SDK: Missing redirect URL from PhonePe' });
      }
      return res.json({ redirectUrl, merchantTransactionId, amount, currency: 'INR' });
    }
    return res.status(500).json({ message: 'PhonePe SDK not configured on server' });
  } catch (error) {
    console.error('Error creating PhonePe payment:', error?.message || error);
    res.status(500).json({ message: 'Failed to initiate payment' });
  }
}

// Verify PhonePe payment by checking transaction status
async function verifyPhonePePayment(req, res) {
  try {
    const userId = req.user?.sub;
    const merchantTransactionId = req.query.mtid || req.body?.merchantTransactionId;
    if (!merchantTransactionId) {
      return res.status(400).json({ message: 'merchantTransactionId is required' });
    }

    if (!phonePeSdkClient) {
      return res.status(500).json({ message: 'PhonePe SDK not configured on server' });
    }

    const statusResp = await phonePeSdkClient.getOrderStatus(merchantTransactionId);
    const state = statusResp?.state || statusResp?.data?.state;
    if (state !== 'COMPLETED') {
      return res.status(400).json({ message: 'Payment not successful', providerResponse: statusResp });
    }

    const paymentId = statusResp?.transactionId || statusResp?.data?.transactionId || statusResp?.data?.providerReferenceId || merchantTransactionId;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isPremium: true,
        premiumPurchaseDate: new Date(),
        paymentId,
        orderId: merchantTransactionId,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Payment verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        premiumPurchaseDate: user.premiumPurchaseDate,
      },
    });
  } catch (error) {
    console.error('Error verifying PhonePe payment:', error?.message || error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
}

// Get user premium status
async function getPremiumStatus(req, res) {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('isPremium premiumPurchaseDate');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      isPremium: user.isPremium,
      premiumPurchaseDate: user.premiumPurchaseDate
    });
  } catch (error) {
    console.error('Error getting premium status:', error);
    res.status(500).json({ message: 'Failed to get premium status' });
  }
}

module.exports = {
  createPhonePePayment,
  verifyPhonePePayment,
  getPremiumStatus
};
