import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import hibachiLogo from '../assets/My Hibachi logo.png'; // Adjust path if necessary

const Navbar = () => (
  <nav
    className="navbar"
    style={{
      display: "flex",
      alignItems: "center",
      padding: "10px 24px",
      background: "#000",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}
  >
    <a href="/" className="navbar-brand" style={{ display: "flex", alignItems: "center" }}>
      <img
        src={hibachiLogo}
        alt="My Hibachi Logo"
        style={{ height: '200px', objectFit: 'contain' }}
      />
    </a>
    <div style={{ flex: 1 }}>
      <Nav className="ms-auto justify-content-end" style={{ display: "flex", width: "100%" }}>
        <Nav.Link as={Link} to="/" className="mx-2" style={{ color: "#FFD700", fontWeight: "bold" }}>About</Nav.Link>
        <Nav.Link as={Link} to="/services" className="mx-2" style={{ color: "#FFD700", fontWeight: "bold" }}>Book now</Nav.Link>
        <Nav.Link as={Link} to="/menu" className="mx-2" style={{ color: "#FFD700", fontWeight: "bold" }}>Menu</Nav.Link>
        <Nav.Link as={Link} to="/reviews" className="mx-2" style={{ color: "#FFD700", fontWeight: "bold" }}>Reviews</Nav.Link>
        <Nav.Link as={Link} to="/faqs" className="mx-2" style={{ color: "#FFD700", fontWeight: "bold" }}>FAQs</Nav.Link>
        <Nav.Link as={Link} to="/contact" className="mx-2" style={{ color: "#FFD700", fontWeight: "bold" }}>Contact</Nav.Link>
      </Nav>
    </div>
  </nav>
);

export default Navbar;
