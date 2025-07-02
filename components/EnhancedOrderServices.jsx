// Enhanced OrderServices - Integrates the new modular booking system
// This component provides backward compatibility while using the new modular architecture

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE } from '../lib/config/api';
import ModularBookingSystem from './booking/ModularBookingSystem';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';
import SEO from './SEO';

const EnhancedOrderServices = () => {
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Real-time updates for the entire page
  const { 
    isConnected, 
    updateNotifications, 
    clearAllNotifications 
  } = useRealTimeUpdates();

  // Handle booking submission
  const handleBookingSubmit = useCallback(async (bookingData) => {
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      // Prepare payload in the expected format
      const payload = {
        name: bookingData.customerInfo.name,
        phone: bookingData.customerInfo.phone,
        email: bookingData.customerInfo.email,
        address: bookingData.customerInfo.address,
        city: bookingData.customerInfo.city,
        zipcode: bookingData.customerInfo.zipcode,
        date: bookingData.selectedDate.toISOString().split('T')[0],
        time_slot: bookingData.selectedTime,
        contact_preference: bookingData.customerInfo.contactPreference,
      };
      
      console.log('Submitting booking with payload:', payload);
      
      // Submit booking
      const response = await axios.post(`${API_BASE}/api/booking/book`, payload);
      
      setVariant('success');
      setMessage('🎉 Booking submitted successfully! You will receive a confirmation email shortly.');
      
      // Clear form after successful submission
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      
      return { 
        success: true, 
        message: 'Booking confirmed!',
        data: response.data 
      };
      
    } catch (error) {
      console.error('Booking submission error:', error);
      
      let errorMessage = 'Booking failed. Please try again.';
      
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === "string") {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          const errorMessages = error.response.data.detail.map(d => 
            `${d.loc?.join('.')} ${d.msg}`
          ).join(", ");
          errorMessage = `Validation errors: ${errorMessages}`;
        }
      } else if (error.response?.status === 401) {
        errorMessage = "Unauthorized. Please refresh the page and try again.";
      } else if (error.response?.status === 403) {
        errorMessage = "Access forbidden. Please contact support.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (!error.response) {
        errorMessage = "Could not connect to the server. Please check your internet connection and try again.";
      }
      
      setVariant('danger');
      setMessage(`❌ ${errorMessage}`);
      
      return { 
        success: false, 
        message: errorMessage 
      };
      
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Handle form reset
  const handleReset = useCallback(() => {
    setMessage(null);
    setVariant('success');
    clearAllNotifications();
  }, [clearAllNotifications]);

  // Handle save as draft
  const handleSaveAsDraft = useCallback(() => {
    setMessage('💾 Booking saved as draft. You can continue later.');
    setVariant('info');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  }, []);

  // Show notifications from real-time updates
  useEffect(() => {
    if (updateNotifications.length > 0) {
      const latestNotification = updateNotifications[updateNotifications.length - 1];
      if (latestNotification.type === 'booking_confirmed') {
        setMessage('✅ A booking was just confirmed! Availability has been updated.');
        setVariant('info');
        setTimeout(() => setMessage(null), 4000);
      } else if (latestNotification.type === 'slot_unavailable') {
        setMessage('⚠️ The selected time slot just became unavailable. Please choose another time.');
        setVariant('warning');
        setTimeout(() => setMessage(null), 5000);
      }
    }
  }, [updateNotifications]);

  return (
    <div className="enhanced-order-services">
      {/* SEO Component */}
      <SEO
        title="Book Private Hibachi Chef | Silicon Valley Mobile Catering | Same-Day Booking Available"
        description="Book your private hibachi chef today! Premium mobile hibachi catering serving Silicon Valley, Peninsula, East Bay, and North Bay. Same-day booking available for last-minute parties. Professional chef brings live cooking show, flame tricks, and all equipment to your backyard, beachside, or venue."
        keywords="hibachi chef, mobile hibachi, private chef, catering silicon valley, hibachi party, backyard hibachi, private dining, japanese chef, teppanyaki catering, mobile cooking"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Mobile Hibachi Catering",
          "description": "Premium mobile hibachi catering service",
          "url": "https://yourdomain.com/BookUs",
          "telephone": "+1-XXX-XXX-XXXX",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Silicon Valley",
            "addressRegion": "CA",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 37.4419,
            "longitude": -122.1430
          },
          "areaServed": {
            "@type": "Place",
            "name": "Silicon Valley, Peninsula, East Bay, North Bay",
            "geoRadius": "50 miles"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Hibachi Catering Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Private Hibachi Chef Service",
                  "description": "Professional hibachi chef brings authentic Japanese cuisine to your home"
                }
              }
            ]
          },
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "USD",
            "category": "Food Service"
          }
        }}
      />

      {/* Global Message Display */}
      {message && (
        <Container className="mb-3">
          <Alert variant={variant} className="text-center" dismissible onClose={() => setMessage(null)}>
            {message}
          </Alert>
        </Container>
      )}

      {/* Connection Status for Real-time Updates */}
      {!isConnected && (
        <Container className="mb-3">
          <Alert variant="warning" className="text-center">
            <span className="me-2">🔄</span>
            Reconnecting to live updates...
          </Alert>
        </Container>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div 
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5>Processing Your Booking...</h5>
            <p className="mb-0 text-muted">Please wait while we confirm your reservation.</p>
          </div>
        </div>
      )}

      {/* Main Modular Booking System */}
      <ModularBookingSystem
        onSubmit={handleBookingSubmit}
        onReset={handleReset}
        onSaveAsDraft={handleSaveAsDraft}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EnhancedOrderServices;
