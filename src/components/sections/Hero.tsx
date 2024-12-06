import React from 'react';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-artificial-intelligence-network-9235/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/90 to-blue-600/90 mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <img
          src="/futuregpt-logo.png"
          alt="FutureGPT"
          className="w-32 h-32 mx-auto mb-8"
        />
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Welcome to{' '}
          <span className="text-yellow-300">
            FutureGPT
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
          India's Premier Community for Emerging Technologies
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-8 py-3 bg-yellow-400 text-blue-900 rounded-full font-medium hover:bg-yellow-300 transition-colors flex items-center">
            Join Community
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button className="px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}