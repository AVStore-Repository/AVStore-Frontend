import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setIsProfileOpen(false);
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/5 backdrop-blur-md border-b border-white/20 shadow-md h-20">
      <div className="container mx-auto flex justify-between items-center h-full px-4">
        {/* Logo on the left */}
        <Link to="/home" className="flex items-center">
          <img
            src="/images/dlogo.png"
            alt="AVSTORE Logo"
            className="h-12 w-auto object-contain mr-2"
          />
          <span className="text-xl font-bold text-black"></span>
        </Link>

        {/* Desktop Nav Links - Hidden on mobile */}
        <ul className="hidden md:flex items-center space-x-6">
          <li><Link to="/home" className="hover:text-yellow-400 text-black font-semibold text-lg">Home</Link></li>
          <li><Link to="/shop" className="hover:text-yellow-400 text-black font-semibold text-lg">Shop</Link></li>
          <li><Link to="/about" className="hover:text-yellow-400 text-black font-semibold text-lg">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-yellow-400 text-black font-semibold text-lg">Contact</Link></li>

          <li>
            <Link to="/cart" className="hover:text-yellow-400 text-black font-semibold">
              <FaShoppingCart className="text-xl" />
            </Link>
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
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800  hover:text-black transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:text-black transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800  hover:text-black transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link> */}
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-800  hover:text-black transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-gray-800  hover:text-black transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </li>
        </ul>

        {/* Mobile menu button - Visible only on mobile */}
        <div className="md:hidden flex items-center">
          <Link to="/cart" className="hover:text-yellow-400 text-black font-semibold mr-4">
            <FaShoppingCart className="text-xl" />
          </Link>
          <button
            onClick={toggleProfile}
            className="text-black text-2xl focus:outline-none mr-4"
          >
            <FaUserCircle />
          </button>
          <button
            onClick={toggleMenu}
            className="text-black text-2xl focus:outline-none"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slides in from top */}
      <div className={`md:hidden bg-white/95 backdrop-blur-md absolute top-20 left-0 w-full transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <ul className="flex flex-col items-center space-y-4 py-4">
          <li><Link to="/home" className="hover:text-yellow-400 text-black font-semibold text-lg" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/shop" className="hover:text-yellow-400 text-black font-semibold text-lg" onClick={() => setIsMenuOpen(false)}>Shop</Link></li>
          <li><Link to="/about" className="hover:text-yellow-400 text-black font-semibold text-lg" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
          <li><Link to="/contact" className="hover:text-yellow-400 text-black font-semibold text-lg" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
        </ul>
      </div>

      {/* Mobile Profile Dropdown */}
      {isProfileOpen && (
        <div className="md:hidden fixed top-20 right-4 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
          {token ? (
            <>
              <button
                // to="/profile"
                className="block px-4 py-2 text-gray-800 hover:text-black transition-colors"
                onClick={() => {
                  setIsProfileOpen(false)
                  navigate("/profile")
                }}
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-800 hover:text-black transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                // to="/login"
                className="block px-4 py-2 text-gray-800 hover:text-black transition-colors"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/login");
                }}
              >
                Sign In
              </button>
              <button
                // to="/signup"
                className="block px-4 py-2 text-gray-800 hover:text-black transition-colors"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/signup");
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}