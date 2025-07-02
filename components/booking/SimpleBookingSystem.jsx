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
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="display-4 text-primary">🍴 Book Your Hibachi Experience</h1>
          <p className="lead text-muted">Premium mobile hibachi catering brought to your location</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">🎯 Booking Progress</h5>
              <Badge bg="primary">{Math.round(progress)}% Complete</Badge>
            </div>
            
            <div className="progress mb-3" style={{ height: '8px' }}>
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
                role="progressbar"
              ></div>
            </div>
            
            <div className="row text-center">
              <div className="col-3">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                  📅 <small>Select Date</small>
                </div>
              </div>
              <div className="col-3">
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                  ⏰ <small>Choose Time</small>
                </div>
              </div>
              <div className="col-3">
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                  👤 <small>Your Details</small>
                </div>
              </div>
              <div className="col-3">
                <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
                  ✅ <small>Confirm</small>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Row>
          <Col lg={8}>
            {/* Step 1: Date Selection */}
            {currentStep === 1 && (
              <Card>
                <Card.Header>
                  <h5 className="mb-0">📅 Select Your Date</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Choose Date:</strong></Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.selectedDate}
                      min={getMinDate()}
                      max={getMaxDate()}
                      onChange={(e) => handleInputChange('selectedDate', e.target.value)}
                      isInvalid={!!errors.selectedDate}
                      style={{ fontSize: '1.1rem', padding: '0.75rem' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.selectedDate}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      📅 Book from 2 days to 1 year in advance
                    </Form.Text>
                  </Form.Group>
                  
                  {formData.selectedDate && (
                    <Alert variant="success">
                      <strong>Selected:</strong> {new Date(formData.selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Alert>
                  )}
                  
                  <div className="d-flex justify-content-end">
                    <Button 
                      variant="primary" 
                      onClick={handleNext}
                      disabled={!formData.selectedDate}
                    >
                      Next: Choose Time →
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Step 2: Time Selection */}
            {currentStep === 2 && (
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">⏰ Select Your Time</h5>
                  {lastUpdated && (
                    <small className="text-success">
                      🔄 Updated {lastUpdated.toLocaleTimeString()}
                    </small>
                  )}
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <strong>Date:</strong> {new Date(formData.selectedDate).toLocaleDateString()}
                  </div>
                  
                  {isCheckingAvailability && (
                    <div className="text-center mb-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Checking availability...</span>
                      </div>
                      <small className="text-muted ms-2">Checking real-time availability...</small>
                    </div>
                  )}
                  
                  <Form.Group className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Form.Label><strong>Available Time Slots:</strong></Form.Label>
                      <div>
                        <small className="text-muted me-3">⏰ 90 minutes each</small>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => checkAvailability(formData.selectedDate)}
                          disabled={isCheckingAvailability}
                        >
                          🔄 Refresh
                        </Button>
                      </div>
                    </div>
                    
                    <div className="time-slots">
                      {availableSlots.map((slot) => {
                        // Calculate end time (90 minutes later)
                        const startTime = slot.time;
                        const endTime = getEndTime(startTime);
                        
                        return (
                          <Button
                            key={slot.time}
                            variant={
                              formData.selectedTime === slot.time 
                                ? "primary" 
                                : slot.available 
                                  ? "outline-success" 
                                  : "outline-danger"
                            }
                            className="m-1 time-slot-button"
                            onClick={() => slot.available && handleInputChange('selectedTime', slot.time)}
                            disabled={!slot.available}
                          >
                            <div className="text-center">
                              <div><strong>{startTime}</strong></div>
                              <small>to {endTime}</small>
                              {!slot.available && <div><small>(Booked)</small></div>}
                              {slot.status === 'waiting' && <div><small>(Waitlist)</small></div>}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                    
                    {availableSlots.length === 0 && !isCheckingAvailability && (
                      <Alert variant="warning">
                        No availability data loaded. Using default time slots.
                      </Alert>
                    )}
                    
                    {errors.selectedTime && (
                      <div className="text-danger mt-2">{errors.selectedTime}</div>
                    )}
                  </Form.Group>
                  
                  {/* Availability Legend */}
                  <div className="mb-3">
                    <small className="text-muted">
                      <span className="badge bg-success me-2">Available</span>
                      <span className="badge bg-danger me-2">Booked</span>
                      <span className="badge bg-warning">Waitlist</span>
                    </small>
                  </div>
                  
                  {formData.selectedTime && (
                    <Alert variant="success">
                      <strong>Selected:</strong> {formData.selectedTime} - {getEndTime(formData.selectedTime)} (90 minutes)<br/>
                      <strong>Date:</strong> {new Date(formData.selectedDate).toLocaleDateString()}
                    </Alert>
                  )}
                  
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-secondary" onClick={handlePrevious}>
                      ← Back
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleNext}
                      disabled={!formData.selectedTime}
                    >
                      Next: Your Details →
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
                  
                  {/* Guest Count and Breakdown */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label><strong>Adult Guests (Ages 13+)</strong></Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          max="50"
                          value={formData.adultCount}
                          onChange={(e) => handleInputChange('adultCount', parseInt(e.target.value))}
                        />
                        <Form.Text className="text-muted">
                          $55 per adult
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label><strong>Child Guests (Ages 4-12)</strong></Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          max="20"
                          value={formData.childCount}
                          onChange={(e) => handleInputChange('childCount', parseInt(e.target.value))}
                        />
                        <Form.Text className="text-muted">
                          $30 per child
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Menu Upgrades */}
                  <Form.Group className="mb-3">
                    <Form.Label><strong>🌟 Premium Protein Upgrades</strong></Form.Label>
                    <small className="text-muted d-block mb-2">
                      Add premium proteins to any guest's meal (per person)
                    </small>
                    <Row>
                      {upgradeOptions.map((upgrade) => (
                        <Col md={6} lg={12} xl={6} key={upgrade.name} className="mb-2">
                          <div className="d-flex align-items-center justify-content-between p-2 border rounded">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center">
                                <span className="me-2">{upgrade.icon}</span>
                                <div>
                                  <strong>{upgrade.name}</strong>
                                  <div className="text-success">+${upgrade.extra}/person</div>
                                  <small className="text-muted">{upgrade.description}</small>
                                </div>
                              </div>
                            </div>
                            <div style={{ minWidth: '80px' }}>
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
                              />
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Form.Group>

                  {/* Additional Items */}
                  <Form.Group className="mb-3">
                    <Form.Label><strong>🍜 Additional Items</strong></Form.Label>
                    <small className="text-muted d-block mb-2">
                      Add extra items to your hibachi experience
                    </small>
                    <Row>
                      {additionalOptions.map((addition) => (
                        <Col md={6} lg={12} xl={6} key={addition.name} className="mb-2">
                          <div className="d-flex align-items-center justify-content-between p-2 border rounded">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center">
                                <span className="me-2">{addition.icon}</span>
                                <div>
                                  <strong>{addition.name}</strong>
                                  <div className="text-success">+${addition.extra}</div>
                                  <small className="text-muted">{addition.description}</small>
                                </div>
                              </div>
                            </div>
                            <div style={{ minWidth: '80px' }}>
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
                              />
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Form.Group>

                  {/* Real-time Cost Calculator */}
                  {(formData.adultCount > 0 || formData.childCount > 0) && (
                    <Card className="mb-3 bg-light border-primary">
                      <Card.Header className="bg-primary text-white">
                        <h6 className="mb-0">💰 Live Cost Calculator</h6>
                      </Card.Header>
                      <Card.Body>
                        {(() => {
                          const costInfo = calculateComprehensiveCost(
                            formData.adultCount || 0, 
                            formData.childCount || 0, 
                            formData.selectedUpgrades, 
                            formData.selectedAdditions,
                            0 // No gratuity in the base calculation
                          );
                          return (
                            <div>
                              <div className="row mb-2">
                                <div className="col-8">Base Cost ({formData.adultCount} adults @ $55, {formData.childCount} children @ $30):</div>
                                <div className="col-4 text-end"><strong>${costInfo.baseCost}</strong></div>
                              </div>
                              {costInfo.upgradeCost > 0 && (
                                <div className="row mb-2">
                                  <div className="col-8">Premium Upgrades:</div>
                                  <div className="col-4 text-end">+${costInfo.upgradeCost}</div>
                                </div>
                              )}
                              {costInfo.additionCost > 0 && (
                                <div className="row mb-2">
                                  <div className="col-8">Additional Items:</div>
                                  <div className="col-4 text-end">+${costInfo.additionCost}</div>
                                </div>
                              )}
                              <hr className="my-2" />
                              <div className="row mb-2">
                                <div className="col-8"><strong>Subtotal (before gratuity):</strong></div>
                                <div className="col-4 text-end"><strong className="text-primary">${costInfo.subtotal}</strong></div>
                              </div>
                              
                              {/* Gratuity Recommendation Text */}
                              <div className="mt-3">
                                <small className="text-muted d-block mb-2">
                                  <strong>💡 Recommended: 20-35% based on service quality.</strong>
                                </small>
                              </div>
                              
                              {/* Minimum order check */}
                              {!costInfo.meetsMinimum && (
                                <div className="mt-2 p-2 bg-warning text-dark rounded">
                                  <small>⚠️ Minimum order value: $550. Need $${costInfo.shortfall} more to meet minimum.</small>
                                </div>
                              )}
                              {costInfo.meetsMinimum && (
                                <div className="mt-2 p-2 bg-success text-white rounded">
                                  <small>✅ Meets minimum order requirement!</small>
                                </div>
                              )}
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
        .step {
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .step.active {
          background: #007bff;
          color: white;
        }
        
        .time-slots {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }
        
        .time-slot-button {
          min-width: 120px !important;
          min-height: 70px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        .booking-summary p {
          color: #666;
          font-size: 0.9rem;
        }
        
        .features ul li {
          padding: 2px 0;
          font-size: 0.9rem;
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        .availability-counter {
          background: #e9ecef;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          margin-left: 8px;
        }
        
        @media (max-width: 768px) {
          .time-slots {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleBookingSystem;
