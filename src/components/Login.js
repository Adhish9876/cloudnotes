import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Dynamic host selection for local/dev and production
function getApiHost() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  return 'https://cloudnotes-7.onrender.com';
}

export default function Login() {
  const Host = getApiHost();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [authenticating, setAuthenticating] = useState(false); // NEW
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  const onChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // Firebase email/password login
      // (If you want to use Firebase Auth state, you can use signInWithEmailAndPassword here)
      const response = await fetch(`${Host}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const json = await response.json();
      if (response.ok) {
        localStorage.setItem('token', json.authtoken);
        localStorage.setItem('userEmail', credentials.email);
        navigate('/home');
      } else {
        setError(json.error || 'Login failed');
      }
    } catch {
      setError('Something went wrong. Try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleGoogleLogin = async () => {
    setError("");
    setAuthenticating(true); // NEW
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      // Send the idToken to backend to get backend JWT
      const response = await fetch(`${Host}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const json = await response.json();
      if (response.ok) {
        localStorage.setItem('token', json.authtoken);
        localStorage.setItem('userEmail', result.user.email);
        navigate("/home");
      } else {
        setError(json.error || "Google login failed");
      }
    } catch (err) {
      if (err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || "Google sign in failed");
      }
      // else: ignore cancelled-popup-request
    }
    setAuthenticating(false); // NEW
  };

  return (
    <div className="relative min-h-screen w-screen bg-gradient-to-br from-[#23243a] via-[#191A23] to-[#23243a] flex items-center justify-center px-2 sm:px-4">
      {/* Centered login box */}
      <div className="w-full max-w-md bg-[#23243a] rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-center mx-auto">
        <div className="flex justify-center mb-6">
          <img src="/cloud.png" alt="Cloud Logo" className="w-12 h-12 object-contain" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Sign in to CloudNotes</h2>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg px-4 py-2 mb-4 text-center text-sm">
            {error}
          </div>
        )}
        <button
          className="w-full py-3 rounded-xl border border-[#e5e7eb] bg-white text-[#191A23] font-semibold flex items-center justify-center gap-2 shadow hover:bg-[#f3f4f6] transition mb-4"
          type="button"
          onClick={handleGoogleLogin}
          disabled={authenticating}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          {authenticating ? 'Signing in...' : 'Sign in with Google'}
        </button>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-[#393a4d]" />
          <span className="mx-2 text-[#b0b3c6] text-xs">or</span>
          <div className="flex-grow h-px bg-[#393a4d]" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-white font-semibold mb-2 text-sm">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-[#b0b3c6] text-white transition text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white font-semibold mb-2 text-sm">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              minLength={8}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-[#b0b3c6] text-white transition text-base"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#ff5c35] text-white font-bold text-lg shadow hover:bg-[#ff784e] transition mt-2"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-[#b0b3c6] text-sm">
          Don't have an account?{' '}
          <button className="text-[#ff5c35] hover:underline font-semibold" onClick={() => navigate('/signup')}>Sign Up</button>
        </p>
      </div>
    </div>
  );
}
