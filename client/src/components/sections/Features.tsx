import React from 'react';
import { Users, BookOpen, Code2, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Vibrant Community',
    description: 'Connect with AI enthusiasts and experts from around the globe.',
  },
  {
    icon: BookOpen,
    title: 'Learning Resources',
    description: 'Access curated tutorials, guides, and educational content.',
  },
  {
    icon: Code2,
    title: 'Developer Tools',
    description: 'Explore cutting-edge AI development tools and frameworks.',
  },
  {
    icon: MessageSquare,
    title: 'Expert Support',
    description: 'Get help from experienced community members and mentors.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Join FutureGPT?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the benefits of being part of our growing AI community
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <feature.icon className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}