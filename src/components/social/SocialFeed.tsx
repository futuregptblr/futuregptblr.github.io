import React from 'react';
import { LinkedInEmbed } from 'react-social-media-embed';
import YouTube from 'react-youtube';

export function SocialFeed() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Latest Updates</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-6">Latest YouTube Content</h3>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <YouTube
                videoId="dQw4w9WgXcQ"
                opts={{
                  width: '100%',
                  height: '315',
                  playerVars: {
                    autoplay: 0,
                  },
                }}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">LinkedIn Updates</h3>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <LinkedInEmbed
                url="https://www.linkedin.com/embed/feed/update/urn:li:share:6234567890"
                height={400}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}