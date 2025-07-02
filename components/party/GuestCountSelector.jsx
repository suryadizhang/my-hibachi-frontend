import React, { memo } from 'react';
import { Form, Col } from 'react-bootstrap';
import { GUEST_LIMITS } from './partyData.js';

const GuestCountSelector = memo(({ 
  adults, 
  children, 
  onAdultsChange, 
  onChildrenChange 
}) => {
  return (
    <div className="row mb-4">
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: "600", color: "#4a5568" }}>
            <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>👥</span>
            Number of Adults ({GUEST_LIMITS.minAdults}-{GUEST_LIMITS.maxAdults})
          </Form.Label>
          <Form.Control
            type="number"
            min={GUEST_LIMITS.minAdults}
            max={GUEST_LIMITS.maxAdults}
            value={adults}
            onChange={(e) => onAdultsChange(Number(e.target.value))}
            style={{
              borderRadius: "8px",
              border: adults < GUEST_LIMITS.minAdults || adults > GUEST_LIMITS.maxAdults 
                ? "2px solid #f56565" 
                : "2px solid #e2e8f0",
              padding: "0.75rem"
            }}
            isInvalid={adults < GUEST_LIMITS.minAdults || adults > GUEST_LIMITS.maxAdults}
          />
          <Form.Control.Feedback type="invalid">
            Please enter between {GUEST_LIMITS.minAdults}-{GUEST_LIMITS.maxAdults} adults.
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
            onChange={(e) => onChildrenChange(Number(e.target.value))}
            style={{
              borderRadius: "8px",
              border: "2px solid #e2e8f0",
              padding: "0.75rem"
            }}
          />
        </Form.Group>
      </Col>
    </div>
  );
});

GuestCountSelector.displayName = 'GuestCountSelector';

export default GuestCountSelector;
