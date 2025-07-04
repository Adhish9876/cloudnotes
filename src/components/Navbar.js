import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  let location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in by token presence
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Ihome');
  };

  useEffect(() => {
    // For debugging current path
    console.log(location);
  }, [location]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

      <div className="container-fluid">
        <Link className="navbar-brand" to="/">CloudNotes</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
          aria-expanded="false" aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/" || location.pathname === "/home" ? "active" : ""}`}
                aria-current="page"
                to="/"
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
                to="/about"
              >
                About
              </Link>
            </li>

          </ul>

          <form className="d-flex" role="search" onSubmit={e => e.preventDefault()}>
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>

          <ul className="navbar-nav ms-3">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
                    to="/login"
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === "/signup" ? "active" : ""}`}
                    to="/signup"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Sign Out
                </button>
              </li>
            )}
          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
