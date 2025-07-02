import React, { memo, useState, useEffect } from 'react';
import { Card, Col, Badge } from 'react-bootstrap';
import StarRating from './StarRating.jsx';

const ReviewCard = memo(({ review, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Col md={6} lg={4} className="mb-4">
      <Card 
        className={`review-card h-100 shadow-hover border-0 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
        style={{ 
          animationDelay: `${index * 0.1}s`,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: '16px',
          transition: 'all 0.3s ease'
        }}
      >
        <Card.Body className="p-4 d-flex flex-column">
          {/* Header with rating and verification */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <StarRating rating={review.rating} />
            {review.verified && (
              <Badge bg="success" className="verified-badge d-flex align-items-center">
                <i className="bi bi-shield-check-fill me-1"></i>
                Verified
              </Badge>
            )}
          </div>
          
          {/* Quote */}
          <blockquote className="blockquote flex-grow-1 mb-0">
            <p className="mb-3 text-dark review-quote" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
              <i className="bi bi-quote text-primary me-2" style={{ fontSize: '1.5rem', opacity: '0.7' }}></i>
              {review.quote}
            </p>
          </blockquote>
          
          {/* Footer */}
          <div className="review-footer mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <cite className="fw-bold text-dark d-block">{review.author}</cite>
                <small className="text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  {review.location}
                </small>
              </div>
              <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
            </div>
            <Badge bg="light" text="dark" className="service-badge">
              <i className="bi bi-calendar-event me-1"></i>
              {review.service}
            </Badge>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
});

ReviewCard.displayName = 'ReviewCard';

export default ReviewCard;
