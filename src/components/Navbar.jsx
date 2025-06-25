import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import hibachiLogo from '../assets/My Hibachi logo.png';

const navLinkStyle = {
  color: "#FFD700",
  fontWeight: "bold",
  textShadow: "0 0 2px #000",
  fontSize: "1rem",
  padding: "0.35rem 0.5rem", // smaller padding for less height
  lineHeight: 1
};

const CustomNavbar = () => {
  const location = useLocation();

  return (
    <Navbar
      expand="lg"
      sticky="top"
      bg="dark"
      variant="dark"
      className="py-0"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)", minHeight: 44 }}
    >
      {/* Smaller container and logo */}
      <Container fluid style={{ maxWidth: 600, paddingLeft: 8, paddingRight: 8 }}>
        <Navbar.Brand as={Link} to="/" style={{ display: "flex", alignItems: "center", padding: 0 }}>
          <img
            src={hibachiLogo}
            alt="My Hibachi Logo"
            width="28"
            height="12"
            loading="eager"
            style={{ objectFit: 'contain', display: 'block' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto text-center w-100" style={{ justifyContent: "flex-end" }}>
            <Nav.Link
              as={Link}
              to="/"
              style={{
                ...navLinkStyle,
                borderBottom: location.pathname === "/" ? "2px solid #FFD700" : "none"
              }}
            >
              About
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/services"
              style={{
                ...navLinkStyle,
                borderBottom: location.pathname === "/services" ? "2px solid #FFD700" : "none"
              }}
            >
              Book Now
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/menu"
              style={{
                ...navLinkStyle,
                borderBottom: location.pathname === "/menu" ? "2px solid #FFD700" : "none"
              }}
            >
              Menu
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/reviews"
              style={{
                ...navLinkStyle,
                borderBottom: location.pathname === "/reviews" ? "2px solid #FFD700" : "none"
              }}
            >
              Reviews
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/faqs"
              style={{
                ...navLinkStyle,
                borderBottom: location.pathname === "/faqs" ? "2px solid #FFD700" : "none"
              }}
            >
              FAQs
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contact"
              style={{
                ...navLinkStyle,
                borderBottom: location.pathname === "/contact" ? "2px solid #FFD700" : "none"
              }}
            >
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
