import React, { memo } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import './Navbar.css';

const CustomNavbar = memo(() => {
  const pathname = usePathname();

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="custom-navbar sticky-top"
      variant="dark"
    >
      <Container fluid className="navbar-container">
        <Link href="/" className="navbar-brand navbar-brand-custom">
          <Image
            src="/assets/My Hibachi logo.png"
            alt="My Hibachi Logo"
            width={140}
            height={140}
            className="navbar-logo"
            priority={true}
          />
          <span className="brand-text">My Hibachi</span>
        </Link>
        
        <Navbar.Toggle 
          aria-controls="main-navbar-nav" 
          className="navbar-toggler-custom"
        />
        
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="navbar-nav-custom">
            {[
              { path: "/", label: "About", icon: "🏠" },
              { path: "/BookUs", label: "Book Now", icon: "📅" },
              { path: "/menu", label: "Menu", icon: "🍱" },
              { path: "/reviews", label: "Reviews", icon: "⭐" },
              { path: "/faqs", label: "FAQs", icon: "❓" },
              { path: "/contact", label: "Contact", icon: "📞" }
            ].map(({ path, label, icon }) => (
              <Nav.Item key={path}>
                <Link
                  href={path}
                  className={`nav-link nav-link-custom ${pathname === path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{icon}</span>
                  <span className="nav-text">{label}</span>
                </Link>
              </Nav.Item>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

CustomNavbar.displayName = 'CustomNavbar';

export default CustomNavbar;
