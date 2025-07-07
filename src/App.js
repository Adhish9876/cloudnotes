import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Ihome from "./components/Ihome"; // New Ihome page
import NoteState from "./context/notes/noteState";

function AppContent() {
  const location = useLocation();
  // Hide Navbar on Ihome (landing page)
  const hideNavbar = location.pathname === "/"||location.pathname === "/login"||location.pathname === "/signup";
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Ihome />} /> {/* Welcome Page */}
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<Home />} /> {/* After login */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <NoteState>
      <Router>
        <AppContent />
      </Router>
    </NoteState>
  );
}

export default App;
