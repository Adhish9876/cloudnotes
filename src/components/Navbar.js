import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Hide Navbar on landing, login, signup
  if (['/', '/login', '/signup'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#191A23] border-b border-[#23243a] shadow-lg">
      <div className="flex justify-between h-16 items-center w-full">
        {/* Logo aligned left */}
        <div className="flex-shrink-0 flex items-center pl-6">
          <Link to="/home" className="text-2xl font-bold text-white tracking-tight">
            Cloud<span className="text-[#ff5c35]">Notes</span>
          </Link>
        </div>
        {/* Auth Buttons aligned right */}
        <div className="flex items-center space-x-4 pr-6 ml-auto">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full bg-[#ff5c35] text-white font-semibold shadow hover:bg-[#ff784e] transition"
            >
              Log out
            </button>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 rounded-full bg-[#23243a] text-white font-semibold hover:bg-[#23243a]/80 border border-[#ff5c35] hover:text-[#ff5c35] transition">Login</Link>
              <Link to="/signup" className="px-5 py-2 rounded-full bg-[#ff5c35] text-white font-semibold shadow hover:bg-[#ff784e] transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
