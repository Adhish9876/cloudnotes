import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Ihome from "./components/Ihome"; // New Ihome page
import NoteState from "./context/notes/noteState";
import Alert from "./components/Alert";
import Footer from "./components/Footer";
import AllNotes from "./components/AllNotes";

function AppContent({ showAlert, alertMessage }) {
  const location = useLocation();
  // Hide Navbar on Ihome (landing page)
  const hideNavbar = location.pathname === "/"||location.pathname === "/login"||location.pathname === "/signup";

  // Add search/sort state for /allnotes
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest");

  // Reset search/sort when leaving /allnotes
  React.useEffect(() => {
    if (location.pathname !== "/allnotes") {
      setSearch("");
      setSort("Newest");
    }
  }, [location.pathname]);

  return (
    <>
      {!hideNavbar && (
        location.pathname === "/allnotes"
          ? <Navbar search={search} setSearch={setSearch} sort={sort} setSort={setSort} />
          : <Navbar />
      )}
      {alertMessage && <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"><Alert message={alertMessage} /></div>}
      <Routes>
        <Route path="/" element={<Ihome />} /> {/* Welcome Page */}
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<Home showAlert={showAlert} />} /> {/* After login */}
        <Route path="/allnotes" element={<AllNotes showAlert={showAlert} search={search} setSearch={setSearch} sort={sort} setSort={setSort} />} />
        <Route path="/login" element={<Login showAlert={showAlert} />} />
        <Route path="/signup" element={<Signup showAlert={showAlert} />} />
      </Routes>
      {!hideNavbar && <Footer />}
    </>
  );
}

function App() {
  const [alertMessage, setAlertMessage] = useState("");
  const showAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 2500);
  };
  return (
    <NoteState>
      <Router>
        <AppContent showAlert={showAlert} alertMessage={alertMessage} />
      </Router>
    </NoteState>
  );
}

export default App;
