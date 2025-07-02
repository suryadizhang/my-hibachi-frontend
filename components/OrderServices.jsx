"use client";

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Form, Button, Card, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE } from '../lib/config/api';
import './OrderServices.css';

// Phase 1: Import new components and hooks
import SmartDateSuggestions from './SmartDateSuggestions';
import MobileCalendar from './MobileCalendar';
import RealTimeNotifications from './RealTimeNotifications';
import { useEnhancedCaching } from './hooks/useEnhancedCaching';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';

const timeSlots = ['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];

const slotStatusColor = (status) => {
  if (status === "waiting") return "#ffc107"; // yellow for waiting list
  if (status === "booked") return "#dc3545"; // red for booked
  return "#28a745"; // green for available
};

const BookingModal = lazy(() => import('./BookingModal'));
const WaitlistModal = lazy(() => import('./WaitlistModal'));

const OrderServices = () => {
  // Date logic
  const now = new Date();
  now.setHours(0,0,0,0);
  const minSelectableDate = new Date(now);
  minSelectableDate.setDate(now.getDate() + 2);

  const [selectedDate, setSelectedDate] = useState(null);
  const [slotStatus, setSlotStatus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const [nextAvailableDate, setNextAvailableDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const debounceRef = useRef();
  
  // Phase 1: Enhanced caching and real-time updates
  const { 
    getAvailability, 
    prefetchAvailability, 
    bulkPrefetch, 
    isCacheValid,
    cacheSize 
  } = useEnhancedCaching();
  
  const { 
    isConnected, 
    lastUpdate, 
    updateNotifications, 
    clearNotification, 
    clearAllNotifications 
  } = useRealTimeUpdates(selectedDate);

  // Detect mobile device
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Example: Replace this with your real fully booked dates logic
  const fullyBookedDates = [
    new Date("2024-07-01"),
    new Date("2024-07-04"),
    // ...add more fully booked dates here
  ];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipcode: '',
    timeSlot: '',
    contactPreference: ''
  });
  const [waitlistData, setWaitlistData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: ''
  });
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState('success');
  const [waitlistMessage, setWaitlistMessage] = useState(null);
  const [waitlistVariant, setWaitlistVariant] = useState('success');
  const waitlistNameRef = useRef(null);

  // Helper: Check if date is at least 2 days in the future
  const isDateAllowed = (date) => {
    if (!date) return false;
    const now = new Date();
    now.setHours(0,0,0,0);
    const minDate = new Date(now);
    minDate.setDate(now.getDate() + 2);
    return date >= minDate;
  };

  useEffect(() => {
    // No need to set a default date since we want it to be null initially
    
    // Debug log initial state
    if (process.env.NODE_ENV === 'development') {
      console.log('Initial state - selectedDate:', selectedDate, 'minSelectableDate:', minSelectableDate);
    }
    // eslint-disable-next-line
  }, []);

  // Phase 1: Enhanced availability fetching with smart caching
  useEffect(() => {
    if (!selectedDate || !isDateAllowed(selectedDate)) return;
    
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setCalendarLoading(true);
      
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const availability = await getAvailability(dateStr);
        
        if (JSON.stringify(slotStatus) !== JSON.stringify(availability)) {
          setSlotStatus(availability);
        }
        
        // Phase 1: Trigger smart prefetching
        prefetchAvailability(selectedDate);
        
      } catch (error) {
        console.warn('API not available, using default slot status:', error.message);
        // Set default available status for all time slots when API is not available
        const defaultSlotStatus = {};
        timeSlots.forEach(slot => {
          defaultSlotStatus[slot] = { status: 'available' };
        });
        setSlotStatus(defaultSlotStatus);
      } finally {
        setCalendarLoading(false);
      }
    }, 300); // 300ms debounce
    
    return () => clearTimeout(debounceRef.current);
  }, [selectedDate, getAvailability, prefetchAvailability, slotStatus]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!selectedDate || !isDateAllowed(selectedDate)) {
      setVariant('danger');
      setMessage('You must select a date and book at least 2 days in advance.');
      return;
    }
    setLoading(true);
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      zipcode: formData.zipcode,
      date: selectedDate.toISOString().split('T')[0],
      time_slot: formData.timeSlot,
      contact_preference: formData.contactPreference,
    };
    
    console.log('Sending booking payload:', payload);
    
    try {
      await axios.post(`${API_BASE}/api/booking/book`, payload);
      setVariant('success');
      setMessage('Booking submitted!');
      setFormData({ name: '', phone: '', email: '', address: '', city: '', zipcode: '', timeSlot: '', contactPreference: '' });
      // Re-fetch slot availability after booking
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await axios.get(`${API_BASE}/api/booking/availability?date=${dateStr}`);
      setSlotStatus(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Booking submission error:', err);
      console.error('Error response:', err.response?.data);
      setVariant('danger');
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === "string") {
          setMessage(err.response.data.detail);
        } else if (Array.isArray(err.response.data.detail)) {
          const errorMessages = err.response.data.detail.map(d => 
            `${d.loc?.join('.')} ${d.msg}`
          ).join(", ");
          setMessage(`Validation errors: ${errorMessages}`);
        } else {
          setMessage("Booking failed. Please check your details and try again.");
        }
      } else if (err.response?.status === 401) {
        setMessage("Unauthorized. Please log in as admin.");
      } else if (err.response?.status === 403) {
        setMessage("Forbidden. You do not have permission.");
      } else if (err.response?.status === 429) {
        setMessage("Too many requests. Please wait and try again.");
      } else {
        setMessage("Could not connect to the server. Please try again later. or contact our customer service");
      }
    }
    setLoading(false);
  };

  // Calculate min selectable date (today + 2 days)
  const findNextAvailableDate = async (startDate) => {
    let date = new Date(startDate);
    for (let i = 0; i < 30; i++) {
      date.setDate(date.getDate() + 1);
      const dateStr = date.toISOString().split('T')[0];
      try {
        const res = await axios.get(`${API_BASE}/api/booking/availability?date=${dateStr}`);
        if (Object.values(res.data).some(slot => slot.status === "available")) {
          return new Date(date);
        }
      } catch {
        // ignore errors and continue
      }
    }
    return null;
  };

  useEffect(() => {
    if (
      selectedDate &&
      timeSlots.every(time => slotStatus[time]?.status === "booked")
    ) {
      findNextAvailableDate(selectedDate).then(setNextAvailableDate);
    } else {
      setNextAvailableDate(null);
    }
  }, [selectedDate, slotStatus]);

  const allSlotsFullyBooked =
    nextAvailableDate && timeSlots.every(time => slotStatus[time]?.status === "booked");

  // Waitlist logic
  const handleWaitlistOpen = () => {
    setWaitlistData({
      name: '',
      phone: '',
      email: '',
      preferredDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      preferredTime: ''
    });
    setWaitlistMessage(null);
    setShowWaitlistModal(true);
    setTimeout(() => waitlistNameRef.current && waitlistNameRef.current.focus(), 100);
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: waitlistData.name,
        phone: waitlistData.phone,
        email: waitlistData.email,
        preferred_date: waitlistData.preferredDate,
        preferred_time: waitlistData.preferredTime
      };
      await axios.post(`${API_BASE}/waitlist`, payload);
      setWaitlistVariant('success');
      setWaitlistMessage('You have been added to the waitlist! We will contact you if a slot opens.');
      setShowWaitlistModal(false);
      setWaitlistData({ name: '', phone: '', email: '', preferredDate: '', preferredTime: '' });
    } catch (error) {
      console.error("Waitlist error:", error);
      setWaitlistVariant('danger');
      setWaitlistMessage('Failed to join waitlist. Please try again.');
    }
    setLoading(false);
  };

  // Add a custom highlight for the selected date
  const dayClassName = (date) => {
    const now = new Date();
    now.setHours(0,0,0,0);
    const minForPast = new Date(now);
    minForPast.setDate(now.getDate() + 2);

    // Highlight the selected date
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      return "selected-calendar-day";
    }
    if (date < minForPast) return "past-day";
    if (fullyBookedDates.some(d => d.toDateString() === date.toDateString()))
      return "fully-booked-day";
    return "available-day";
  };

  // Input validation helpers
  const isPhoneValid = (phone) => /^[0-9]{10,15}$/.test(phone);
  const isZipValid = (zip) => /^[0-9]{4,10}$/.test(zip);

  // Handle submit button click - check for missing fields first
  const handleSubmitClick = () => {
    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      setShowMissingFieldsModal(true);
    } else {
      setShowModal(true);
    }
  };

  // Disable booking button if any required field is empty or invalid
  const isBookingDisabled = () => {
    return !formData.name || 
           !formData.phone || 
           !isPhoneValid(formData.phone) ||
           !formData.email || 
           !formData.address ||
           !formData.city ||
           !formData.zipcode ||
           !isZipValid(formData.zipcode) ||
           !formData.timeSlot || 
           !formData.contactPreference ||
           !selectedDate ||
           !isDateAllowed(selectedDate) ||
           slotStatus[formData.timeSlot]?.status === "booked" ||
           loading;
  };

  // Get missing fields for user feedback
  const getMissingFields = () => {
    const missing = [];
    if (!formData.name) missing.push('Full Name');
    if (!formData.phone) missing.push('Phone Number');
    else if (!isPhoneValid(formData.phone)) missing.push('Valid Phone Number (10-15 digits)');
    if (!formData.email) missing.push('Email Address');
    if (!formData.address) missing.push('Street Address');
    if (!formData.city) missing.push('City');
    if (!formData.zipcode) missing.push('Zip Code');
    else if (!isZipValid(formData.zipcode)) missing.push('Valid Zip Code (4-10 digits)');
    if (!selectedDate) missing.push('Date Selection');
    else if (!isDateAllowed(selectedDate)) missing.push('Valid Date (at least 2 days in advance)');
    if (!formData.timeSlot) missing.push('Time Slot');
    if (!formData.contactPreference) missing.push('Contact Preference');
    if (slotStatus[formData.timeSlot]?.status === "booked") missing.push('Available Time Slot');
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('FormData check:', {
        name: formData.name,
        phone: formData.phone,
        phoneValid: isPhoneValid(formData.phone),
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipcode: formData.zipcode,
        zipcodeValid: isZipValid(formData.zipcode),
        timeSlot: formData.timeSlot,
        contactPreference: formData.contactPreference,
        dateAllowed: isDateAllowed(selectedDate),
        slotAvailable: slotStatus[formData.timeSlot]?.status !== "booked",
        missing: missing
      });
    }
    
    return missing;
  };

  // Highlight selected time slot in the dropdown and slot status
  const isSelectedTime = (time) => formData.timeSlot === time;

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showModal || showWaitlistModal || showMissingFieldsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showModal, showWaitlistModal, showMissingFieldsModal]);

  // Keyboard ESC support for modals
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (showModal) setShowModal(false);
        if (showWaitlistModal) setShowWaitlistModal(false);
        if (showMissingFieldsModal) setShowMissingFieldsModal(false);
      }
    };
    if (showModal || showWaitlistModal || showMissingFieldsModal) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal, showWaitlistModal, showMissingFieldsModal]);

  return (
    <div className="bookus-container">
      <Container fluid className="px-lg-5">
        {/* Enhanced Hero Section */}
        <div className="bookus-hero">
          <div className="hero-icon-wrapper">
            <span className="hero-main-icon emoji-visible">📅</span>
          </div>
          <h1 className="hero-title">Book Your Hibachi Experience</h1>
          <p className="hero-subtitle">
            <span className="emoji-visible">✨</span>
            Reserve your premium in-home hibachi dining experience
            <span className="emoji-visible">✨</span>
          </p>
        </div>

        <Card className="booking-main-card p-0 border-0">
          <div className="p-4 p-lg-5">
            <Row className="g-4">
              {/* Enhanced Calendar Section */}
              <Col lg={6}>
                <div className="calendar-section">
                  <div className="calendar-header">
                    <span className="calendar-icon emoji-visible">📅</span>
                    <h3 className="calendar-title">Select Your Date</h3>
                  </div>
                  
                  {/* Phase 1: Smart Date Suggestions */}
                  <SmartDateSuggestions 
                    onDateSelect={setSelectedDate}
                    selectedDate={selectedDate}
                  />
                  
                  <div style={{ position: "relative", minHeight: "340px" }}>
                    {calendarLoading && (
                      <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                      </div>
                    )}
                    
                    {/* Phase 1: Mobile-optimized calendar */}
                    {isMobile ? (
                      <MobileCalendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        minDate={minSelectableDate}
                        excludeDates={fullyBookedDates}
                        dayClassName={dayClassName}
                        onMonthChange={(date) => {
                          // Phase 1: Prefetch month data when navigating
                          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                          const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                          const monthDates = [];
                          
                          for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
                            if (d >= minSelectableDate) {
                              monthDates.push(d.toISOString().split('T')[0]);
                            }
                          }
                          
                          // Bulk prefetch month data
                          bulkPrefetch(monthDates);
                        }}
                      />
                    ) : (
                      <DatePicker
                        selected={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        dayClassName={dayClassName}
                        minDate={minSelectableDate}
                        excludeDates={fullyBookedDates}
                        inline
                        aria-label="Select booking date"
                        onMonthChange={(date) => {
                          // Phase 1: Prefetch month data for desktop too
                          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                          const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                          const monthDates = [];
                          
                          for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
                            if (d >= minSelectableDate) {
                              monthDates.push(d.toISOString().split('T')[0]);
                            }
                          }
                          
                          bulkPrefetch(monthDates);
                        }}
                      />
                    )}
                  </div>
                  
                  <div className="status-legend">
                    <div className="legend-item">
                      <div className="legend-dot" style={{ background: "#28a745" }}></div>
                      <span>Available</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-dot" style={{ background: "#ffc107" }}></div>
                      <span>Waiting List</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-dot" style={{ background: "#dc3545" }}></div>
                      <span>Booked</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-dot" style={{ background: "#0056b3" }}></div>
                      <span>Selected</span>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Enhanced Form Section */}
              <Col lg={6}>
                <div className="form-section">
                  <div className="form-header">
                    <span className="form-icon emoji-visible">📝</span>
                    <h3 className="form-title">Booking Details</h3>
                  </div>

                  {message && (
                    <Alert variant={variant} className={`enhanced-alert alert-${variant} mb-4`} aria-live="polite">
                      <span className="alert-icon emoji-visible">
                        {variant === 'success' ? '✅' : variant === 'danger' ? '❌' : '⚠️'}
                      </span>
                      {message}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit} aria-label="Booking form">
                    <div className="enhanced-form-group">
                      <Form.Label htmlFor="name" className="enhanced-form-label">
                        <span className="label-icon emoji-visible">👤</span>
                        Full Name
                      </Form.Label>
                      <Form.Control 
                        id="name"
