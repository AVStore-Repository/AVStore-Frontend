import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          <li><Link to="/login" className="hover:text-yellow-400 text-black font-semibold text-lg">Login</Link></li>
          <li>
            <Link to="/cart" className="hover:text-yellow-400 text-black font-semibold">
              <FaShoppingCart className="text-xl" />
            </Link>
          </li>
        </ul>

        {/* Mobile menu button - Visible only on mobile */}
        <div className="md:hidden flex items-center">
          <Link to="/cart" className="hover:text-yellow-400 text-black font-semibold mr-4">
            <FaShoppingCart className="text-xl" />
          </Link>
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
          <li><Link to="/login" className="hover:text-yellow-400 text-black font-semibold text-lg" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
        </ul>
      </div>
    </nav>
  );
}