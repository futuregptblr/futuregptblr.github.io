import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Menu, X, User, LogOut } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCompanyAuthenticated, setIsCompanyAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const companyToken = localStorage.getItem('companyToken');
    
    if (token) {
      setIsAuthenticated(true);
      // You could decode the JWT token here to get user info
      // For now, we'll just check if token exists
    }
    
    if (companyToken) {
      setIsCompanyAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const handleCompanyLogout = () => {
    localStorage.removeItem('companyToken');
    localStorage.removeItem('company');
    setIsCompanyAuthenticated(false);
    navigate('/');
  };

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
            <Link to="/jobs" className="text-gray-700 hover:text-yellow-500 transition-colors">
              Jobs
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

          <div className="hidden md:flex items-center space-x-4">
            {isCompanyAuthenticated ? (
              <>
                <Link
                  to="/company-dashboard"
                  className="px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
                >
                  Company Dashboard
                </Link>
                <button
                  onClick={handleCompanyLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/company-login"
                    className="px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors font-medium"
                  >
                    Company Login
                  </Link>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-full font-medium hover:bg-yellow-300 transition-colors"
                  >
                    Join Us
                  </Link>
                  <Link
                    to="/company-signup"
                    className="px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
                  >
                    Company Signup
                  </Link>
                </div>
              </>
            )}
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
              <Link 
                to="/jobs"
                className="text-gray-700 hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
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

              {/* Auth actions */}
              {isCompanyAuthenticated ? (
                <>
                  <Link
                    to="/company-dashboard"
                    className="px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Company Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleCompanyLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors text-center"
                  >
                    Logout
                  </button>
                </>
              ) : isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 transition-colors font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/company-login"
                    className="text-purple-600 hover:text-purple-700 transition-colors font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Company Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-full font-medium hover:bg-yellow-300 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join Us
                  </Link>
                  <Link
                    to="/company-signup"
                    className="px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Company Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}