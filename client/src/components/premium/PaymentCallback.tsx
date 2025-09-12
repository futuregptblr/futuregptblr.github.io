import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../lib/utils';
import { useDispatch } from 'react-redux';
import { setUser } from '../../slices/userSlice';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('token');
      const mtid = searchParams.get('mtid');
      if (!mtid) {
        setError('Missing transaction id');
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/payment/verify-payment?mtid=${encodeURIComponent(mtid)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          let message = 'Payment verification failed';
          try { const parsed = text ? JSON.parse(text) : null; message = parsed?.message || message; } catch {}
          throw new Error(message);
        }
        // Refresh profile and persist so UI reflects Premium immediately
        try {
          const profileRes = await fetch(`${API_BASE_URL}/api/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (profileRes.ok) {
            const profile = await profileRes.json();
            if (profile && (profile._id || profile.id)) {
              dispatch(setUser(profile));
            }
          }
        } catch {}
        navigate('/dashboard');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Payment verification failed');
      }
    };
    verify();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Payment Failed</h2>
            <p className="text-sm text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Back to Dashboard
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying your payment…</h2>
            <p className="text-sm text-gray-600">Please wait, this will only take a moment.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;


