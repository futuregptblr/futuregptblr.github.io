import React from 'react';
import { Mail, MessageCircle, Github } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <a
            href="#"
            className="flex flex-col items-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <Mail className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 text-center">Drop us a line anytime</p>
          </a>
          <a
            href="#"
            className="flex flex-col items-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <MessageCircle className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Discord</h3>
            <p className="text-gray-600 text-center">Join our community chat</p>
          </a>
          <a
            href="#"
            className="flex flex-col items-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <Github className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">GitHub</h3>
            <p className="text-gray-600 text-center">Contribute to our projects</p>
          </a>
        </div>
      </div>
    </section>
  );
}