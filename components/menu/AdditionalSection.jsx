import React, { memo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { additionalOptions } from './menuData';

const AdditionalSection = memo(() => {
  return (
    <div className="additional-section p-5">
      <div className="text-center mb-5">
        <h2 className="section-title mb-4">
          <span className="emoji-visible" style={{ fontSize: '1.2em' }}>🍜</span>
          <span className="ms-3">Additional Options</span>
        </h2>
        <p className="text-muted fs-5">Enhance your hibachi experience with these add-ons</p>
      </div>
      
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="additional-grid">
            {additionalOptions.map((option, index) => (
              <div 
                key={option.name} 
                className="additional-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="additional-icon">
                  <span className="emoji-visible">{option.icon}</span>
                </div>
                <div className="additional-content">
                  <h5 className="additional-name">{option.name}</h5>
                  <p className="additional-desc">{option.description}</p>
                </div>
                <div className="additional-price">
                  <span className="price-tag">+${option.extra}</span>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
});

AdditionalSection.displayName = 'AdditionalSection';
export default AdditionalSection;
