import React from 'react';

const Footer = () => (
  <footer className="w-full bg-[#191A23] border-t border-[#23243a] py-6">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
      <div className="text-white font-bold text-lg">
        Cloud<span className="text-[#ff5c35]">Notes</span> &copy; {new Date().getFullYear()}
      </div>
      <div className="flex gap-6 text-[#b0b3c6] text-sm">
        
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff5c35] transition">GitHub</a>
       
      </div>
    </div>
  </footer>
);

export default Footer; 