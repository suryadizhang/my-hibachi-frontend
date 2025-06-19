import React from 'react';
import { Card, Row, Col, Badge, ListGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Menu.css';

const proteinOptions = [
  { name: 'Chicken' },
  { name: 'NY Strip Steak' },
  { name: 'Shrimp' },
  { name: 'Salmon' },
  { name: 'Tofu' },
];

const upgradeOptions = [
  { name: 'Stir-fried Noodles', extra: 5 },
  { name: 'Scallops', extra: 5 },
  { name: 'Filet Mignon', extra: 5 },
  { name: 'Lobster Tail', extra: 10 },
  { name: '3rd Protein', extra: 10 },
];

// Sort upgrades by price (cheapest first)
const sortedUpgrades = [...upgradeOptions].sort((a, b) => a.extra - b.extra);

const Menu = () => (
  <Card className="p-4 shadow-lg rounded-4 menu-silver-garden-bg">
    <h2 className="mb-4 text-center fw-bold menu-silver-garden">🍱 My Hibachi Menu</h2>
    <Alert variant="info" className="menu-silver-garden text-center fs-5 mb-4">
      <strong>PRICING</strong><br />
      <span className="fs-4 text-danger">$55.00</span> <span>per adult</span> &nbsp;|&nbsp;
      <span className="fs-4 text-primary">$30.00</span> <span>per child</span>
      <br />
      <span className="text-muted fs-6">
        <em>*Not including tip</em>
      </span>
      <br />
      <span className="text-muted">
        <strong>*Party Minimum of $550.00</strong> (example: 10 adults). This includes everything but chef tip, optional upgrades, and possible travel fee.
      </span>
      <br />
      <span className="text-muted">
        <strong>*13 and older:</strong> adult price. &nbsp; <strong>Children 6-12:</strong> $30 each. &nbsp; <strong>Age 5 and under:</strong>  <span style={{ color: 'red', fontWeight: 'bold' }}>On us!</span>
      </span>
    </Alert>

    <Card className="mb-4 border-0 shadow-sm menu-silver-garden-bg">
      <Card.Body>
        <h3 className="menu-silver-garden text-success mb-3">MENU</h3>
        <p className="menu-silver-garden fs-5">
          All orders include <strong>fried rice</strong>, <strong>cooked veggies</strong>, <strong>side salad</strong> & <strong>signature sauces</strong>.<br />
          <span>Each guest picks <strong>2 Proteins</strong>:</span>
        </p>
        <Row>
          <Col md={6}>
            <ListGroup variant="flush" className="mb-3">
              {proteinOptions.map(opt => (
                <ListGroup.Item key={opt.name} className="menu-silver-garden fs-5 border-0">
                  {opt.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={6}>
            <div className="mb-2 menu-silver-garden fs-5"><strong>Menu Upgrades:</strong></div>
            <ListGroup variant="flush">
              {sortedUpgrades.map(opt => (
                <ListGroup.Item key={opt.name} className="menu-silver-garden fs-5 border-0">
                  {opt.name}
                  <Badge bg="warning" text="dark" className="ms-2">
                    +${opt.extra.toFixed(2)}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Card.Body>
    </Card>

    <div className="d-flex justify-content-center mt-4">
      <Link to="/services">
        <button className="btn btn-dark btn-lg menu-silver-garden px-5 shadow">
          Order Now
        </button>
      </Link>
    </div>
  </Card>
);

export default Menu;
