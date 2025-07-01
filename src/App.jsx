import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from "./components/Navbar";
import About from "./components/About";
import Menu from "./components/Menu";
import Reviews from "./components/Reviews";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";

// Step 5: Add AdminPanel component (CRITICAL TEST)
function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <div style={{
          padding: '10px',
          backgroundColor: 'lightgreen',
          border: '2px solid green',
          marginBottom: '20px'
        }}>
          <h2>� TESTING ORIGINAL AdminPanel with Fixed API</h2>
          <p>Testing if API config was the root cause</p>
        </div>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
