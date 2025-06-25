import React from 'react';
import { Card, Row, Col, Badge, ListGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Menu.css';

const proteinOptions = ['Chicken', 'NY Strip Steak', 'Shrimp', 'Salmon', 'Tofu'];

const upgradeOptions = [
  { name: 'Stir-fried Noodles', extra: 5 },
  { name: 'Scallops', extra: 5 },
  { name: 'Filet Mignon', extra: 5 },
  { name: 'Lobster Tail', extra: 10 },
  { name: '3rd Protein', extra: 10 },
];

// Sort upgrades cheapest to most expensive
const sortedUpgrades = [...upgradeOptions].sort((a, b) => a.extra - b.extra);

const Menu = () => (
  <Card className="p-4 shadow-lg rounded-4 menu-silver-garden-bg">
    <h1 className="mb-4 text-center fw-bold menu-silver-garden" aria-label="My Hibachi Menu">
      🍱 My Hibachi Menu
    </h1>

    <Alert variant="info" className="text-center fs-5 mb-4 menu-silver-garden">
      <strong>PRICING</strong><br />
      <span className="fs-4 text-danger">$55.00</span> <span>per adult</span> &nbsp;|&nbsp;
      <span className="fs-4 text-primary">$30.00</span> <span>per child</span>
      <br />
      <span className="text-muted fs-6">
        <em>*Not including tip</em>
      </span>
      <br />
      <span className="text-muted">
        <strong>Party Minimum: $550.00</strong> (example: 10 adults). Includes all items except chef tip, upgrades, and travel if applicable.
      </span>
      <br />
      <span className="text-muted">
        <strong>13 and older:</strong> Adult price. &nbsp; 
        <strong>Ages 6–12:</strong> $30. &nbsp; 
        <strong>5 and under:</strong> 
        <span style={{ color: 'red', fontWeight: 'bold' }}> Free!</span>
      </span>
    </Alert>

    <Card className="mb-4 border-0 shadow-sm menu-silver-garden-bg">
      <Card.Body>
        <h2 className="menu-silver-garden text-success mb-3">Included with Every Meal</h2>
        <p className="menu-silver-garden fs-5">
          Every order includes <strong>fried rice</strong>, <strong>mixed vegetables</strong>, a <strong>side salad</strong>, and our signature sauces.
          <br />
          Guests choose <strong>2 proteins</strong> from the list below:
        </p>

        <Row>
          <Col md={6}>
            <h3 className="fs-5 fw-bold mb-2">Protein Choices</h3>
            <ListGroup variant="flush">
              {proteinOptions.map(name => (
                <ListGroup.Item key={name} className="menu-silver-garden fs-5 border-0">
                  {name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={6}>
            <h3 className="fs-5 fw-bold mb-2">Upgrade Options</h3>
            <ListGroup variant="flush">
              {sortedUpgrades.map(({ name, extra }) => (
                <ListGroup.Item key={name} className="menu-silver-garden fs-5 border-0 d-flex justify-content-between">
                  <span>{name}</span>
                  <Badge bg="warning" text="dark">+${extra.toFixed(2)}</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Card.Body>
    </Card>

    <div className="d-flex justify-content-center mt-4">
      <Link to="/services" aria-label="Order your hibachi experience now">
        <button className="btn btn-dark btn-lg px-5 shadow menu-silver-garden">
          Order Now
        </button>
      </Link>
    </div>
  </Card>
);

export default Menu;
