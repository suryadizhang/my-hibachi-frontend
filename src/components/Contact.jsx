import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaSms, FaInstagram, FaFacebook } from 'react-icons/fa';

const Contact = () => (
  <Card className="p-4 shadow" style={{ maxWidth: 500, margin: "40px auto", borderRadius: 18 }}>
    <h2 className="mb-4 text-center" style={{ color: "#FFD700", fontWeight: "bold" }}>Contact Us</h2>
    <Row className="mb-3 align-items-center">
      <Col xs="auto"><FaEnvelope style={{ color: "#FFD700" }} /></Col>
      <Col>
        <a href="mailto:info@myhibachi.com" style={{ color: "#222", textDecoration: "none" }}>
          info@myhibachi.com
        </a>
      </Col>
    </Row>
   
    <Row className="mb-3 align-items-center">
      <Col xs="auto"><FaSms style={{ color: "#FFD700" }} /></Col>
      <Col>
        <a href="sms:+19167408768" style={{ color: "#222", textDecoration: "none" }}>
          +1 (916) 740-8768
        </a>
        <span className="ms-2 text-muted" style={{ fontSize: "0.95em" }}>
          (Text only, call by appointment)
        </span>
      </Col>
    </Row>
    <Row className="mb-3 align-items-center">
      <Col xs="auto"><FaInstagram style={{ color: "#E4405F" }} /></Col>
      <Col>
        <a
          href="https://www.instagram.com/my_hibachi/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#E4405F", textDecoration: "none", fontWeight: 500 }}
        >
          @my_hibachi
        </a>
      </Col>
    </Row>
    <Row className="align-items-center">
      <Col xs="auto"><FaFacebook style={{ color: "#1877F3" }} /></Col>
      <Col>
        <a
          href="https://www.facebook.com/profile.php?id=61577483702847#"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1877F3", textDecoration: "none", fontWeight: 500 }}
        >
          My Hibachi Facebook Page
        </a>
      </Col>
    </Row>
  </Card>
);

export default Contact;
