// Customer Information Form Component - Modular and Optimized
// Handles only customer data collection with validation

import React, { memo, useCallback, useMemo, useEffect } from 'react';
import { Card, Form, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { useBooking } from '../context/BookingContext';
import './CustomerInfoForm.css';

// Field validation rules
const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)'
  },
  phone: {
    required: true,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  address: {
    required: true,
    minLength: 5,
    message: 'Please enter a complete address'
  },
  city: {
    required: true,
    minLength: 2,
    message: 'Please enter a valid city name'
  },
  zipcode: {
    required: true,
    pattern: /^\d{5}(-\d{4})?$/,
    message: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
  }
};

const CustomerInfoForm = memo(() => {
  const bookingContext = useBooking();
  
  // Early return if context is not available
  if (!bookingContext) {
    return (
      <Card className="mb-4 customer-form-card">
        <Card.Header>
          <h5 className="mb-0">👤 Customer Information</h5>
        </Card.Header>
        <Card.Body className="text-center text-muted">
          <p>Loading booking context...</p>
        </Card.Body>
      </Card>
    );
  }
  
  const { 
    selectedDate,
    selectedTime,
    customerInfo,
    error,
    actions
  } = bookingContext;
  
  // Safety check for actions
  if (!actions) {
    return (
      <Card className="mb-4 customer-form-card">
        <Card.Header>
          <h5 className="mb-0">👤 Customer Information</h5>
        </Card.Header>
        <Card.Body className="text-center text-muted">
          <p>Initializing form actions...</p>
        </Card.Body>
      </Card>
    );
  }
  
  // Ensure customerInfo is defined with default values
  const formData = useMemo(() => {
    // Robust fallback for undefined or null customerInfo
    if (!customerInfo || typeof customerInfo !== 'object') {
      return {
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        zipcode: '',
        contactPreference: 'email'
      };
    }
    
    // Merge customerInfo with defaults to ensure all fields exist
    return {
      name: customerInfo.name || '',
      phone: customerInfo.phone || '',
      email: customerInfo.email || '',
      address: customerInfo.address || '',
      city: customerInfo.city || '',
      zipcode: customerInfo.zipcode || '',
      contactPreference: customerInfo.contactPreference || customerInfo.contact_preference || 'email'
    };
  }, [customerInfo]);
  
  // Memoized validation state
  const validationErrors = useMemo(() => {
    const errors = {};
    
    // Safety check: ensure formData is defined and is an object
    if (!formData || typeof formData !== 'object') {
      return errors;
    }
    
    Object.entries(VALIDATION_RULES).forEach(([field, rules]) => {
      const value = formData[field]?.trim() || '';
      
      if (rules.required && !value) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        return;
      }
      
      if (value && rules.minLength && value.length < rules.minLength) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters`;
        return;
      }
      
      if (value && rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.message;
        return;
      }
    });
    
    return errors;
  }, [formData]);
  
  // Check if form is valid
  const isFormValid = useMemo(() => {
    // Safety check for formData
    if (!formData || typeof formData !== 'object') {
      return false;
    }
    
    return Object.keys(validationErrors).length === 0 && 
           Object.values(formData).every(value => value?.toString().trim());
  }, [validationErrors, formData]);
  
  // Handle field changes with validation
  const handleFieldChange = useCallback((field, value) => {
    // Safety check for actions
    if (!actions || typeof actions.updateCustomerInfo !== 'function') {
      console.warn('BookingContext actions not available');
      return;
    }
    
    // Real-time validation feedback
    actions.updateCustomerInfo({ [field]: value });
    
    // Clear global error if user is typing
    if (error && actions.clearError) {
      actions.clearError();
    }
  }, [actions, error]);
  
  // Auto-save to localStorage
  useEffect(() => {
    if (isFormValid) {
      localStorage.setItem('hibachi_booking_form', JSON.stringify(formData));
    }
  }, [formData, isFormValid]);
  
  // Load saved form data on mount
  useEffect(() => {
    const saved = localStorage.getItem('hibachi_booking_form');
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        actions.updateCustomerInfo(savedData);
      } catch (e) {
        console.warn('Failed to load saved form data');
      }
    }
  }, [actions]);
  
  // Memoized field component
  const FormField = memo(({ field, label, type = 'text', placeholder, icon }) => {
    const hasError = validationErrors[field];
    const value = (formData && formData[field]) ? formData[field].toString() : '';
    
    return (
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">
          {icon && <span className="me-2">{icon}</span>}
          {label}
          <span className="text-danger">*</span>
        </Form.Label>
        
        <InputGroup>
          <Form.Control
            type={type}
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={placeholder}
            isInvalid={!!hasError}
            isValid={value && !hasError}
            className={`form-field ${hasError ? 'error' : ''} ${value && !hasError ? 'valid' : ''}`}
          />
          
          {hasError && (
            <div className="invalid-feedback">
              {hasError}
            </div>
          )}
          
          {value && !hasError && (
            <div className="valid-feedback">
              ✓ Looks good!
            </div>
          )}
        </InputGroup>
      </Form.Group>
    );
  });
  
  FormField.displayName = 'FormField';
  
  if (!selectedDate || !selectedTime) {
    return (
      <Card className="mb-4 customer-form-card disabled">
        <Card.Header>
          <h5 className="mb-0">👤 Customer Information</h5>
        </Card.Header>
        <Card.Body className="text-center text-muted">
          <p>Please select a date and time first</p>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card className="mb-4 customer-form-card">
      <Card.Header>
        <h5 className="mb-0">👤 Customer Information</h5>
        <small className="text-muted">
          {selectedDate.toLocaleDateString()} at {selectedTime}
        </small>
      </Card.Header>
      
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        <Form>
          <Row>
            <Col md={6}>
              <FormField
                field="name"
                label="Full Name"
                placeholder="Enter your full name"
                icon="👤"
              />
            </Col>
            <Col md={6}>
              <FormField
                field="phone"
                label="Phone Number"
                type="tel"
                placeholder="(555) 123-4567"
                icon="📞"
              />
            </Col>
          </Row>
          
          <Row>
            <Col md={12}>
              <FormField
                field="email"
                label="Email Address"
                type="email"
                placeholder="your.email@example.com"
                icon="📧"
              />
            </Col>
          </Row>
          
          <Row>
            <Col md={8}>
              <FormField
                field="address"
                label="Street Address"
                placeholder="123 Main Street"
                icon="🏠"
              />
            </Col>
            <Col md={4}>
              <FormField
                field="zipcode"
                label="ZIP Code"
                placeholder="12345"
                icon="📮"
              />
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <FormField
                field="city"
                label="City"
                placeholder="Your City"
                icon="🏙️"
              />
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <span className="me-2">📞</span>
                  Preferred Contact Method
                </Form.Label>
                <Form.Select
                  value={formData.contactPreference || 'email'}
                  onChange={(e) => handleFieldChange('contactPreference', e.target.value)}
                  className="form-field"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="text">Text Message</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        
        {/* Form Progress Indicator */}
        <div className="form-progress mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">Form Completion:</small>
            <small className="text-muted">
              {formData ? Object.values(formData).filter(v => v?.toString().trim()).length : 0} / {Object.keys(VALIDATION_RULES).length + 1} fields
            </small>
          </div>
          <div className="progress mt-1">
            <div 
              className="progress-bar"
              style={{ 
                width: `${formData ? (Object.values(formData).filter(v => v?.toString().trim()).length / (Object.keys(VALIDATION_RULES).length + 1)) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>
        
        {/* Validation Summary */}
        {Object.keys(validationErrors).length > 0 && (
          <Alert variant="warning" className="mt-3">
            <div className="d-flex align-items-center">
              <span className="me-2">⚠️</span>
              <div>
                <strong>Please correct the following:</strong>
                <ul className="mb-0 mt-1">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Alert>
        )}
        
        {isFormValid && (
          <Alert variant="success" className="mt-3">
            <div className="d-flex align-items-center">
              <span className="me-2">✅</span>
              <strong>All information looks good! Ready to proceed.</strong>
            </div>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
});

CustomerInfoForm.displayName = 'CustomerInfoForm';

export default CustomerInfoForm;
