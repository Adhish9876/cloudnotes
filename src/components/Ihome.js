import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="container text-center my-5">
      <h1>Welcome to CloudNotes</h1>
      {!isLoggedIn && (
        <div className="mt-4">
          <Link to="/login" className="btn btn-primary mx-2">Login</Link>
          <Link to="/signup" className="btn btn-secondary mx-2">Sign Up</Link>
        </div>
      )}
    </div>
  );
}
