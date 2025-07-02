// Modular Booking System - Main Container Component
import React, { Suspense, useCallback } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { BookingProvider } from '../context/BookingContext';
import BookingProgress from './BookingProgress';
import DateSelection from './DateSelection';
import TimeSlotSelection from './TimeSlotSelection';
import CustomerInfoForm from './CustomerInfoForm';
import BookingSummary from './BookingSummary';
import BookingNotifications from './BookingNotifications';
import BookingActions from './BookingActions';
import './ModularBookingSystem.css';

const ModularBookingSystem = () => {
  const handleBookingSubmit = useCallback(async (bookingData) => {
    try {
      // Handle booking submission logic here
      console.log('Submitting booking:', bookingData);
      
      // This would typically make an API call
      // const response = await submitBooking(bookingData);
      
      // Handle success/failure
      return { success: true, message: 'Booking submitted successfully!' };
    } catch (error) {
      console.error('Booking submission error:', error);
      return { success: false, message: 'Booking failed. Please try again.' };
    }
  }, []);

  const handleReset = useCallback(() => {
    // Handle form reset
    console.log('Resetting booking form');
  }, []);

  const handleSaveAsDraft = useCallback(() => {
    // Handle saving as draft
    console.log('Saving booking as draft');
  }, []);

  return (
    <BookingProvider>
      <div className="modular-booking-system">
        <Container fluid className="booking-container">
          {/* Hero Section */}
          <div className="booking-hero">
            <div className="hero-content">
              <div className="hero-icon">
                <span className="emoji-visible">🍴</span>
              </div>
              <h1 className="hero-title">Book Your Hibachi Experience</h1>
              <p className="hero-subtitle">
                Premium mobile hibachi catering brought to your location
              </p>
            </div>
          </div>

          {/* Main Booking Interface */}
          <Row className="booking-main-row g-3">
            {/* Left Column - Progress & Notifications */}
            <Col lg={3} className="booking-sidebar">
              <div className="sidebar-content">
                <Suspense fallback={<Spinner animation="border" size="sm" />}>
                  <BookingProgress />
                </Suspense>
                
                <Suspense fallback={<div>Loading notifications...</div>}>
                  <BookingNotifications />
                </Suspense>
              </div>
            </Col>

            {/* Main Column - Booking Steps */}
            <Col lg={6} className="booking-main">
              <Card className="booking-steps-card">
                <Card.Body className="steps-body">
                  {/* Step 1: Date Selection */}
                  <div className="booking-step" id="date-step">
                    <Suspense fallback={<Spinner animation="border" />}>
                      <DateSelection />
                    </Suspense>
                  </div>

                  {/* Step 2: Time Selection */}
                  <div className="booking-step" id="time-step">
                    <Suspense fallback={<Spinner animation="border" />}>
                      <TimeSlotSelection />
                    </Suspense>
                  </div>

                  {/* Step 3: Customer Information */}
                  <div className="booking-step" id="info-step">
                    <Suspense fallback={<Spinner animation="border" />}>
                      <CustomerInfoForm />
                    </Suspense>
                  </div>

                  {/* Step 4: Actions */}
                  <div className="booking-step" id="actions-step">
                    <Suspense fallback={<Spinner animation="border" />}>
                      <BookingActions
                        onSubmit={handleBookingSubmit}
                        onReset={handleReset}
                        onSaveAsDraft={handleSaveAsDraft}
                        showAdvancedActions={true}
                      />
                    </Suspense>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Column - Summary */}
            <Col lg={3} className="booking-summary-col">
              <div className="summary-content">
                <Suspense fallback={<Spinner animation="border" size="sm" />}>
                  <BookingSummary
                    onConfirm={handleBookingSubmit}
                    onEdit={() => console.log('Edit booking')}
                  />
                </Suspense>
              </div>
            </Col>
          </Row>

          {/* Additional Information Cards */}
          <Row className="info-cards-row g-3">
            <Col md={6} lg={3}>
              <Card className="info-card h-100">
                <Card.Body className="info-card-body">
                  <div className="info-icon">
                    <span className="emoji-visible">⏰</span>
                  </div>
                  <h5 className="info-title">Advance Booking</h5>
                  <p className="info-text">
                    Book at least 2 days in advance for the best availability.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="info-card h-100">
                <Card.Body className="info-card-body">
                  <div className="info-icon">
                    <span className="emoji-visible">💰</span>
                  </div>
                  <h5 className="info-title">Deposit Required</h5>
                  <p className="info-text">
                    Secure your booking with a deposit within 6 hours.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="info-card h-100">
                <Card.Body className="info-card-body">
                  <div className="info-icon">
                    <span className="emoji-visible">🎯</span>
                  </div>
                  <h5 className="info-title">Professional Service</h5>
                  <p className="info-text">
                    Experienced chefs with all equipment included.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="info-card h-100">
                <Card.Body className="info-card-body">
                  <div className="info-icon">
                    <span className="emoji-visible">📞</span>
                  </div>
                  <h5 className="info-title">Customer Support</h5>
                  <p className="info-text">
                    24/7 support for all your booking needs.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </BookingProvider>
  );
};

export default ModularBookingSystem;
