import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from "./components/Navbar";
import About from "./components/About";

// Minimal App with just Navbar and About (known to work)
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
          <h2>✅ MINIMAL APP - Just Navbar + About</h2>
          <p>This should work - testing baseline functionality</p>
        </div>
        <Routes>
          <Route path="/" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
