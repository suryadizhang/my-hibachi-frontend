// Simple, Clean Booking System - Complete Redesign
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { upgradeOptions, additionalOptions } from '../menu/menuData';

const SimpleBookingSystem = () => {
  // Simple state management - no complex context
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedDate: '',
    selectedTime: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
    customerZipcode: '',
    guestCount: 8,
    specialRequests: '',
    contactPreference: 'email',
    // New fields for menu calculation
    adultCount: 8,
    childCount: 0,
    selectedUpgrades: {},
    selectedAdditions: {},
    estimatedGratuity: 25
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Sample time slots (fallback if API fails)
  const defaultTimeSlots = [
    '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'
  ];

  // API Base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Get minimum date (2 days from now)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  };

  // Get maximum date (1 year from now)
  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  };

  // Calculate end time (90 minutes later)
  const getEndTime = (startTime) => {
    // Parse the start time
    const [time, period] = startTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    
    // Add 90 minutes
    const startDate = new Date();
    startDate.setHours(hour24, minutes || 0, 0, 0);
    startDate.setMinutes(startDate.getMinutes() + 90);
    
    // Format back to 12-hour format
    return startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate comprehensive cost including upgrades and additions
  const calculateComprehensiveCost = (adultCount, childCount, upgrades = {}, additions = {}, gratuityPercent = 25) => {
    const adultPrice = 55;
    const childPrice = 30;
    
    // Base cost
    const baseCost = (adultCount * adultPrice) + (childCount * childPrice);
    
    // Upgrade costs (per person)
    let upgradeCost = 0;
    Object.entries(upgrades).forEach(([upgradeName, quantity]) => {
      const upgrade = upgradeOptions.find(u => u.name === upgradeName);
      if (upgrade && quantity > 0) {
        upgradeCost += upgrade.extra * quantity;
      }
    });
    
    // Additional costs (fixed quantity)
    let additionCost = 0;
    Object.entries(additions).forEach(([additionName, quantity]) => {
      const addition = additionalOptions.find(a => a.name === additionName);
      if (addition && quantity > 0) {
        additionCost += addition.extra * quantity;
      }
    });
    
    const subtotal = baseCost + upgradeCost + additionCost;
    const gratuity = subtotal * (gratuityPercent / 100);
    const total = subtotal + gratuity;
    
    return {
      baseCost,
      upgradeCost,
      additionCost,
      subtotal,
      gratuity,
      total,
      meetsMinimum: subtotal >= 550,
      shortfall: subtotal < 550 ? 550 - subtotal : 0,
      adultCount,
      childCount,
      gratuityPercent
    };
  };

  // Legacy function for backward compatibility
  const calculateEstimatedCost = (guestCount) => {
    return calculateComprehensiveCost(guestCount, 0, {}, {}, 0);
  };

  // Check availability for selected date
  const checkAvailability = async (date) => {
    if (!date) return;
    
    setIsCheckingAvailability(true);
    try {
      const response = await fetch(`${API_BASE}/api/booking/availability?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        // Convert API response to our format
        const slots = Object.entries(data).map(([time, info]) => ({
          time: time,
          status: info.status,
          available: info.status === 'available'
        }));
        setAvailableSlots(slots);
        setLastUpdated(new Date());
      } else {
        // Fallback to default slots if API fails
        const defaultSlots = defaultTimeSlots.map(time => ({
          time: time,
          status: 'available',
          available: true
        }));
        setAvailableSlots(defaultSlots);
      }
    } catch (error) {
      console.log('Using default slots - API not available');
      // Fallback to default slots
      const defaultSlots = defaultTimeSlots.map(time => ({
        time: time,
        status: 'available',
        available: true
      }));
      setAvailableSlots(defaultSlots);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Auto-refresh availability every 30 seconds when on step 2
  useEffect(() => {
    if (currentStep === 2 && formData.selectedDate) {
      // Initial check
      checkAvailability(formData.selectedDate);
      
      // Set up auto-refresh
      const interval = setInterval(() => {
        checkAvailability(formData.selectedDate);
      }, 30000); // 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [currentStep, formData.selectedDate]);

  // Check availability when date changes
  useEffect(() => {
    if (formData.selectedDate) {
      checkAvailability(formData.selectedDate);
    }
  }, [formData.selectedDate]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Sync guest count when adult/child counts change
      if (field === 'adultCount' || field === 'childCount') {
        const adultCount = field === 'adultCount' ? value : prev.adultCount;
        const childCount = field === 'childCount' ? value : prev.childCount;
        newData.guestCount = (adultCount || 0) + (childCount || 0);
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step >= 1) {
      if (!formData.selectedDate) newErrors.selectedDate = 'Please select a date';
    }
    
    if (step >= 2) {
      if (!formData.selectedTime) newErrors.selectedTime = 'Please select a time';
    }
    
    if (step >= 3) {
      if (!formData.customerName) newErrors.customerName = 'Name is required';
      if (!formData.customerEmail) newErrors.customerEmail = 'Email is required';
      if (!formData.customerPhone) newErrors.customerPhone = 'Phone is required';
      if (!formData.customerAddress) newErrors.customerAddress = 'Address is required';
      if (!formData.customerCity) newErrors.customerCity = 'City is required';
      if (!formData.customerZipcode) newErrors.customerZipcode = 'Zipcode is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle final submission
  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Booking submitted successfully! Check your email for confirmation.');
      // Reset form
      setFormData({
        selectedDate: '',
        selectedTime: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        customerCity: '',
        customerZipcode: '',
        guestCount: 8,
        specialRequests: '',
        contactPreference: 'email',
        // New fields for menu calculation
        adultCount: 8,
        childCount: 0,
        selectedUpgrades: {},
        selectedAdditions: {},
        estimatedGratuity: 25
      });
      setCurrentStep(1);
    } catch (error) {
      setErrors({ submit: 'Failed to submit booking. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate progress
  const progress = (currentStep / 4) * 100;

  return (
    <div className="booking-system py-4">
      <div className="container">
        {/* Modern Hero Header */}
        <div className="hero-header text-center mb-5">
          <div className="hero-background">
            <div className="floating-icons">
              <div className="floating-icon">🍴</div>
              <div className="floating-icon">🔥</div>
              <div className="floating-icon">🥘</div>
              <div className="floating-icon">🎭</div>
            </div>
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="gradient-text">Book Your Hibachi Experience</span>
              </h1>
              <p className="hero-subtitle">Premium mobile hibachi catering brought to your location</p>
              <div className="hero-features">
                <div className="feature-badge">
                  <span className="feature-icon">⭐</span>
                  Professional Chefs
                </div>
                <div className="feature-badge">
                  <span className="feature-icon">🏆</span>
                  Premium Equipment
                </div>
                <div className="feature-badge">
                  <span className="feature-icon">🎯</span>
                  Perfect Events
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Progress Bar */}
        <Card className="progress-card mb-5 border-0 shadow-lg overflow-hidden">
          <div className="progress-card-background"></div>
          <Card.Body className="position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="progress-title mb-0">
                <span className="progress-icon">🎯</span>
                Booking Progress
              </h5>
              <div className="progress-badge">
                <span className="progress-percentage">{Math.round(progress)}%</span>
                <span className="progress-label">Complete</span>
              </div>
            </div>
            
            <div className="modern-progress-bar mb-4">
              <div 
                className="modern-progress-fill" 
                style={{ width: `${progress}%` }}
              >
                <div className="progress-glow"></div>
              </div>
            </div>
            
            <div className="progress-steps">
              <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-circle">
                  <span className="step-icon">{currentStep > 1 ? '✓' : '📅'}</span>
                </div>
                <div className="step-label">Select Date</div>
              </div>
              <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-circle">
                  <span className="step-icon">{currentStep > 2 ? '✓' : '⏰'}</span>
                </div>
                <div className="step-label">Choose Time</div>
              </div>
              <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                <div className="step-circle">
                  <span className="step-icon">{currentStep > 3 ? '✓' : '👤'}</span>
                </div>
                <div className="step-label">Your Details</div>
              </div>
              <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
                <div className="step-circle">
                  <span className="step-icon">✅</span>
                </div>
                <div className="step-label">Confirm</div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Row>
          <Col lg={8}>
            {/* Step 1: Enhanced Date Selection */}
            {currentStep === 1 && (
              <Card className="modern-card border-0 shadow-lg">
                <div className="card-header-modern bg-gradient-date">
                  <div className="d-flex align-items-center">
                    <div className="header-icon-circle">
                      <span className="header-icon">📅</span>
                    </div>
                    <div>
                      <h5 className="card-title-modern mb-0">Select Your Date</h5>
                      <p className="card-subtitle-modern mb-0">Choose when you'd like your hibachi experience</p>
                    </div>
                  </div>
                </div>
                <Card.Body className="p-4">
                  <Form.Group className="mb-4">
                    <Form.Label className="modern-label">
                      <span className="label-icon">🗓️</span>
                      <strong>Choose Date:</strong>
                    </Form.Label>
                    <div className="date-input-wrapper">
                      <Form.Control
                        type="date"
                        value={formData.selectedDate}
                        min={getMinDate()}
                        max={getMaxDate()}
                        onChange={(e) => handleInputChange('selectedDate', e.target.value)}
                        isInvalid={!!errors.selectedDate}
                        className="modern-date-input"
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.selectedDate}
                    </Form.Control.Feedback>
                    <Form.Text className="modern-form-text">
                      <span className="text-icon">📅</span>
                      Book from 2 days to 1 year in advance for the perfect timing
                    </Form.Text>
                  </Form.Group>
                  
                  {formData.selectedDate && (
                    <div className="date-confirmation">
                      <div className="confirmation-card">
                        <div className="confirmation-icon">✨</div>
                        <div className="confirmation-content">
                          <strong className="confirmation-title">Perfect Choice!</strong>
                          <div className="confirmation-date">
                            {new Date(formData.selectedDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="card-actions">
                    <Button 
                      className="modern-btn-primary"
                      onClick={handleNext}
                      disabled={!formData.selectedDate}
                    >
                      <span className="btn-content">
                        <span className="btn-text">Next: Choose Time</span>
                        <span className="btn-arrow">→</span>
                      </span>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Step 2: Enhanced Time Selection */}
            {currentStep === 2 && (
              <Card className="modern-card border-0 shadow-lg">
                <div className="card-header-modern bg-gradient-time">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="d-flex align-items-center">
                      <div className="header-icon-circle">
                        <span className="header-icon">⏰</span>
                      </div>
                      <div>
                        <h5 className="card-title-modern mb-0">Select Your Time</h5>
                        <p className="card-subtitle-modern mb-0">Perfect timing for your hibachi experience</p>
                      </div>
                    </div>
                    {lastUpdated && (
                      <div className="live-indicator">
                        <span className="live-dot"></span>
                        <small className="live-text">
                          Updated {lastUpdated.toLocaleTimeString()}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
                <Card.Body className="p-4">
                  <div className="selected-date-display mb-4">
                    <div className="d-flex align-items-center">
                      <span className="date-icon">📅</span>
                      <div>
                        <strong className="date-label">Selected Date:</strong>
                        <div className="date-value">{new Date(formData.selectedDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}</div>
                      </div>
                    </div>
                  </div>
                  
                  {isCheckingAvailability && (
                    <div className="availability-loading">
                      <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                      </div>
                      <div className="loading-text">Checking real-time availability...</div>
                    </div>
                  )}
                  
                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Form.Label className="modern-label mb-0">
                        <span className="label-icon">🕐</span>
                        <strong>Available Time Slots:</strong>
                      </Form.Label>
                      <div className="time-controls">
                        <span className="time-duration">⏰ 90 minutes each</span>
                        <Button 
                          className="refresh-btn"
                          size="sm"
                          onClick={() => checkAvailability(formData.selectedDate)}
                          disabled={isCheckingAvailability}
                        >
                          <span className="refresh-icon">🔄</span>
                          Refresh
                        </Button>
                      </div>
                    </div>
                    
                    <div className="time-slots-grid">
                      {availableSlots.map((slot) => {
                        const startTime = slot.time;
                        const endTime = getEndTime(startTime);
                        const isSelected = formData.selectedTime === slot.time;
                        
                        return (
                          <div
                            key={slot.time}
                            className={`time-slot ${isSelected ? 'selected' : ''} ${slot.available ? 'available' : 'unavailable'}`}
                            onClick={() => slot.available && handleInputChange('selectedTime', slot.time)}
                          >
                            <div className="time-slot-content">
                              <div className="time-main">{startTime}</div>
                              <div className="time-duration">to {endTime}</div>
                              <div className="time-status">
                                {!slot.available && <span className="status-text">Booked</span>}
                                {slot.status === 'waiting' && <span className="status-text">Waitlist</span>}
                                {slot.available && isSelected && <span className="status-text selected-text">Selected ✓</span>}
                              </div>
                            </div>
                            {slot.available && (
                              <div className="time-slot-glow"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {availableSlots.length === 0 && !isCheckingAvailability && (
                      <div className="no-availability-warning">
                        <div className="warning-icon">⚠️</div>
                        <div className="warning-text">
                          <strong>No availability data loaded</strong>
                          <div>Using default time slots for your selection</div>
                        </div>
                      </div>
                    )}
                    
                    {errors.selectedTime && (
                      <div className="error-message">{errors.selectedTime}</div>
                    )}
                  </Form.Group>
                  
                  {/* Enhanced Availability Legend */}
                  <div className="availability-legend mb-4">
                    <div className="legend-title">Legend:</div>
                    <div className="legend-items">
                      <div className="legend-item available">
                        <div className="legend-indicator"></div>
                        <span>Available</span>
                      </div>
                      <div className="legend-item unavailable">
                        <div className="legend-indicator"></div>
                        <span>Booked</span>
                      </div>
                      <div className="legend-item waitlist">
                        <div className="legend-indicator"></div>
                        <span>Waitlist</span>
                      </div>
                    </div>
                  </div>
                  
                  {formData.selectedTime && (
                    <div className="time-confirmation">
                      <div className="confirmation-card">
                        <div className="confirmation-icon">⭐</div>
                        <div className="confirmation-content">
                          <strong className="confirmation-title">Excellent Choice!</strong>
                          <div className="confirmation-details">
                            <div className="detail-row">
                              <span className="detail-label">Time:</span>
                              <span className="detail-value">{formData.selectedTime} - {getEndTime(formData.selectedTime)}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Duration:</span>
                              <span className="detail-value">90 minutes of amazing hibachi experience</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Date:</span>
                              <span className="detail-value">{new Date(formData.selectedDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="card-actions">
                    <Button 
                      className="modern-btn-secondary"
                      onClick={handlePrevious}
                    >
                      <span className="btn-content">
                        <span className="btn-arrow">←</span>
                        <span className="btn-text">Back</span>
                      </span>
                    </Button>
                    <Button 
                      className="modern-btn-primary"
                      onClick={handleNext}
                      disabled={!formData.selectedTime}
                    >
                      <span className="btn-content">
                        <span className="btn-text">Next: Your Details</span>
                        <span className="btn-arrow">→</span>
                      </span>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Step 3: Customer Information */}
            {currentStep === 3 && (
              <Card>
                <Card.Header>
                  <h5 className="mb-0">👤 Your Information</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label><strong>Full Name *</strong></Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.customerName}
                          onChange={(e) => handleInputChange('customerName', e.target.value)}
                          isInvalid={!!errors.customerName}
                          placeholder="Enter your full name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.customerName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label><strong>Phone Number *</strong></Form.Label>
                        <Form.Control
                          type="tel"
                          value={formData.customerPhone}
                          onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                          isInvalid={!!errors.customerPhone}
                          placeholder="(555) 123-4567"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.customerPhone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Email Address *</strong></Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      isInvalid={!!errors.customerEmail}
                      placeholder="your.email@example.com"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.customerEmail}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Event Address *</strong></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={formData.customerAddress}
                      onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                      isInvalid={!!errors.customerAddress}
                      placeholder="Enter street address where hibachi service will be provided"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.customerAddress}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Row className="mb-3">
                    <Col md={8}>
                      <Form.Group>
                        <Form.Label><strong>City *</strong></Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.customerCity}
                          onChange={(e) => handleInputChange('customerCity', e.target.value)}
                          isInvalid={!!errors.customerCity}
                          placeholder="Enter city"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.customerCity}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label><strong>Zipcode *</strong></Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.customerZipcode}
                          onChange={(e) => handleInputChange('customerZipcode', e.target.value)}
                          isInvalid={!!errors.customerZipcode}
                          placeholder="12345"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.customerZipcode}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {/* Guest Count Section */}
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-gradient-primary text-white">
                      <h6 className="mb-0">👥 Guest Information</h6>
                    </Card.Header>
                    <Card.Body className="p-4">
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="d-flex align-items-center mb-2">
                              <span className="me-2">👨‍👩‍👧‍👦</span>
                              <strong>Adult Guests (Ages 13+)</strong>
                            </Form.Label>
                            <Form.Control
                              type="number"
                              min="1"
                              max="50"
                              value={formData.adultCount}
                              onChange={(e) => handleInputChange('adultCount', parseInt(e.target.value))}
                              className="form-control-lg"
                            />
                            <Form.Text className="text-success fw-bold">
                              💰 $55 per adult
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="d-flex align-items-center mb-2">
                              <span className="me-2">👶</span>
                              <strong>Child Guests (Ages 4-12)</strong>
                            </Form.Label>
                            <Form.Control
                              type="number"
                              min="0"
                              max="20"
                              value={formData.childCount}
                              onChange={(e) => handleInputChange('childCount', parseInt(e.target.value))}
                              className="form-control-lg"
                            />
                            <Form.Text className="text-success fw-bold">
                              💰 $30 per child
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <div className="alert alert-info mb-0">
                        <div className="d-flex align-items-center">
                          <span className="me-2">🍽️</span>
                          <div>
                            <strong>What's Included:</strong> Hibachi Fried Rice, Seasonal Vegetables, Garden Salad, Miso Soup, Signature Sauces & Hot Tea
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Premium Menu Upgrades */}
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-gradient-warning text-dark">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">🌟 Premium Protein Upgrades</h6>
                        <Badge bg="warning" text="dark">Optional</Badge>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-4">
                      <p className="text-muted mb-3">
                        <i className="fas fa-info-circle me-1"></i>
                        Enhance any guest's meal with premium proteins (price per person)
                      </p>
                      
                      <Row className="g-3">
                        {upgradeOptions.map((upgrade) => (
                          <Col lg={6} key={upgrade.name}>
                            <div className="menu-item-card h-100 p-3 border rounded-3 bg-light">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="flex-grow-1 me-3">
                                  <div className="d-flex align-items-center mb-2">
                                    <span className="fs-4 me-2">{upgrade.icon}</span>
                                    <div>
                                      <h6 className="mb-0 text-dark">{upgrade.name}</h6>
                                      <div className="text-success fw-bold">+${upgrade.extra}/person</div>
                                    </div>
                                    {upgrade.luxury && <Badge bg="danger" className="ms-2">Luxury</Badge>}
                                    {upgrade.premium && <Badge bg="warning" className="ms-2">Premium</Badge>}
                                  </div>
                                  <p className="text-muted small mb-0">{upgrade.description}</p>
                                </div>
                                <div className="quantity-selector">
                                  <Form.Control
                                    type="number"
                                    min="0"
                                    max={formData.adultCount + formData.childCount}
                                    value={formData.selectedUpgrades[upgrade.name] || 0}
                                    onChange={(e) => handleInputChange('selectedUpgrades', {
                                      ...formData.selectedUpgrades,
                                      [upgrade.name]: parseInt(e.target.value) || 0
                                    })}
                                    size="sm"
                                    placeholder="0"
                                    className="text-center"
                                    style={{ minWidth: '70px' }}
                                  />
                                  <Form.Text className="text-muted small">
                                    people
                                  </Form.Text>
                                </div>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>

                  {/* Additional Items */}
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-gradient-success text-white">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">🍜 Additional Items & Extras</h6>
                        <Badge bg="success">Optional</Badge>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-4">
                      <p className="text-muted mb-3">
                        <i className="fas fa-plus-circle me-1"></i>
                        Add extra items to enhance your hibachi experience
                      </p>
                      
                      <Row className="g-3">
                        {additionalOptions.map((addition) => (
                          <Col lg={6} key={addition.name}>
                            <div className="menu-item-card h-100 p-3 border rounded-3 bg-light">
                              <div className="d-flex align-items-start justify-content-between">
                                <div className="flex-grow-1 me-3">
                                  <div className="d-flex align-items-center mb-2">
                                    <span className="fs-4 me-2">{addition.icon}</span>
                                    <div>
                                      <h6 className="mb-0 text-dark">{addition.name}</h6>
                                      <div className="text-success fw-bold">+${addition.extra}</div>
                                    </div>
                                  </div>
                                  <p className="text-muted small mb-0">{addition.description}</p>
                                </div>
                                <div className="quantity-selector">
                                  <Form.Control
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={formData.selectedAdditions[addition.name] || 0}
                                    onChange={(e) => handleInputChange('selectedAdditions', {
                                      ...formData.selectedAdditions,
                                      [addition.name]: parseInt(e.target.value) || 0
                                    })}
                                    size="sm"
                                    placeholder="0"
                                    className="text-center"
                                    style={{ minWidth: '70px' }}
                                  />
                                  <Form.Text className="text-muted small">
                                    orders
                                  </Form.Text>
                                </div>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>

                  {/* Real-time Cost Calculator */}
                  {(formData.adultCount > 0 || formData.childCount > 0) && (
                    <Card className="mb-4 border-0 shadow-lg">
                      <Card.Header className="bg-gradient-primary text-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">💰 Live Cost Calculator</h6>
                          <Badge bg="light" text="dark" className="pulse-animation">
                            <i className="fas fa-calculator me-1"></i>Real-time
                          </Badge>
                        </div>
                      </Card.Header>
                      <Card.Body className="p-4">
                        {(() => {
                          const costInfo = calculateComprehensiveCost(
                            formData.adultCount || 0, 
                            formData.childCount || 0, 
                            formData.selectedUpgrades, 
                            formData.selectedAdditions,
                            0 // No gratuity in the base calculation
                          );
                          return (
                            <div className="cost-breakdown">
                              {/* Base Cost */}
                              <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                <div className="cost-item-label">
                                  <span className="me-2">👥</span>
                                  <strong>Base Cost</strong>
                                  <div className="text-muted small">
                                    {formData.adultCount} adults @ $55, {formData.childCount} children @ $30
                                  </div>
                                </div>
                                <div className="cost-item-value">
                                  <span className="fs-5 fw-bold text-dark">${costInfo.baseCost}</span>
                                </div>
                              </div>
                              
                              {/* Premium Upgrades */}
                              {costInfo.upgradeCost > 0 && (
                                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                  <div className="cost-item-label">
                                    <span className="me-2">🌟</span>
                                    <strong>Premium Upgrades</strong>
                                    <div className="text-muted small">
                                      {Object.entries(formData.selectedUpgrades).filter(([_, qty]) => qty > 0).map(([name, qty]) => (
                                        <div key={name}>{name} x{qty}</div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="cost-item-value">
                                    <span className="fs-6 fw-bold text-warning">+${costInfo.upgradeCost}</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Additional Items */}
                              {costInfo.additionCost > 0 && (
                                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                  <div className="cost-item-label">
                                    <span className="me-2">🍜</span>
                                    <strong>Additional Items</strong>
                                    <div className="text-muted small">
                                      {Object.entries(formData.selectedAdditions).filter(([_, qty]) => qty > 0).map(([name, qty]) => (
                                        <div key={name}>{name} x{qty}</div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="cost-item-value">
                                    <span className="fs-6 fw-bold text-success">+${costInfo.additionCost}</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Subtotal */}
                              <div className="d-flex justify-content-between align-items-center py-3 bg-light rounded mt-3">
                                <div className="cost-item-label">
                                  <span className="me-2">🧮</span>
                                  <strong className="fs-5">Subtotal (before gratuity)</strong>
                                </div>
                                <div className="cost-item-value">
                                  <span className="fs-4 fw-bold text-primary">${costInfo.subtotal}</span>
                                </div>
                              </div>
                              
                              {/* Gratuity Recommendation */}
                              <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
                                <div className="d-flex align-items-center">
                                  <span className="me-2">💡</span>
                                  <div>
                                    <strong className="text-info">Gratuity Recommendation</strong>
                                    <div className="text-muted small">
                                      We recommend 20-35% based on service quality. Gratuity is adjustable and will be added to your final bill.
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Minimum Order Status */}
                              <div className="mt-3">
                                {!costInfo.meetsMinimum ? (
                                  <div className="alert alert-warning mb-0">
                                    <div className="d-flex align-items-center">
                                      <span className="me-2">⚠️</span>
                                      <div>
                                        <strong>Minimum Order Required</strong>
                                        <div className="small">
                                          Current: ${costInfo.subtotal} | Minimum: $550 | 
                                          <span className="text-danger fw-bold"> Need $${costInfo.shortfall} more</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="alert alert-success mb-0">
                                    <div className="d-flex align-items-center">
                                      <span className="me-2">✅</span>
                                      <div>
                                        <strong>Minimum Order Met!</strong>
                                        <div className="small">Your order meets the $550 minimum requirement.</div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </Card.Body>
                    </Card>
                  )}
                  
                  <Row className="mb-3">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label><strong>Preferred Contact</strong></Form.Label>
                        <Form.Select
                          value={formData.contactPreference}
                          onChange={(e) => handleInputChange('contactPreference', e.target.value)}
                        >
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="text">Text Message</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Special Requests</strong></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="Any dietary restrictions, special occasions, or requests..."
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-secondary" onClick={handlePrevious}>
                      ← Back
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleNext}
                    >
                      Next: Review & Confirm →
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <Card>
                <Card.Header>
                  <h5 className="mb-0">✅ Review & Confirm</h5>
                </Card.Header>
                <Card.Body>
                  <h6>📅 Event Details</h6>
                  <p><strong>Date:</strong> {new Date(formData.selectedDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {formData.selectedTime} - {getEndTime(formData.selectedTime)} (90 minutes)</p>
                  <p><strong>Guests:</strong> {formData.adultCount} adults, {formData.childCount} children</p>
                  
                  <hr />
                  
                  <h6>👤 Contact Information</h6>
                  <p><strong>Name:</strong> {formData.customerName}</p>
                  <p><strong>Email:</strong> {formData.customerEmail}</p>
                  <p><strong>Phone:</strong> {formData.customerPhone}</p>
                  <p><strong>Address:</strong> {formData.customerAddress}</p>
                  <p><strong>City:</strong> {formData.customerCity}, {formData.customerZipcode}</p>
                  
                  {(Object.values(formData.selectedUpgrades).some(v => v > 0) || Object.values(formData.selectedAdditions).some(v => v > 0)) && (
                    <>
                      <hr />
                      <h6>🌟 Menu Selections</h6>
                      {Object.entries(formData.selectedUpgrades).map(([name, quantity]) => (
                        quantity > 0 && (
                          <p key={name} className="mb-1">
                            <strong>{name}:</strong> {quantity} person{quantity > 1 ? 's' : ''}
                          </p>
                        )
                      ))}
                      {Object.entries(formData.selectedAdditions).map(([name, quantity]) => (
                        quantity > 0 && (
                          <p key={name} className="mb-1">
                            <strong>{name}:</strong> {quantity} order{quantity > 1 ? 's' : ''}
                          </p>
                        )
                      ))}
                    </>
                  )}
                  
                  {formData.specialRequests && (
                    <>
                      <hr />
                      <h6>📝 Special Requests</h6>
                      <p>{formData.specialRequests}</p>
                    </>
                  )}
                  
                  <hr />
                  
                  {(() => {
                    const costInfo = calculateComprehensiveCost(
                      formData.adultCount || 0, 
                      formData.childCount || 0, 
                      formData.selectedUpgrades, 
                      formData.selectedAdditions, 
                      formData.estimatedGratuity
                    );
                    return (
                      <Alert variant={costInfo.meetsMinimum ? "success" : "warning"}>
                        <h6>💰 Detailed Cost Breakdown</h6>
                        <div className="row">
                          <div className="col-8">Base Cost ({formData.adultCount} adults @ $55, {formData.childCount} children @ $30):</div>
                          <div className="col-4 text-end">${costInfo.baseCost}</div>
                        </div>
                        {costInfo.upgradeCost > 0 && (
                          <div className="row">
                            <div className="col-8">Premium Upgrades:</div>
                            <div className="col-4 text-end">+${costInfo.upgradeCost}</div>
                          </div>
                        )}
                        {costInfo.additionCost > 0 && (
                          <div className="row">
                            <div className="col-8">Additional Items:</div>
                            <div className="col-4 text-end">+${costInfo.additionCost}</div>
                          </div>
                        )}
                        <hr className="my-2" />
                        <div className="row">
                          <div className="col-8"><strong>Subtotal:</strong></div>
                          <div className="col-4 text-end"><strong>${costInfo.subtotal}</strong></div>
                        </div>
                        <div className="row">
                          <div className="col-8">Estimated Gratuity ({costInfo.gratuityPercent}%):</div>
                          <div className="col-4 text-end">${costInfo.gratuity}</div>
                        </div>
                        <hr className="my-2" />
                        <div className="row">
                          <div className="col-8"><strong>Total Estimated Cost:</strong></div>
                          <div className="col-4 text-end"><strong>${costInfo.total}</strong></div>
                        </div>
                        {!costInfo.meetsMinimum && (
                          <div className="mt-2 text-danger">
                            <small>⚠️ Minimum order value: $550. Need ${costInfo.shortfall} more.</small>
                          </div>
                        )}
                        {costInfo.meetsMinimum && (
                          <div className="mt-2 text-success">
                            <small>✅ Meets minimum order requirement!</small>
                          </div>
                        )}
                      </Alert>
                    );
                  })()}
                  
                  <Alert variant="info">
                    <h6>📋 Payment Information</h6>
                    <p className="mb-1"><strong>Deposit:</strong> Required within 6 hours to secure booking</p>
                    <p className="mb-1"><strong>Gratuity:</strong> Final amount adjustable based on service quality</p>
                    <p className="mb-0"><strong>Travel:</strong> Free within 30 miles, $2/mile beyond</p>
                  </Alert>
                  
                  {errors.submit && (
                    <Alert variant="danger">
                      {errors.submit}
                    </Alert>
                  )}
                  
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-secondary" onClick={handlePrevious}>
                      ← Back
                    </Button>
                    <Button 
                      variant="success" 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Submitting...
                        </>
                      ) : (
                        '✅ Confirm Booking'
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <Card className="sticky-top">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">📋 Booking Summary</h6>
                {currentStep === 2 && lastUpdated && (
                  <Badge bg="success" className="pulse-animation">
                    🟢 Live
                  </Badge>
                )}
              </Card.Header>
              <Card.Body>
                <div className="booking-summary">
                  <div className="mb-3">
                    <strong>📅 Date & Time</strong>
                    <p className="mb-1">
                      Date: {formData.selectedDate ? new Date(formData.selectedDate).toLocaleDateString() : 'Not selected'}
                    </p>
                    <p className="mb-0">
                      Time: {formData.selectedTime ? `${formData.selectedTime} - ${getEndTime(formData.selectedTime)}` : 'Not selected'}
                    </p>
                    {formData.selectedTime && (
                      <small className="text-muted">Duration: 90 minutes</small>
                    )}
                    {currentStep === 2 && availableSlots.length > 0 && (
                      <div>
                        <small className="text-muted">
                          {availableSlots.filter(s => s.available).length} slots available
                        </small>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <strong>👤 Contact</strong>
                    <p className="mb-1">Name: {formData.customerName || 'Not provided'}</p>
                    <p className="mb-1">Phone: {formData.customerPhone || 'Not provided'}</p>
                    <p className="mb-0">Email: {formData.customerEmail || 'Not provided'}</p>
                  </div>
                  
                  <div className="mb-3">
                    <strong>🏠 Location</strong>
                    <p className="mb-0">
                      {formData.customerAddress || 'Street address not provided'}
                    </p>
                    {(formData.customerCity || formData.customerZipcode) && (
                      <p className="mb-0">
                        {formData.customerCity || 'City not provided'}, {formData.customerZipcode || 'Zip not provided'}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <strong>👥 Guests</strong>
                    <p className="mb-1">
                      Adults: {formData.adultCount || 0}, Children: {formData.childCount || 0}
                    </p>
                    <div className="mt-2">
                      <small className="text-muted">
                        <strong>Note:</strong> Minimum order value of $550 required
                      </small>
                    </div>
                  </div>
                </div>
                
                <hr />
                
                <div className="features">
                  <h6>✨ What's Included</h6>
                  <ul className="list-unstyled">
                    <li>🔥 Professional hibachi chef</li>
                    <li>🍳 All cooking equipment</li>
                    <li>🥘 Fresh ingredients</li>
                    <li>🎭 Entertainment & show</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      
      <style jsx>{`
        /* Modern Design System */
        :root {
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          --warning-gradient: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
          --date-gradient: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
          --time-gradient: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          --info-gradient: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
          
          --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          
          --border-radius: 1rem;
          --border-radius-lg: 1.5rem;
          --border-radius-sm: 0.5rem;
          
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Hero Header Styles */
        .hero-header {
          position: relative;
          padding: 4rem 0;
          overflow: hidden;
        }
        
        .hero-background {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: var(--border-radius-lg);
          padding: 4rem 2rem;
          color: white;
          box-shadow: var(--shadow-xl);
        }
        
        .hero-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .hero-content {
          position: relative;
          z-index: 1;
        }
        
        .floating-icons {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .floating-icon {
          position: absolute;
          font-size: 2rem;
          opacity: 0.6;
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-icon:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
        .floating-icon:nth-child(2) { top: 20%; right: 15%; animation-delay: 1.5s; }
        .floating-icon:nth-child(3) { bottom: 20%; left: 20%; animation-delay: 3s; }
        .floating-icon:nth-child(4) { bottom: 15%; right: 10%; animation-delay: 4.5s; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          font-weight: 300;
        }
        
        .hero-features {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        
        .feature-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius);
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-weight: 600;
          transition: var(--transition);
        }
        
        .feature-badge:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.3);
        }

        /* Modern Progress Card */
        .progress-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: var(--border-radius-lg);
          position: relative;
          overflow: hidden;
        }
        
        .progress-card-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="progressPattern" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23progressPattern)"/></svg>');
        }
        
        .progress-card .card-body {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: var(--border-radius);
          margin: 1rem;
          color: #333;
        }
        
        .progress-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
        }
        
        .progress-icon {
          font-size: 1.5rem;
          margin-right: 0.75rem;
        }
        
        .progress-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--primary-gradient);
          color: white;
          padding: 1rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-md);
          min-width: 100px;
        }
        
        .progress-percentage {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
        }
        
        .progress-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }
        
        .modern-progress-bar {
          height: 12px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }
        
        .modern-progress-fill {
          height: 100%;
          background: var(--primary-gradient);
          border-radius: 6px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .progress-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .progress-steps {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }
        
        .progress-steps::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(0, 0, 0, 0.1);
          z-index: 0;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        
        .step-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.1);
          margin-bottom: 0.75rem;
          transition: var(--transition);
          border: 3px solid transparent;
        }
        
        .progress-step.active .step-circle {
          background: var(--primary-gradient);
          color: white;
          box-shadow: var(--shadow-md);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .progress-step.completed .step-circle {
          background: var(--success-gradient);
          color: white;
          box-shadow: var(--shadow-md);
        }
        
        .step-icon {
          font-size: 1.5rem;
        }
        
        .step-label {
          font-size: 0.875rem;
          font-weight: 600;
          text-align: center;
          color: #666;
        }
        
        .progress-step.active .step-label {
          color: #333;
          font-weight: 700;
        }

        /* Modern Card Styles */
        .modern-card {
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: var(--transition);
        }
        
        .modern-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-xl);
        }
        
        .card-header-modern {
          padding: 2rem;
          border: none;
          position: relative;
          overflow: hidden;
        }
        
        .card-header-modern::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="headerPattern" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23headerPattern)"/></svg>');
        }
        
        .bg-gradient-date {
          background: var(--date-gradient);
          color: #333;
        }
        
        .bg-gradient-time {
          background: var(--time-gradient);
          color: #333;
        }
        
        .header-icon-circle {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.5rem;
          box-shadow: var(--shadow-md);
        }
        
        .header-icon {
          font-size: 1.5rem;
        }
        
        .card-title-modern {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .card-subtitle-modern {
          opacity: 0.8;
          font-size: 0.875rem;
        }

        /* Modern Form Styles */
        .modern-label {
          display: flex;
          align-items: center;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #333;
        }
        
        .label-icon {
          margin-right: 0.5rem;
          font-size: 1.125rem;
        }
        
        .date-input-wrapper {
          position: relative;
        }
        
        .modern-date-input {
          padding: 1rem 1.5rem;
          font-size: 1.125rem;
          border: 2px solid #e9ecef;
          border-radius: var(--border-radius);
          transition: var(--transition);
          background: #fff;
        }
        
        .modern-date-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          outline: none;
        }
        
        .modern-form-text {
          display: flex;
          align-items: center;
          margin-top: 0.75rem;
          color: #666;
          font-size: 0.875rem;
        }
        
        .text-icon {
          margin-right: 0.5rem;
        }

        /* Date Confirmation */
        .date-confirmation {
          margin-bottom: 2rem;
        }
        
        .confirmation-card {
          background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
          border: 2px solid #4caf50;
          border-radius: var(--border-radius);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .confirmation-icon {
          font-size: 2rem;
          color: #4caf50;
        }
        
        .confirmation-title {
          color: #2e7d32;
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
        }
        
        .confirmation-date {
          color: #2e7d32;
          font-size: 1rem;
          font-weight: 600;
        }

        /* Time Selection Styles */
        .selected-date-display {
          background: rgba(255, 255, 255, 0.9);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .date-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
        }
        
        .date-label {
          font-weight: 600;
          color: #333;
        }
        
        .date-value {
          font-size: 1.125rem;
          color: #666;
        }
        
        .availability-loading {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.9);
          border-radius: var(--border-radius);
          margin-bottom: 2rem;
        }
        
        .loading-spinner {
          margin-bottom: 1rem;
        }
        
        .spinner-ring {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-text {
          color: #666;
          font-weight: 500;
        }
        
        .time-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .time-duration {
          font-size: 0.875rem;
          color: #666;
          font-weight: 500;
        }
        
        .refresh-btn {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: var(--border-radius-sm);
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition);
          font-weight: 500;
          color: #333;
        }
        
        .refresh-btn:hover {
          background: white;
          box-shadow: var(--shadow-sm);
          transform: translateY(-1px);
        }
        
        .refresh-icon {
          font-size: 0.875rem;
        }

        /* Time Slots Grid */
        .time-slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .time-slot {
          background: white;
          border: 2px solid #e9ecef;
          border-radius: var(--border-radius);
          padding: 1.5rem;
          cursor: pointer;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }
        
        .time-slot.available {
          border-color: #4caf50;
          background: linear-gradient(135deg, #ffffff 0%, #f8fff8 100%);
        }
        
        .time-slot.available:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
          border-color: #2e7d32;
        }
        
        .time-slot.selected {
          background: var(--primary-gradient);
          color: white;
          border-color: #667eea;
          box-shadow: var(--shadow-lg);
        }
        
        .time-slot.unavailable {
          background: #f5f5f5;
          border-color: #ddd;
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .time-slot-content {
          text-align: center;
        }
        
        .time-main {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .time-duration {
          font-size: 0.875rem;
          opacity: 0.8;
          margin-bottom: 0.5rem;
        }
        
        .status-text {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .selected-text {
          color: #4caf50;
        }
        
        .time-slot-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        
        .time-slot.available:hover .time-slot-glow {
          transform: translateX(100%);
        }

        /* Availability Legend */
        .availability-legend {
          background: rgba(255, 255, 255, 0.9);
          border-radius: var(--border-radius);
          padding: 1rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .legend-title {
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #333;
        }
        
        .legend-items {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        
        .legend-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid;
        }
        
        .legend-item.available .legend-indicator {
          background: #4caf50;
          border-color: #4caf50;
        }
        
        .legend-item.unavailable .legend-indicator {
          background: #f44336;
          border-color: #f44336;
        }
        
        .legend-item.waitlist .legend-indicator {
          background: #ff9800;
          border-color: #ff9800;
        }

        /* Time Confirmation */
        .time-confirmation {
          margin-bottom: 2rem;
        }
        
        .time-confirmation .confirmation-card {
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
          border-color: #ff9800;
        }
        
        .time-confirmation .confirmation-icon {
          color: #ff9800;
        }
        
        .time-confirmation .confirmation-title {
          color: #e65100;
        }
        
        .confirmation-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .detail-label {
          font-weight: 600;
          color: #e65100;
        }
        
        .detail-value {
          color: #bf360c;
        }

        /* Modern Buttons */
        .modern-btn-primary {
          background: var(--primary-gradient);
          border: none;
          border-radius: var(--border-radius);
          padding: 1rem 2rem;
          font-weight: 600;
          color: white;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }
        
        .modern-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .modern-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .modern-btn-secondary {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: var(--border-radius);
          padding: 1rem 2rem;
          font-weight: 600;
          color: #333;
          transition: var(--transition);
        }
        
        .modern-btn-secondary:hover {
          background: #e9ecef;
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }
        
        .btn-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-arrow {
          font-size: 1.125rem;
          transition: var(--transition);
        }
        
        .modern-btn-primary:hover .btn-arrow {
          transform: translateX(3px);
        }
        
        .modern-btn-secondary:hover .btn-arrow {
          transform: translateX(-3px);
        }

        /* Card Actions */
        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
        }

        /* Warning Messages */
        .no-availability-warning {
          background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%);
          border: 2px solid #ff9800;
          border-radius: var(--border-radius);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .warning-icon {
          font-size: 2rem;
          color: #ff9800;
        }
        
        .warning-text {
          color: #e65100;
        }
        
        .warning-text strong {
          display: block;
          margin-bottom: 0.5rem;
        }

        /* Error Messages */
        .error-message {
          background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
          border: 2px solid #f44336;
          border-radius: var(--border-radius);
          padding: 1rem;
          color: #c62828;
          font-weight: 600;
          margin-top: 1rem;
        }

        /* Live Indicator */
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.9);
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius-sm);
        }
        
        .live-dot {
          width: 8px;
          height: 8px;
          background: #4caf50;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        .live-text {
          color: #2e7d32;
          font-weight: 500;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-features {
            flex-direction: column;
            align-items: center;
          }
          
          .progress-steps {
            flex-direction: column;
            gap: 1rem;
          }
          
          .progress-steps::before {
            display: none;
          }
          
          .time-slots-grid {
            grid-template-columns: 1fr;
          }
          
          .card-actions {
            flex-direction: column;
            gap: 1rem;
          }
          
          .card-actions .modern-btn-primary,
          .card-actions .modern-btn-secondary {
            width: 100%;
          }
          
          .legend-items {
            justify-content: center;
          }
          
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
          
          .hero-background {
            padding: 2rem 1rem;
          }
          
          .card-header-modern {
            padding: 1.5rem;
          }
          
          .time-controls {
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        /* Old styles for backward compatibility */
        .step {
          padding: 8px;
          border-radius: 8px;
          transition: var(--transition);
        }
        
        .step.active {
          background: #007bff;
          color: white;
        }
        
        .booking-summary p {
          color: #666;
          font-size: 0.9rem;
        }
        
        .features ul li {
          padding: 2px 0;
          font-size: 0.9rem;
        }
        
        .availability-counter {
          background: #e9ecef;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          margin-left: 8px;
        }
        
        /* Menu item cards */
        .menu-item-card {
          transition: var(--transition);
          border: 2px solid transparent;
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
        }
        
        .menu-item-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: #007bff;
        }
        
        /* Quantity selector styling */
        .quantity-selector {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .quantity-selector .form-control {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-weight: bold;
        }
        
        .quantity-selector .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
        }
        
        /* Cost breakdown styling */
        .cost-breakdown .cost-item-label {
          flex: 1;
        }
        
        .cost-breakdown .cost-item-value {
          text-align: right;
          min-width: 100px;
        }
        
        .cost-breakdown .border-bottom {
          border-color: #e9ecef !important;
        }
        
        /* Enhanced shadows and rounded corners */
        .shadow-sm {
          box-shadow: var(--shadow-sm);
        }
        
        .shadow-lg {
          box-shadow: var(--shadow-lg);
        }
        
        .rounded-3 {
          border-radius: 0.75rem;
        }
        
        /* Form control enhancements */
        .form-control-lg {
          padding: 0.75rem 1rem;
          font-size: 1.1rem;
          border-radius: 0.5rem;
          border: 2px solid #e9ecef;
        }
        
        .form-control-lg:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
        }
        
        /* Alert enhancements */
        .alert {
          border: none;
          border-radius: 0.75rem;
        }
        
        .alert-info {
          background: var(--info-gradient);
          color: #1565c0;
        }
        
        .alert-warning {
          background: var(--warning-gradient);
          color: #e65100;
        }
        
        .alert-success {
          background: var(--success-gradient);
          color: #2e7d32;
        }
      `}</style>
    </div>
  );
};

export default SimpleBookingSystem;
