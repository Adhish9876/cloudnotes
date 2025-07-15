import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Dynamic host selection for local/dev and production
function getApiHost() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  return 'https://cloudnotes-d60l.onrender.com';
}

export default function Signup() {
  const Host = getApiHost();
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
      // Firebase signup
      const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      const idToken = await userCredential.user.getIdToken();
      // Call backend to create user in MongoDB
      const response = await fetch(`${Host}/api/auth/createuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username,
          email: credentials.email,
          password: credentials.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Backend signup failed');
        // Optionally: delete Firebase user if backend fails
        await userCredential.user.delete();
        return;
      }
      localStorage.setItem('token', idToken);
      localStorage.setItem('userEmail', credentials.email);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      localStorage.setItem('token', idToken);
      localStorage.setItem('userEmail', result.user.email);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Google sign up failed");
    }
  };

  return (
    <div className="relative min-h-screen w-screen bg-gradient-to-br from-[#23243a] via-[#191A23] to-[#23243a] flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-md bg-[#23243a] rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-center mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Create your CloudNotes account</h2>
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg px-4 py-2 mb-4 text-center text-sm">{error}</div>}
        <button
          className="w-full py-3 rounded-xl border border-[#e5e7eb] bg-white text-[#191A23] font-semibold flex items-center justify-center gap-2 shadow hover:bg-[#f3f4f6] transition mb-4"
          type="button"
          onClick={handleGoogleSignup}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-[#393a4d]" />
          <span className="mx-2 text-[#b0b3c6] text-xs">or</span>
          <div className="flex-grow h-px bg-[#393a4d]" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-white font-semibold mb-2 text-sm">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-[#b0b3c6] text-white transition text-base"
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
            <label htmlFor="email" className="block text-white font-semibold mb-2 text-sm">Email address</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-[#b0b3c6] text-white transition text-base"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white font-semibold mb-2 text-sm">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-[#23243a] focus:ring-2 focus:ring-[#ff5c35] focus:border-[#ff5c35] bg-[#191A23] placeholder-[#b0b3c6] text-white transition text-base"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              required
              minLength={8}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-[#ff5c35] text-white font-bold text-lg shadow hover:bg-[#ff784e] transition mt-2">Sign Up</button>
        </form>
        <p className="mt-6 text-center text-[#b0b3c6] text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#ff5c35] hover:underline font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}
