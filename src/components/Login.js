// Minor change: Added this comment to allow a new commit
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Dynamic host selection for local/dev and production
function getApiHost() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  return 'https://cloudnotes-d60l.onrender.com';
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
    <div className="relative h-screen w-screen bg-[#191A23] px-4">
      {/* Centered login box */}
      <div className="flex items-center justify-center h-full px-2 sm:px-4">
        {/* Shared Card Container */}
        <div className="flex flex-col-reverse md:flex-row w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden">
          {/* Left: Login Form */}
          <div className="w-full md:w-1/2 bg-[#23243a] p-4 sm:p-8 lg:p-14 flex flex-col justify-center">
            <div className="flex justify-center mb-6">
              <img src="/cloud.png" alt="Cloud Logo" className="w-12 h-12 object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign in to CloudNotes</h2>
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg px-4 py-2 mb-4 text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-white font-semibold mb-2">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-[#b0b3c6] text-white transition"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-white font-semibold mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={onChange}
                  minLength={8}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-[#b0b3c6] text-white transition"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-[#ff5c35] text-white font-bold text-lg shadow hover:bg-[#ff784e] transition"
              >
                Login
              </button>
            </form>

            {/* Google Sign In */}
            <button
              className="w-full mt-4 py-3 rounded-xl border border-[#e5e7eb] bg-white text-[#191A23] font-semibold flex items-center justify-center gap-2 shadow hover:bg-[#f3f4f6] transition"
              type="button"
              onClick={handleGoogleLogin}
              disabled={authenticating} // NEW
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              {authenticating ? 'Signing in...' : 'Sign in with Google'}
            </button>

            <p className="mt-6 text-center text-[#b0b3c6]">
              Don't have an account?{' '}
              <button className="text-[#ff5c35] hover:underline font-semibold" onClick={() => navigate('/signup')}>Sign Up</button>
            </p>
          </div>

          {/* Right: Illustration */}
          <div className="hidden md:flex w-full md:w-1/2 bg-[#ff5c35] p-4 sm:p-8 lg:p-14 items-center justify-center">
            <img
              src="/Login.png"
              alt="Cloud Illustration"
              className="w-full h-auto max-w-md object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
