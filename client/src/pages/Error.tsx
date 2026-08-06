import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const goHome = () => navigate('/');
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  return (
    <div className="pt-20 min-h-[70vh] bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-red-50 text-red-600 mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Something went wrong</h1>
            <p className="mt-2 text-gray-600">
              We couldn't find the page or an error occurred.
            </p>
            <div className="mt-1 text-xs text-gray-400">{location.pathname}</div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={goBack}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
              <button
                onClick={goHome}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <Home className="h-4 w-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;


