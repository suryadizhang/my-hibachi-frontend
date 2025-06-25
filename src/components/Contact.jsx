import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaEnvelope, FaSms, FaInstagram, FaFacebook } from 'react-icons/fa';

const Contact = () => (
  <Card
    className="p-4 shadow"
    style={{ maxWidth: 550, margin: "40px auto", borderRadius: 18 }}
    aria-label="Contact card for My Hibachi"
  >
    <h1 className="mb-4 text-center" style={{ color: "#FFD700", fontWeight: "bold" }}>
      Contact Us
    </h1>

    <Row className="mb-3 align-items-center">
      <Col xs="auto" aria-hidden="true"><FaEnvelope style={{ color: "#FFD700" }} /></Col>
      <Col>
        <a
          href="mailto:info@myhibachi.com"
          style={{ color: "#222", textDecoration: "none" }}
          aria-label="Email My Hibachi"
        >
          info@myhibachi.com
        </a>
      </Col>
    </Row>

    <Row className="mb-3 align-items-center">
      <Col xs="auto" aria-hidden="true"><FaSms style={{ color: "#FFD700" }} /></Col>
      <Col>
        <a
          href="sms:+19167408768"
          style={{ color: "#222", textDecoration: "none" }}
          aria-label="Send SMS to My Hibachi"
        >
          +1 (916) 740-8768
        </a>
        <div className="text-muted" style={{ fontSize: "0.9em" }}>
          (Text only, call by appointment)
        </div>
      </Col>
    </Row>

    <Row className="mb-3 align-items-center">
      <Col xs="auto" aria-hidden="true"><FaInstagram style={{ color: "#E4405F" }} /></Col>
      <Col>
        <a
          href="https://www.instagram.com/my_hibachi/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#E4405F", textDecoration: "none", fontWeight: 500 }}
          aria-label="Visit My Hibachi on Instagram"
        >
          @my_hibachi
        </a>
      </Col>
    </Row>

    <Row className="align-items-center">
      <Col xs="auto" aria-hidden="true"><FaFacebook style={{ color: "#1877F3" }} /></Col>
      <Col>
        <a
          href="https://www.facebook.com/profile.php?id=61577483702847"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1877F3", textDecoration: "none", fontWeight: 500 }}
          aria-label="Visit My Hibachi Facebook page"
        >
          My Hibachi Facebook Page
        </a>
      </Col>
    </Row>
  </Card>
);

export default Contact;
