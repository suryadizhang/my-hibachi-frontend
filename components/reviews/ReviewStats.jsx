import React, { memo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { getReviewStats } from './reviewsData.js';

const ReviewStats = memo(({ reviews }) => {
  const stats = getReviewStats(reviews);

  return (
    <div className="review-stats-container mb-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="stats-card p-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)' }}>
            <Row className="text-center text-white">
              <Col md={4} className="mb-3 mb-md-0">
                <div className="stat-item">
                  <h2 className="stat-number mb-0 fw-bold">{stats.averageRating}</h2>
                  <p className="stat-label mb-0 opacity-75">Average Rating</p>
                  <div className="mt-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                    ))}
                  </div>
                </div>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <div className="stat-item">
                  <h2 className="stat-number mb-0 fw-bold">{stats.totalReviews}</h2>
                  <p className="stat-label mb-0 opacity-75">Happy Customers</p>
                  <small className="opacity-75">All verified reviews</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="stat-item">
                  <h2 className="stat-number mb-0 fw-bold">{stats.satisfactionRate}%</h2>
                  <p className="stat-label mb-0 opacity-75">Satisfaction Rate</p>
                  <small className="opacity-75">5-star experiences</small>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
});

ReviewStats.displayName = 'ReviewStats';

export default ReviewStats;
