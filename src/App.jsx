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
import AdminPanel from "./components/AdminPanel-test-modal";

// Step 5: Add AdminPanel component (CRITICAL TEST)
function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <div style={{
          padding: '10px',
          backgroundColor: 'lightcoral',
          border: '2px solid darkred',
          marginBottom: '20px'
        }}>
          <h2>⚠️ STEP 5 - Added AdminPanel Component</h2>
          <p>If this shows blank, AdminPanel is the problem!</p>
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
