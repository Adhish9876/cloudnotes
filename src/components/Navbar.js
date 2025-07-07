import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ search, setSearch, sort, setSort }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showSearchSort = location.pathname === '/allnotes';
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

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
        {/* Search, Sort, and Notes Buttons (center/right) */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-3 flex-1 justify-end pr-6">
            {showSearchSort && (
              <>
                <input
                  type="text"
                  className="w-48 px-3 py-1 rounded-xl border border-[#23243a] bg-[#23243a] text-white placeholder-[#b0b3c6] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] focus:outline-none transition"
                  placeholder="Search notes..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="Search notes"
                />
                
              </>
            )}
            
            <Link to="/allnotes" className="ml-2 px-5 py-2 rounded-full bg-[#ff5c35] text-white font-semibold shadow hover:bg-[#ff784e] transition whitespace-nowrap">
              My Notes
            </Link>
          </div>
        )}
        {/* Desktop Auth/Profile */}
        <div className="hidden md:flex items-center space-x-4 pr-6 ml-auto relative">
          {isLoggedIn ? (
            <>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#23243a] text-white font-semibold border border-[#23243a] hover:border-[#ff5c35] hover:text-[#ff5c35] transition relative"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-label="User profile"
              >
                <span className="w-8 h-8 rounded-full bg-[#ff5c35] flex items-center justify-center text-white font-bold text-lg">
                  <i className="fas fa-user"></i>
                </span>
                <span className="hidden sm:inline">Profile</span>
                <i className={`fas fa-chevron-down ml-1 text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {dropdownOpen && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-56 bg-[#23243a] border border-[#23243a] rounded-xl shadow-lg py-2 z-50 animate-fade-in">
                  <div className="flex justify-between items-center px-4 py-2 border-b border-[#191A23]">
                    <div className="text-white text-sm flex items-center gap-2">
                      <i className="fas fa-envelope text-[#ff5c35]"></i>
                      {userEmail ? userEmail : <span className="italic text-[#b0b3c6]">No email found</span>}
                    </div>
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="text-[#b0b3c6] hover:text-[#ff5c35] text-lg ml-2 focus:outline-none"
                      aria-label="Close profile dropdown"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-[#ff5c35] hover:bg-[#191A23] hover:text-white font-semibold transition rounded-b-xl"
                  >
                    Log out
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 rounded-full bg-[#23243a] text-white font-semibold hover:bg-[#23243a]/80 border border-[#ff5c35] hover:text-[#ff5c35] transition">Login</Link>
              <Link to="/signup" className="px-5 py-2 rounded-full bg-[#ff5c35] text-white font-semibold shadow hover:bg-[#ff784e] transition">Sign Up</Link>
            </>
          )}
        </div>
        {/* Hamburger for mobile */}
        <div className="md:hidden flex items-center pr-4 ml-auto">
          <button
            className="text-white text-2xl focus:outline-none"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Open menu"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#23243a] border-t border-[#23243a] px-6 py-4 flex flex-col gap-4 animate-fade-in">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-[#ff5c35] flex items-center justify-center text-white font-bold text-lg">
                  <i className="fas fa-user"></i>
                </span>
                <span className="text-white font-semibold">{userEmail}</span>
              </div>
              {showSearchSort && <>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-xl border border-[#23243a] bg-[#23243a] text-white placeholder-[#b0b3c6] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] focus:outline-none transition"
                  placeholder="Search notes..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="Search notes"
                />
                
              </>}
              <Link to="/home" className="w-full px-5 py-2 rounded-full bg-[#23243a] text-white font-semibold shadow hover:bg-[#23243a]/80 border border-[#ff5c35] hover:text-[#ff5c35] transition text-center">Your Notes</Link>
              <Link to="/allnotes" className="w-full px-5 py-2 rounded-full bg-[#ff5c35] text-white font-semibold shadow hover:bg-[#ff784e] transition text-center">My Notes</Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-full bg-[#ff5c35] text-white font-semibold shadow hover:bg-[#ff784e] transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 rounded-full bg-[#23243a] text-white font-semibold hover:bg-[#23243a]/80 border border-[#ff5c35] hover:text-[#ff5c35] transition">Login</Link>
              <Link to="/signup" className="px-5 py-2 rounded-full bg-[#ff5c35] text-white font-semibold shadow hover:bg-[#ff784e] transition">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
