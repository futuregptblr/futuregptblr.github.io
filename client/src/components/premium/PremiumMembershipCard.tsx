import React, { useState } from 'react';
import { Crown, Check, Loader2 } from 'lucide-react';
import { User } from '../../types';
import { API_BASE_URL } from '../../lib/utils';

interface PremiumMembershipCardProps {
  user: User;
  onPurchaseSuccess: (updatedUser: User) => void;
}

// No global SDK needed for PhonePe redirect

const PremiumMembershipCard: React.FC<PremiumMembershipCardProps> = ({
  user,
  onPurchaseSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const premiumFeatures = [
    'Access to exclusive premium events',
    'Priority registration for workshops',
    'Direct networking with industry leaders',
    'Premium job board access',
    'Exclusive premium community channels',
    'Early access to new features',
    'Premium member badge',
    'Membership valid for 2 years'
  ];

  const handlePurchasePremium = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create PhonePe payment session
      const token = localStorage.getItem('token');
      const orderResponse = await fetch(`${API_BASE_URL}/api/payment/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!orderResponse.ok) {
        const text = await orderResponse.text().catch(() => '');
        let errorMessage = 'Failed to create payment order';
        try {
          const parsed = text ? JSON.parse(text) : null;
          errorMessage = parsed?.message || errorMessage;
        } catch (_) {}
        throw new Error(errorMessage);
      }

      const orderData = await orderResponse.json().catch(() => {
        throw new Error('Invalid response from server while creating payment');
      });

      if (!orderData?.redirectUrl) {
        throw new Error('Payment initialization failed');
      }

      // Redirect to PhonePe pay page
      window.location.href = orderData.redirectUrl;
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed');
      setIsLoading(false);
    }
  };

  if (user.isPremium) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <Crown className="h-8 w-8 text-yellow-600 mr-2" />
          <h2 className="text-2xl font-bold text-yellow-800">Premium Member</h2>
        </div>
        <div className="text-center mb-6">
          <p className="text-yellow-700 mb-2">
            🎉 Congratulations! You are a premium member
          </p>
          {user.premiumPurchaseDate && (
            <p className="text-sm text-yellow-600">
              Member since: {new Date(user.premiumPurchaseDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-yellow-700">
              <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-center mb-4">
        <Crown className="h-8 w-8 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-blue-800">Upgrade to Premium</h2>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-blue-600 mb-2">₹250</div>
        <p className="text-blue-700 font-medium">One-time payment • Lifetime access</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Premium Benefits:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-blue-700">
              <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handlePurchasePremium}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Crown className="h-5 w-5 mr-2" />
            Upgrade to Premium
          </>
        )}
      </button>

      <p className="text-xs text-blue-600 text-center mt-3">
        Secure payment powered by PhonePe
      </p>
    </div>
  );
};

export default PremiumMembershipCard;
