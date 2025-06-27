import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import hibachiLogo from '../assets/My Hibachi logo.png';

const navLinkStyle = {
  color: "#FFD700",
  fontWeight: "bold",
  textShadow: "0 0 2px #000",
  fontSize: "1rem",
  padding: "0.35rem 0.5rem",
  lineHeight: 1,
  transition: "border-bottom 0.3s ease"
};

const CustomNavbar = () => {
  const location = useLocation();

  return (
    <Navbar
      expand="lg"
      sticky="top"
      style={{
        backgroundColor: "#1c1c1c", // Charcoal background
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        minHeight: 48
      }}
      variant="dark"
      className="py-0"
    >
      {/* Smaller container and logo */}
      <Container fluid style={{ maxWidth: 600, paddingLeft: 8, paddingRight: 8 }}>
        <Navbar.Brand as={Link} to="/" style={{ display: "flex", alignItems: "center", padding: 0 }}>
          <img
            src={hibachiLogo}
            alt="My Hibachi Logo"
            width="42"
            height="42"
            style={{ objectFit: 'contain', display: 'block' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto text-center w-100" style={{ justifyContent: "flex-end" }}>
            {[
              { path: "/", label: "About" },
              { path: "/services", label: "Book Now" },
              { path: "/menu", label: "Menu" },
              { path: "/reviews", label: "Reviews" },
              { path: "/faqs", label: "FAQs" },
              { path: "/contact", label: "Contact" }
            ].map(({ path, label }) => (
              <Nav.Link
                as={Link}
                key={path}
                to={path}
                style={{
                  ...navLinkStyle,
                  borderBottom: location.pathname === path ? "2px solid #FFD700" : "none"
                }}
              >
                {label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
