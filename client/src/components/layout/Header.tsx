import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCompanyAuthenticated, setIsCompanyAuthenticated] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const companyToken = localStorage.getItem("companyToken");

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
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleCompanyLogout = () => {
    localStorage.removeItem("companyToken");
    localStorage.removeItem("company");
    setIsCompanyAuthenticated(false);
    navigate("/");
  };
  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            {/* <Brain className="h-8 w-8 text-yellow-400" /> */}
            <img
              src="/icons/fg.png"
              alt="FutureGPT"
              className="w-32 h-32 mx-auto"
              height="80px"
              width="80px"
            />
            {/* <span className="ml-2 text-xl font-bold text-blue-600">
              FutureGPT
            </span> */}
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/about"
              className="text-gray-700 hover:text-yellow-500 transition-colors"
            >
              About
            </Link>
            <Link
              to="/chapters"
              className="text-gray-700 hover:text-yellow-500 transition-colors"
            >
              Chapters
            </Link>
            <Link
              to="/past-events"
              className="text-gray-700 hover:text-yellow-500 transition-colors"
            >
              Past Events
            </Link>
            <Link
              to="/team"
              className="text-gray-700 hover:text-yellow-500 transition-colors"
            >
              Team
            </Link>
            <Link
              to="/membership-waitlist"
              className="relative text-gray-700 hover:text-yellow-500 transition-colors font-medium group"
            >
              <span className="relative z-10">Premium</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
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
                  className="px-4 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                >
                  Logout
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
                  className="px-4 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowLoginMenu((v) => !v)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
                {showLoginMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50">
                    <div className="space-y-2">
                      <div>
                        <button
                          onClick={() => { setShowLoginMenu(false); navigate('/login'); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 font-medium"
                        >
                          Personal Login
                        </button>
                        <div className="px-3 pb-2 text-xs text-gray-500">
                          No account? <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">Register now</Link>
                        </div>
                      </div>
                      <div className="border-t border-gray-100" />
                      <div>
                        <button
                          onClick={() => { setShowLoginMenu(false); navigate('/company-login'); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 font-medium"
                        >
                          Company Login
                        </button>
                        <div className="px-3 pb-2 text-xs text-gray-500">
                          No account? <Link to="/company-signup" className="text-blue-600 hover:text-blue-700 font-medium">Register now</Link>
                        </div>
                      </div>
                      <div className="border-t border-gray-100" />
                      <div className="px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800 font-medium">Mentor Login</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Coming soon</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                to="/about"
                className="text-gray-700 hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
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
                to="/past-events"
                className="text-gray-700 hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Past Events
              </Link>
              <Link
                to="/membership-waitlist"
                className="relative text-gray-700 hover:text-yellow-500 transition-colors font-medium group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative z-10">Premium</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Link>
              {isCompanyAuthenticated ? (
                <>
                  <Link
                    to="/company-dashboard"
                    className="px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors inline-block text-center"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors inline-block text-center"
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
                <div className="space-y-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => setShowLoginMenu((v) => !v)}
                  >
                    Login
                  </button>
                  {showLoginMenu && (
                    <div className="space-y-3 p-3 border border-gray-200 rounded-xl">
                      <div>
                        <button
                          onClick={() => { setIsMenuOpen(false); setShowLoginMenu(false); navigate('/login'); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 font-medium"
                        >
                          Personal Login
                        </button>
                        <div className="px-3 pb-2 text-xs text-gray-500 text-left">
                          No account? <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">Register now</Link>
                        </div>
                      </div>
                      <div className="border-t border-gray-100" />
                      <div>
                        <button
                          onClick={() => { setIsMenuOpen(false); setShowLoginMenu(false); navigate('/company-login'); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 font-medium"
                        >
                          Company Login
                        </button>
                        <div className="px-3 pb-2 text-xs text-gray-500 text-left">
                          No account? <Link to="/company-signup" className="text-blue-600 hover:text-blue-700 font-medium">Register now</Link>
                        </div>
                      </div>
                      <div className="border-t border-gray-100" />
                      <div className="px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800 font-medium">Mentor Login</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Coming soon</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
