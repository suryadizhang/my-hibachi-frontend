import React, { memo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { includedItems } from './menuData';

const IncludedSection = memo(() => {
  return (
    <div className="included-section p-5">
      <div className="text-center mb-5">
        <h2 className="section-title mb-4">
          <span className="emoji-visible" style={{ fontSize: '1.2em' }}>🍽️</span>
          <span className="ms-3">What's Included</span>
        </h2>
        <p className="text-muted fs-5">Every meal comes with these delicious accompaniments</p>
      </div>
      
      <Row className="mb-5">
        <Col lg={6} className="mb-4">
          {includedItems.slice(0, 3).map((item, index) => (
            <div key={item.name} className="included-item">
              <span className="included-icon emoji-visible">{item.icon}</span>
              <div className="included-content">
                <h5 className="included-title">{item.name}</h5>
                <p className="included-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </Col>
        <Col lg={6} className="mb-4">
          {includedItems.slice(3).map((item, index) => (
            <div key={item.name} className="included-item">
              <span className="included-icon emoji-visible">{item.icon}</span>
              <div className="included-content">
                <h5 className="included-title">{item.name}</h5>
                <p className="included-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
});

IncludedSection.displayName = 'IncludedSection';
export default IncludedSection;
