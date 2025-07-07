import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function Login() {
  const Host = "http://localhost:5000";
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const onChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
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
        // navigate('/Home');
      } else {
        setError(json.error || 'Login failed');
      }
    } catch {
      setError('Something went wrong. Try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      localStorage.setItem('token', idToken);
      localStorage.setItem('userEmail', result.user.email);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Google sign in failed");
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[#191A23] px-4">
      {/* Centered login box */}
      <div className="flex items-center justify-center h-full">
        {/* Shared Card Container */}
        <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden">
          {/* Left: Login Form */}
          <div className="w-full md:w-1/2 bg-[#23243a] p-14 flex flex-col justify-center">
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
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>

            <p className="mt-6 text-center text-[#b0b3c6]">
              Don't have an account?{' '}
              <button className="text-[#ff5c35] hover:underline font-semibold">Sign Up</button>
            </p>
          </div>

          {/* Right: Illustration */}
          <div className="w-full md:w-1/2 bg-[#ff5c35] p-14 flex items-center justify-center">
            <img
              src="/Login.png"
              alt="Cloud Illustration"
              className="w-full h-auto max-w-md object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Logout Button (Top Right Corner) */}
      {isLoggedIn && (
        <div className="absolute top-6 right-6">
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-full bg-[#ff5c35] text-white font-semibold shadow hover:bg-[#ff784e] transition"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
