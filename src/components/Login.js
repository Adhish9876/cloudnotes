// Minor change: Added this comment to allow a new commit
// Updated backend URL to cloudnotes-d60l.onrender.com for production
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
  const [error, setError] = useState('');
  const [authenticating, setAuthenticating] = useState(false); // NEW
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  const handleGoogleLogin = async () => {
    setError("");
    setAuthenticating(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      // Call backend to get user info from MongoDB
      const response = await fetch(`${Host}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': idToken
        }
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Backend login failed');
        setAuthenticating(false);
        return;
      }
      localStorage.setItem('token', idToken);
      localStorage.setItem('userEmail', result.user.email);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Google sign in failed");
    }
    setAuthenticating(false);
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
            {/* Google Sign In Only */}
            <button
              className="w-full mt-4 py-3 rounded-xl border border-[#e5e7eb] bg-white text-[#191A23] font-semibold flex items-center justify-center gap-2 shadow hover:bg-[#f3f4f6] transition"
              type="button"
              onClick={handleGoogleLogin}
              disabled={authenticating}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              {authenticating ? 'Signing in...' : 'Sign in with Google'}
            </button>
           
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
