import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <Brain className="h-8 w-8 text-yellow-400" />
            <span className="ml-2 text-xl font-bold text-blue-600">
              FutureGPT
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/chapters" className="text-gray-700 hover:text-yellow-500 transition-colors">
              Chapters
            </Link>
            <Link to="/team" className="text-gray-700 hover:text-yellow-500 transition-colors">
              Team
            </Link>
            <a href="#features" className="text-gray-700 hover:text-yellow-500 transition-colors">
              Features
            </a>
            <Link to="/past-events" className="text-gray-700 hover:text-yellow-500 transition-colors">
              Past Events
            </Link>
            <a href="#contact" className="text-gray-700 hover:text-yellow-500 transition-colors">
              Contact
            </a>
          </nav>

          <div className="hidden md:block">
            <Link
              to="/signup"
              className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-full font-medium hover:bg-yellow-300 transition-colors"
            >
              Join Us
            </Link>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/chapters"
                className="text-gray-700 hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Chapters
              </Link>
              <Link 
                to="/team"
                className="text-gray-700 hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Team
              </Link>
              <a 
                href="#features"
                className="text-gray-700 hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <Link 
                to="/past-events"
                className="text-gray-700 hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Past Events
              </Link>
              <a 
                href="#contact"
                className="text-gray-700 hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <Link
                to="/signup"
                className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-full font-medium hover:bg-yellow-300 transition-colors inline-block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}