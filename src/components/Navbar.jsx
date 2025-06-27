import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import hibachiLogo from '../assets/My Hibachi logo.png';
import './Navbar.css';

const CustomNavbar = () => {
  const location = useLocation();

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="custom-navbar"
      variant="dark"
    >
      <Container fluid className="navbar-container">
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
          <img
            src={hibachiLogo}
            alt="My Hibachi Logo"
            className="navbar-logo"
          />
          <span className="brand-text">My Hibachi</span>
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="main-navbar-nav" 
          className="navbar-toggler-custom"
        />
        
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="navbar-nav-custom">
            {[
              { path: "/", label: "About", icon: "🏠" },
              { path: "/services", label: "Book Now", icon: "📅" },
              { path: "/menu", label: "Menu", icon: "🍱" },
              { path: "/reviews", label: "Reviews", icon: "⭐" },
              { path: "/faqs", label: "FAQs", icon: "❓" },
              { path: "/contact", label: "Contact", icon: "📞" }
            ].map(({ path, label, icon }) => (
              <Nav.Link
                as={Link}
                key={path}
                to={path}
                className={`nav-link-custom ${location.pathname === path ? 'active' : ''}`}
              >
                <span className="nav-icon">{icon}</span>
                <span className="nav-text">{label}</span>
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
