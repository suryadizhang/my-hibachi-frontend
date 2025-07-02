import React, { memo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { getServiceTypes } from './reviewsData.js';

const ReviewFilters = memo(({ 
  filter, 
  sortBy, 
  onFilterChange, 
  onSortChange 
}) => {
  const serviceTypes = getServiceTypes();

  return (
    <Row className="mb-4">
      <Col md={6} className="mb-3 mb-md-0">
        <div className="d-flex align-items-center">
          <label className="me-3 fw-bold text-muted">Filter by Event:</label>
          <select 
            className="form-select form-select-sm"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="all">All Events</option>
            {serviceTypes.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
      </Col>
      <Col md={6}>
        <div className="d-flex align-items-center justify-content-md-end">
          <label className="me-3 fw-bold text-muted">Sort by:</label>
          <select 
            className="form-select form-select-sm"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{ maxWidth: '150px' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </Col>
    </Row>
  );
});

ReviewFilters.displayName = 'ReviewFilters';

export default ReviewFilters;
