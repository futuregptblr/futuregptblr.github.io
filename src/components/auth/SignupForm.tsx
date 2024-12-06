import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Show WhatsApp link after successful signup
    alert('Thank you for signing up! Join our WhatsApp group: https://chat.whatsapp.com/future-gpt');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
        Join FutureGPT Community
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}