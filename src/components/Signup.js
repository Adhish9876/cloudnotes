import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const Host = "http://localhost:5000";
  const [credentials, setCredentials] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${Host}/api/auth/createuser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.setItem('token', json.authtoken);
        localStorage.setItem('userEmail', credentials.email);
        navigate('/Login');
      } else {
        setError(json.error || (json.errors ? json.errors[0].msg : 'Signup failed'));
      }
    } catch {
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191A23]">
      <div className="bg-[#23243a] rounded-2xl shadow-2xl p-14 w-full max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create your CloudNotes account</h2>
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg px-4 py-2 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-white font-semibold mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-[#b0b3c6] text-white transition"
              id="username"
              name="username"
              value={credentials.username}
              onChange={onChange}
              required
              minLength={3}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-white font-semibold mb-2">Email address</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-[#b0b3c6] text-white transition"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white font-semibold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-[#b0b3c6] text-white transition"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              required
              minLength={8}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-[#ff5c35] text-white font-bold text-lg shadow hover:bg-[#ff784e] transition">Sign Up</button>
        </form>
        {/* Google Sign Up Button Placeholder */}
        <button className="w-full mt-4 py-3 rounded-xl border border-[#e5e7eb] bg-white text-[#191A23] font-semibold flex items-center justify-center gap-2 shadow hover:bg-[#f3f4f6] transition">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>
        <p className="mt-6 text-center text-[#b0b3c6]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#ff5c35] hover:underline font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}
