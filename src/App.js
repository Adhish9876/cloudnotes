import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Ihome from "./components/Ihome"; // New Ihome page
import NoteState from "./context/notes/noteState";

function App() {
  return (
    <NoteState>
      <Router>
        <Navbar />

        <div className="container">
          <Routes>
            <Route path="/" element={<Ihome />} /> {/* Welcome Page */}
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} /> {/* After login */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </NoteState>
  );
}

export default App;
