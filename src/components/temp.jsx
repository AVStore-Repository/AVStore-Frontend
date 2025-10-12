import React, { useState, useRef, useEffect } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
  // Simulating token - replace with your actual token logic
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = "/";
    }
    setIsProfileOpen(false);
  };

  const handleNavigation = (path) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md">
      <div className="container mx-auto flex justify-between items-center h-16 sm:h-20 px-3 sm:px-4">
        {/* Logo on the left */}
        <a href="/home" className="flex items-center flex-shrink-0">
          <img
            src="/images/dlogo.png"
            alt="AVSTORE Logo"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop Nav Links - Hidden on mobile */}
        <ul className="hidden md:flex items-center space-x-6">
          <li><a href="/home" className="hover:text-yellow-400 text-black font-semibold text-lg">Home</a></li>
          <li><a href="/shop" className="hover:text-yellow-400 text-black font-semibold text-lg">Shop</a></li>
          <li><a href="/about" className="hover:text-yellow-400 text-black font-semibold text-lg">About Us</a></li>
          <li><a href="/contact" className="hover:text-yellow-400 text-black font-semibold text-lg">Contact</a></li>

          <li>
            <a href="/cart" className="hover:text-yellow-400 text-black font-semibold">
              <FaShoppingCart className="text-xl" />
            </a>
          </li>

          {/* Profile Dropdown */}
          <li className="relative" ref={profileRef}>
            <button
              onClick={toggleProfile}
              className="text-black font-semibold focus:outline-none"
            >
              <FaUserCircle className="text-2xl" />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                {token ? (
                  <>
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-black transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-black transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-black transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Sign In
                    </a>
                    <a
                      href="/signup"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-black transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Sign Up
                    </a>
                  </>
                )}
              </div>
            )}
          </li>
        </ul>

        {/* Mobile menu button - Visible only on mobile */}
        <div className="md:hidden flex items-center gap-3 sm:gap-4">
          <a href="/cart" className="hover:text-yellow-400 text-black font-semibold">
            <FaShoppingCart className="text-lg sm:text-xl" />
          </a>
          <button
            onClick={toggleMenu}
            className="text-black text-xl sm:text-2xl focus:outline-none"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slides in from top */}
      <div className={`md:hidden bg-white/95 backdrop-blur-md absolute top-16 sm:top-20 left-0 w-full transition-all duration-300 ease-in-out shadow-lg ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <ul className="flex flex-col items-center space-y-4 py-4">
          <li><a href="/home" className="hover:text-yellow-400 text-black font-semibold text-lg" onClick={() => setIsMenuOpen(false)}>Home</a></li>
          <li><a href="/shop" className="hover:text-yellow-400 text-black font-semibold text-lg" onClick={() => setIsMenuOpen(false)}>Shop</a></li>
          <li><a href="/about" className="hover:text-yellow-400 text-black font-semibold text-lg" onClick={() => setIsMenuOpen(false)}>About Us</a></li>
          <li><a href="/contact" className="hover:text-yellow-400 text-black font-semibold text-lg" onClick={() => setIsMenuOpen(false)}>Contact</a></li>

          {token ? (
            <>
              <li>
                <a
                  href="/profile"
                  className="hover:text-yellow-400 text-black font-semibold text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-yellow-400 text-black font-semibold text-lg"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <a
                  href="/login"
                  className="hover:text-yellow-400 text-black font-semibold text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </a>
              </li>
              <li>
                <a
                  href="/signup"
                  className="hover:text-yellow-400 text-black font-semibold text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}