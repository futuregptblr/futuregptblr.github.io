const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: "key_id",
  key_secret: "secret",
});

// Create order for premium membership
async function createOrder(req, res) {
  try {
    const userId = req.user?.sub;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already premium
    if (user.isPremium) {
      return res.status(400).json({ message: 'User already has premium membership' });
    }

    const options = {
      amount: 25000, // Amount in paise (INR 250)
      currency: 'INR',
      receipt: `premium_${userId}_${Date.now()}`,
      notes: {
        userId: userId,
        membershipType: 'premium',
        description: 'FutureGPT Premium Membership - One Time Fee'
      }
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    const status = error?.statusCode || 500;
    const message = error?.error?.description || error?.message || 'Failed to create payment order';
    console.error('Error creating order:', message);
    res.status(status).json({ message });
  }
}

// Verify payment and update user premium status
async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user?.sub;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update user premium status
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isPremium: true,
        premiumPurchaseDate: new Date(),
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
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
        premiumPurchaseDate: user.premiumPurchaseDate
      }
    });
  } catch (error) {
    const status = error?.statusCode || 500;
    const message = error?.error?.description || error?.message || 'Payment verification failed';
    console.error('Error verifying payment:', message);
    res.status(status).json({ message });
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
  createOrder,
  verifyPayment,
  getPremiumStatus
};
