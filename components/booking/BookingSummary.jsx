// Booking Summary Component - Shows booking details with confirmation
import React, { memo } from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { useBooking } from '../context/BookingContext';
import './BookingSummary.css';

const BookingSummary = memo(({
  onConfirm,
  onEdit,
  isLoading = false
}) => {
  const { selectedDate, selectedTime, customerInfo, booking } = useBooking();

  const formatDate = (date) => {
    if (!date) return 'Not selected';
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  const isComplete = selectedDate && selectedTime && customerInfo.name && 
    customerInfo.email && customerInfo.phone && customerInfo.address;

  return (
    <Card className="booking-summary-card">
      <Card.Header className="booking-summary-header">
        <div className="summary-icon">
          <span className="emoji-visible">📋</span>
        </div>
        <h4 className="summary-title">Booking Summary</h4>
      </Card.Header>

      <Card.Body className="booking-summary-body">
        {/* Date & Time Section */}
        <div className="summary-section">
          <div className="summary-section-header">
            <span className="section-icon emoji-visible">📅</span>
            <h5>Date & Time</h5>
          </div>
          <div className="summary-details">
            <div className="detail-item">
              <strong>Date:</strong>
              <span className={selectedDate ? 'text-success' : 'text-muted'}>
                {formatDate(selectedDate)}
              </span>
            </div>
            <div className="detail-item">
              <strong>Time:</strong>
              <span className={selectedTime ? 'text-success' : 'text-muted'}>
                {selectedTime || 'Not selected'}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="summary-section">
          <div className="summary-section-header">
            <span className="section-icon emoji-visible">👤</span>
            <h5>Customer Information</h5>
          </div>
          <div className="summary-details">
            <div className="detail-item">
              <strong>Name:</strong>
              <span className={customerInfo.name ? 'text-success' : 'text-muted'}>
                {customerInfo.name || 'Not provided'}
              </span>
            </div>
            <div className="detail-item">
              <strong>Phone:</strong>
              <span className={customerInfo.phone ? 'text-success' : 'text-muted'}>
                {formatPhone(customerInfo.phone) || 'Not provided'}
              </span>
            </div>
            <div className="detail-item">
              <strong>Email:</strong>
              <span className={customerInfo.email ? 'text-success' : 'text-muted'}>
                {customerInfo.email || 'Not provided'}
              </span>
            </div>
            <div className="detail-item">
              <strong>Address:</strong>
              <span className={customerInfo.address ? 'text-success' : 'text-muted'}>
                {customerInfo.address ? 
                  `${customerInfo.address}, ${customerInfo.city} ${customerInfo.zipcode}` : 
                  'Not provided'
                }
              </span>
            </div>
            <div className="detail-item">
              <strong>Contact Preference:</strong>
              <span className={customerInfo.contactPreference ? 'text-success' : 'text-muted'}>
                {customerInfo.contactPreference || 'Not selected'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="summary-section">
          <div className="summary-section-header">
            <span className="section-icon emoji-visible">💰</span>
            <h5>Pricing</h5>
          </div>
          <div className="summary-details">
            <div className="detail-item">
              <strong>Base Price:</strong>
              <span>$55 per adult, $30 per child</span>
            </div>
            <div className="detail-item">
              <strong>Minimum:</strong>
              <span>$550</span>
            </div>
            <div className="detail-item deposit-required">
              <strong>Deposit Required:</strong>
              <Badge bg="warning" text="dark">Within 6 hours</Badge>
            </div>
          </div>
        </div>

        {/* Completion Status */}
        <div className="completion-status">
          <div className="status-indicator">
            <span className={`status-icon emoji-visible ${isComplete ? 'complete' : 'incomplete'}`}>
              {isComplete ? '✅' : '⚠️'}
            </span>
            <span className={`status-text ${isComplete ? 'complete' : 'incomplete'}`}>
              {isComplete ? 'Ready to book' : 'Please complete all fields'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <Row className="summary-actions mt-4">
          <Col>
            <Button
              variant="outline-secondary"
              onClick={onEdit}
              disabled={isLoading}
              className="edit-booking-btn"
            >
              <span className="btn-icon emoji-visible">✏️</span>
              Edit Details
            </Button>
          </Col>
          <Col>
            <Button
              variant="success"
              onClick={onConfirm}
              disabled={!isComplete || isLoading}
              className="confirm-booking-btn"
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Processing...
                </>
              ) : (
                <>
                  <span className="btn-icon emoji-visible">🎯</span>
                  Confirm Booking
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
});

BookingSummary.displayName = 'BookingSummary';

export default BookingSummary;
