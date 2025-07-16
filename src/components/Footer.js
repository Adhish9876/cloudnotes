import React from 'react';

const Footer = () => (
  <footer className="w-full bg-[#191A23] border-t border-[#23243a] py-8">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-6 md:gap-4 text-center md:text-left">
      <div className="text-white font-bold text-lg">
        Cloud<span className="text-[#ff5c35]">Notes</span> &copy; {new Date().getFullYear()}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-[#b0b3c6] text-sm items-center">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff5c35] transition py-2 px-4 rounded-xl">GitHub</a>
        <a href="https://www.youtube.com/watch?v=xvFZjo5PgG0" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff5c35] transition py-2 px-4 rounded-xl">CLICK ME</a>
      </div>
    </div>
  </footer>
);

export default Footer; 