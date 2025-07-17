import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Ihome from "./components/Ihome";
import NoteState from "./context/notes/noteState";
import Alert from "./components/Alert";
import Footer from "./components/Footer";
import AllNotes from "./components/AllNotes";
import { auth } from './firebase';

function App() {
  const [alertMessage, setAlertMessage] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        localStorage.setItem('token', idToken);
        localStorage.setItem('userEmail', firebaseUser.email);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
      }
    });
    return () => unsubscribe();
  }, []);

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage("") , 2500);
  };

  function AppLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const hideNavbar = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup";
    // Redirect to /home after login if user is on /
    React.useEffect(() => {
      if (!authLoading && user && location.pathname === "/") {
        navigate("/home", { replace: true });
      }
    }, [authLoading, user, location.pathname, navigate]);
    if (authLoading) return <div className="flex items-center justify-center min-h-screen bg-[#191A23] text-white text-xl">Loading...</div>;
    return (
      <>
        {!hideNavbar && <Navbar search={search} setSearch={setSearch} />}
        {alertMessage && <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"><Alert message={alertMessage} /></div>}
        <Routes>
          <Route path="/" element={<Ihome />} />
          <Route path="/about" element={<About />} />
          <Route path="/home" element={user ? <Home showAlert={showAlert} /> : <Navigate to="/" replace />} />
          <Route path="/allnotes" element={<AllNotes showAlert={showAlert} search={search} setSearch={setSearch} />} />
          <Route path="/login" element={<Login showAlert={showAlert} />} />
          <Route path="/signup" element={<Signup showAlert={showAlert} />} />
        </Routes>
        {!hideNavbar && <Footer />}
      </>
    );
  }

  return (
    <NoteState>
      <Router>
        <AppLayout />
      </Router>
    </NoteState>
  );
}

export default App;
