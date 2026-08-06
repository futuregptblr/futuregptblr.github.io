import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ArrowRight } from 'lucide-react';

export function PremiumBanner() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl overflow-hidden shadow-lg">
          <div className="px-6 py-12 md:px-12 md:py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 text-yellow-400 mr-2" />
                <span className="text-yellow-400 font-semibold text-lg">Premium Membership</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Unlock Exclusive Benefits
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Get access to premium events, priority workshops, exclusive job board, and direct networking with industry leaders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/membership-waitlist"
                  className="inline-flex items-center px-8 py-3 bg-yellow-400 text-blue-900 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Join Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <div className="text-blue-100 text-sm">
                  <span className="line-through">₹9,999</span>
                  <span className="ml-2 font-bold text-yellow-400">₹4,999</span>
                  <span className="ml-1">launch offer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
