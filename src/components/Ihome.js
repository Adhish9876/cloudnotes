import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.5 + i * 0.2, duration: 0.7, type: 'spring', stiffness: 60 },
  }),
};

const Ihome = ({ isLoggedIn }) => (
  <motion.div
    className="min-h-screen bg-[#191A23] flex flex-col items-center justify-center px-2 sm:px-4 relative overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.7 }}
  >
    {/* Decorative blurred orange accent */}
    <motion.div
      className="absolute -top-32 -left-32 w-72 sm:w-96 h-72 sm:h-96 bg-[#ff5c35]/20 rounded-full blur-3xl z-0"
      initial={{ opacity: 0, scale: 0.7, x: -100, y: -100 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      transition={{ duration: 1, delay: 0.1 }}
    ></motion.div>
    <motion.div
      className="absolute -bottom-32 -right-32 w-72 sm:w-96 h-72 sm:h-96 bg-[#ff5c35]/10 rounded-full blur-3xl z-0"
      initial={{ opacity: 0, scale: 0.7, x: 100, y: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
    ></motion.div>
    <motion.main
      className="relative z-10 w-full max-w-3xl mx-auto text-center py-16 sm:py-24 flex flex-col items-center pt-8"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 60 }}
    >
      <motion.h1
        className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        Get things done with Cloud<span className="text-[#ff5c35] font-extrabold italic relative">Notes</span>
      </motion.h1>
      {isLoggedIn ? (
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <p className="text-base sm:text-lg text-white mb-4">You are already logged in.</p>
          <a href="/home?addnote=1" className="px-6 py-3 rounded-full bg-[#ff5c35] text-white font-bold shadow hover:bg-[#ff784e] transition">Create+</a>
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-2 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-[#ff5c35] text-[#ff5c35] bg-transparent font-semibold text-lg transition hover:bg-[#ff5c35] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff5c35] focus:ring-offset-2 shadow-md">
            Login
          </Link>
          <Link to="/signup" className="w-full sm:w-auto px-8 py-4 my-4 rounded-full bg-[#ff5c35] text-white font-semibold text-lg transition hover:bg-[#ff784e] focus:outline-none focus:ring-2 focus:ring-[#ff5c35] focus:ring-offset-2 shadow-md">
            Sign Up
          </Link>
        </motion.div>
      )}
      <div className="w-full flex flex-col md:flex-row gap-4 sm:gap-8 justify-center items-stretch mb-12">
        {[{
          icon: 'fas fa-lock',
          title: 'Private & Secure',
          desc: 'Your notes are always encrypted and only accessible by you. Privacy is our top priority.'
        }, {
          icon: 'fas fa-bolt',
          title: 'Fast & Effortless',
          desc: 'Instantly capture ideas, tasks, and todos. Everything syncs in real time across all your devices.'
        }, {
          icon: 'fas fa-palette',
          title: 'Beautiful & Organized',
          desc: 'Enjoy a clean, modern interface that keeps your notes organized and easy to find—no clutter, just clarity.'
        }].map((card, i) => (
          <motion.div
            key={card.title}
            className="flex-1 bg-[#23243a] rounded-2xl shadow-lg p-4 sm:p-8 flex flex-col items-start text-left border border-[#23243a]"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#ff5c35]/10 mb-4">
              <i className={`${card.icon} text-[#ff5c35] text-2xl`}></i>
          </div>
            <h3 className="text-white text-lg sm:text-2xl font-bold mb-2">{card.title}</h3>
            <p className="text-[#b0b3c6] text-base mb-4">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.main>
  </motion.div>
);

export default Ihome;
