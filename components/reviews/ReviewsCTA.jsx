import React, { memo } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { reviewsData } from './reviewsData.js';

const ReviewsCTA = memo(({ onBookEvent, onGetQuote }) => {
  return (
    <>
      {/* Call-to-Action Section */}
      <div className="cta-section mt-5">
        <div className="cta-card p-5 rounded-4 text-center" style={{ 
          background: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)',
          color: 'white'
        }}>
          <h2 className="fw-bold mb-3">Ready to Create Your Own 5-Star Experience?</h2>
          <p className="lead mb-4 opacity-90">
            Join {reviewsData.length}+ satisfied customers who chose quality hibachi at exceptional value
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Button 
              variant="light" 
              size="lg" 
              className="cta-button px-4 py-3 fw-bold"
              onClick={onBookEvent}
            >
              <i className="bi bi-calendar-plus me-2"></i>
              Book Your Event Now
            </Button>
            <Button 
              variant="outline-light" 
              size="lg" 
              className="cta-button px-4 py-3 fw-bold"
              onClick={onGetQuote}
            >
              <i className="bi bi-chat-dots me-2"></i>
              Get Free Quote
            </Button>
          </div>
          <div className="mt-4">
            <small className="opacity-75">
              <i className="bi bi-shield-check me-2"></i>
              100% Satisfaction Guarantee • Professional Service • Premium Ingredients
            </small>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <Row className="mt-5 text-center">
        <Col md={3} className="mb-3">
          <div className="trust-item">
            <i className="bi bi-shield-check-fill text-success mb-2" style={{ fontSize: '2rem' }}></i>
            <h6 className="fw-bold">Verified Reviews</h6>
            <small className="text-muted">All authentic customer experiences</small>
          </div>
        </Col>
        <Col md={3} className="mb-3">
          <div className="trust-item">
            <i className="bi bi-award-fill text-warning mb-2" style={{ fontSize: '2rem' }}></i>
            <h6 className="fw-bold">5-Star Service</h6>
            <small className="text-muted">Consistently excellent experiences</small>
          </div>
        </Col>
        <Col md={3} className="mb-3">
          <div className="trust-item">
            <i className="bi bi-clock-fill text-primary mb-2" style={{ fontSize: '2rem' }}></i>
            <h6 className="fw-bold">Reliable & Punctual</h6>
            <small className="text-muted">Professional service every time</small>
          </div>
        </Col>
        <Col md={3} className="mb-3">
          <div className="trust-item">
            <i className="bi bi-heart-fill text-danger mb-2" style={{ fontSize: '2rem' }}></i>
            <h6 className="fw-bold">Customer Loved</h6>
            <small className="text-muted">Memorable experiences guaranteed</small>
          </div>
        </Col>
      </Row>
    </>
  );
});

ReviewsCTA.displayName = 'ReviewsCTA';

export default ReviewsCTA;
