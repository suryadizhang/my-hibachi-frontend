'use client'

import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import MissingFieldsModal from "./MissingFieldsModal";

const proteins = [
  { name: "Chicken", adultExtra: 0, childExtra: 0 },
  { name: "NY Strip Steak", adultExtra: 0, childExtra: 0 },
  { name: "Filet Mignon", adultExtra: 10, childExtra: 5 },
  { name: "Calamari", adultExtra: 0, childExtra: 0 },
  { name: "Shrimp", adultExtra: 0, childExtra: 0 },
  { name: "Scallops", adultExtra: 5, childExtra: 5 },
  { name: "Lobster Tail", adultExtra: 20, childExtra: 15 },
  { name: "Salmon", adultExtra: 5, childExtra: 5 },
  { name: "Tofu", adultExtra: 0, childExtra: 0 }
];

function PartyGuestProteinForm() {
  const [adults, setAdults] = useState(10);
  const [children, setChildren] = useState(0);
  const [adultProteins, setAdultProteins] = useState([]);
  const [childProteins, setChildProteins] = useState([]);
  const [adultProteinCount, setAdultProteinCount] = useState(2);
  const [childProteinCount, setChildProteinCount] = useState(2);
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const perAdult = 55;
  const perChild = 25;

  // Validation functions
  const getMissingFields = () => {
    const missing = [];
    if (adults < 10) missing.push('Minimum 10 Adults Required');
    if (adults > 100) missing.push('Maximum 100 Adults Allowed');
    if (adultProteins.length < adultProteinCount) {
      missing.push(`Select ${adultProteinCount} Adult Proteins (${adultProteins.length}/${adultProteinCount} selected)`);
    }
    if (children > 0 && childProteins.length < childProteinCount) {
      missing.push(`Select ${childProteinCount} Child Proteins (${childProteins.length}/${childProteinCount} selected)`);
    }
    return missing;
  };

  function handleProteinChange(selected, setSelected, count) {
    return (e) => {
      const { value, checked } = e.target;
      let updated = checked
        ? [...selected, value]
        : selected.filter((item) => item !== value);

      // Allow only up to count, else ignore
      if (updated.length > count) return;
      setSelected(updated);
    };
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const missingFields = getMissingFields();
    
    if (missingFields.length > 0) {
      setShowMissingFieldsModal(true);
    } else {
      // Simulate successful submission
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  // Adult proteins: if choose 3, extra $10/adult/child
  const adultProteinExtra =
    adultProteinCount === 3 ? adults * 10 : 0;
  const childProteinExtra =
    childProteinCount === 3 ? children * 10 : 0;

  // Add protein upcharge
  function calcProteinUpcharge(selected, group, child = false) {
    let total = 0;
    for (const protein of selected) {
      const proteinInfo = proteins.find((p) => p.name === protein);
      if (!proteinInfo) continue;
      total += (child ? proteinInfo.childExtra : proteinInfo.adultExtra) * group;
    }
    return total;
  }

  // Noodles upcharge
  const [adultNoodles, setAdultNoodles] = useState(false);
  const [childNoodles, setChildNoodles] = useState(false);

  const noodleExtra =
    (adultNoodles ? adults : 0) * 5 + (childNoodles ? children : 0) * 5;

  // Total cost
  const total =
    adults * perAdult +
    children * perChild +
    adultProteinExtra +
    childProteinExtra +
    calcProteinUpcharge(adultProteins, adults) +
    calcProteinUpcharge(childProteins, children, true) +
    noodleExtra;

  return (
    <Card className="p-4 my-4" style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2 style={{ color: "#2d3748", marginBottom: "0.5rem" }}>
          <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>🍽️</span>
          Party Guests & Protein Calculator
        </h2>
        <p style={{ color: "#718096", margin: "0" }}>
          Calculate your hibachi party cost and select proteins for all guests
        </p>
      </div>

      {submitted && (
        <Alert variant="success" className="mb-4">
          <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>✅</span>
          <strong>Order Details Submitted!</strong> We'll contact you shortly to confirm your booking.
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600", color: "#4a5568" }}>
                <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>👥</span>
                Number of Adults (10-100)
              </Form.Label>
              <Form.Control
                type="number"
                min={10}
                max={100}
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                style={{
                  borderRadius: "8px",
                  border: adults < 10 || adults > 100 ? "2px solid #f56565" : "2px solid #e2e8f0",
                  padding: "0.75rem"
                }}
                isInvalid={adults < 10 || adults > 100}
              />
              <Form.Control.Feedback type="invalid">
                Please enter between 10-100 adults.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600", color: "#4a5568" }}>
                <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>👶</span>
                Number of Children (12 & under)
              </Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                style={{
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  padding: "0.75rem"
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Adult Protein Selection */}
        <div style={{ 
          background: "#f8fafc", 
          padding: "1.5rem", 
          borderRadius: "12px", 
          marginBottom: "2rem",
          border: "1px solid #e2e8f0"
        }}>
          <h4 style={{ color: "#2d3748", marginBottom: "1rem" }}>
            <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>🥩</span>
            Adult Protein Selection
          </h4>
          
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "600", color: "#4a5568" }}>
              Number of Proteins per Adult
            </Form.Label>
            <Form.Select
              value={adultProteinCount}
              onChange={(e) => {
                setAdultProteinCount(Number(e.target.value));
                setAdultProteins([]);
              }}
              style={{
                borderRadius: "8px",
                border: "2px solid #e2e8f0",
                padding: "0.75rem",
                maxWidth: "300px"
              }}
            >
              <option value={2}>2 Proteins (included)</option>
              <option value={3}>3 Proteins (+$10/adult)</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "600", color: "#4a5568" }}>
              Choose Adult Proteins ({adultProteins.length}/{adultProteinCount} selected)
            </Form.Label>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
              gap: "0.5rem",
              marginTop: "0.5rem"
            }}>
              {proteins.map((protein) => (
                <Form.Check
                  key={protein.name + "adult"}
                  type="checkbox"
                  label={`${protein.name}${protein.adultExtra ? ` (+$${protein.adultExtra})` : ""}`}
                  value={protein.name}
                  checked={adultProteins.includes(protein.name)}
                  disabled={
                    !adultProteins.includes(protein.name) &&
                    adultProteins.length >= adultProteinCount
                  }
                  onChange={handleProteinChange(adultProteins, setAdultProteins, adultProteinCount)}
                  style={{
                    padding: "0.5rem",
                    background: adultProteins.includes(protein.name) ? "#e6fffa" : "white",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0"
                  }}
                />
              ))}
            </div>
          </Form.Group>
          
          <Form.Check
            type="checkbox"
            label="Add Noodles ($5 per adult)"
            checked={adultNoodles}
            onChange={(e) => setAdultNoodles(e.target.checked)}
            style={{
              padding: "0.5rem",
              background: "#fff",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              marginTop: "1rem"
            }}
          />
        </div>

        {/* Child Protein Selection */}
        {children > 0 && (
          <div style={{ 
            background: "#f0fff4", 
            padding: "1.5rem", 
            borderRadius: "12px", 
            marginBottom: "2rem",
            border: "1px solid #c6f6d5"
          }}>
            <h4 style={{ color: "#2d3748", marginBottom: "1rem" }}>
              <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>🧒</span>
              Child Protein Selection
            </h4>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600", color: "#4a5568" }}>
                Number of Proteins per Child
              </Form.Label>
              <Form.Select
                value={childProteinCount}
                onChange={(e) => {
                  setChildProteinCount(Number(e.target.value));
                  setChildProteins([]);
                }}
                style={{
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  padding: "0.75rem",
                  maxWidth: "300px"
                }}
              >
                <option value={2}>2 Proteins (included)</option>
                <option value={3}>3 Proteins (+$10/child)</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600", color: "#4a5568" }}>
                Choose Child Proteins ({childProteins.length}/{childProteinCount} selected)
              </Form.Label>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                gap: "0.5rem",
                marginTop: "0.5rem"
              }}>
                {proteins.map((protein) => (
                  <Form.Check
                    key={protein.name + "child"}
                    type="checkbox"
                    label={`${protein.name}${protein.childExtra ? ` (+$${protein.childExtra})` : ""}`}
                    value={protein.name}
                    checked={childProteins.includes(protein.name)}
                    disabled={
                      !childProteins.includes(protein.name) &&
                      childProteins.length >= childProteinCount
                    }
                    onChange={handleProteinChange(childProteins, setChildProteins, childProteinCount)}
                    style={{
                      padding: "0.5rem",
                      background: childProteins.includes(protein.name) ? "#e6fffa" : "white",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0"
                    }}
                  />
                ))}
              </div>
            </Form.Group>
            
            <Form.Check
              type="checkbox"
              label="Add Noodles ($5 per child)"
              checked={childNoodles}
              onChange={(e) => setChildNoodles(e.target.checked)}
              style={{
                padding: "0.5rem",
                background: "#fff",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                marginTop: "1rem"
              }}
            />
          </div>
        )}

        {/* Cost Breakdown */}
        <div style={{ 
          background: "#fff", 
          padding: "1.5rem", 
          borderRadius: "12px", 
          border: "2px solid #e2e8f0",
          marginBottom: "2rem"
        }}>
          <h4 style={{ color: "#2d3748", marginBottom: "1rem" }}>
            <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>💰</span>
            Cost Breakdown
          </h4>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "1rem" 
          }}>
            <div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
                  <strong>Adults:</strong> {adults} × $55 = <span style={{ color: "#059669" }}>${adults * perAdult}</span>
                </li>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
                  <strong>Children:</strong> {children} × $25 = <span style={{ color: "#059669" }}>${children * perChild}</span>
                </li>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
                  <strong>Extra protein (adults):</strong> <span style={{ color: "#d69e2e" }}>${adultProteinExtra}</span>
                </li>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
                  <strong>Extra protein (children):</strong> <span style={{ color: "#d69e2e" }}>${childProteinExtra}</span>
                </li>
              </ul>
            </div>
            <div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
                  <strong>Protein upcharge (adults):</strong> <span style={{ color: "#d69e2e" }}>${calcProteinUpcharge(adultProteins, adults)}</span>
                </li>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
                  <strong>Protein upcharge (children):</strong> <span style={{ color: "#d69e2e" }}>${calcProteinUpcharge(childProteins, children, true)}</span>
                </li>
                <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #e2e8f0" }}>
                  <strong>Noodles:</strong> <span style={{ color: "#d69e2e" }}>${noodleExtra}</span>
                </li>
                <li style={{ padding: "0.5rem 0", fontSize: "1.2rem", fontWeight: "bold" }}>
                  <strong>Total:</strong> <span style={{ color: "#059669" }}>${total}</span>
                </li>
              </ul>
            </div>
          </div>
          <div style={{ 
            marginTop: "1rem", 
            padding: "1rem", 
            background: "#f0f9ff", 
            borderRadius: "8px",
            fontSize: "0.9rem",
            color: "#0c4a6e"
          }}>
            <strong>Included:</strong> Cold sake, fried rice, fresh vegetables, side salad, signature sauce.<br />
            <strong>Extra:</strong> Noodles ($5 side).
          </div>
        </div>

        {/* Submit Section */}
        <div style={{ textAlign: "center" }}>
          <Button
            type="submit"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "25px",
              padding: "1rem 2rem",
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "white",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
            }}
          >
            <span className="emoji-visible">📋</span>
            Submit Order Details
          </Button>
          
          {/* Missing Fields Warning */}
          {getMissingFields().length > 0 && (
            <div style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "8px",
              fontSize: "0.9rem",
              color: "#856404",
              maxWidth: "500px",
              margin: "1rem auto 0"
            }}>
              <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>⚠️</span>
              <strong>Please complete:</strong>
              <ul style={{ margin: "0.5rem 0 0 0", textAlign: "left" }}>
                {getMissingFields().map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Form>

      {/* Missing Fields Modal */}
      <MissingFieldsModal
        show={showMissingFieldsModal}
        onClose={() => setShowMissingFieldsModal(false)}
        missingFields={getMissingFields()}
        title="Complete Party Details"
        subtitle="Please complete all required selections before submitting your order."
      />
    </Card>
  );
}

export default PartyGuestProteinForm;
