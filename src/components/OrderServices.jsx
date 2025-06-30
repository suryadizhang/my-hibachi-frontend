import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Form, Button, Card, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE } from '../config/api';
import './OrderServices.css';

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
  const [availabilityCache, setAvailabilityCache] = useState({});

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

  useEffect(() => {
    if (!selectedDate || !isDateAllowed(selectedDate)) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const fetchAvailability = async () => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        if (availabilityCache[dateStr]) {
          if (JSON.stringify(slotStatus) !== JSON.stringify(availabilityCache[dateStr])) {
            setSlotStatus(availabilityCache[dateStr]);
          }
          return;
        }
        setCalendarLoading(true);
        try {
          const res = await axios.get(`${API_BASE}/api/booking/availability?date=${dateStr}`);
          if (JSON.stringify(slotStatus) !== JSON.stringify(res.data)) {
            setSlotStatus(res.data);
            setAvailabilityCache(prev => ({ ...prev, [dateStr]: res.data }));
            // Prefetch next 2 days availability
            for (let offset = 1; offset <= 2; offset++) {
              const prefetchDate = new Date(selectedDate);
              prefetchDate.setDate(prefetchDate.getDate() + offset);
              const prefetchStr = prefetchDate.toISOString().split('T')[0];
              if (!availabilityCache[prefetchStr]) {
                axios.get(`${API_BASE}/api/booking/availability?date=${prefetchStr}`).then(res => {
                  setAvailabilityCache(prev => ({ ...prev, [prefetchStr]: res.data }));
                });
              }
            }
          }
        } catch (error) {
          console.warn('API not available, using default slot status:', error.message);
          // Set default available status for all time slots when API is not available
          const defaultSlotStatus = {};
          timeSlots.forEach(slot => {
            defaultSlotStatus[slot] = { status: 'available' };
          });
          setSlotStatus(defaultSlotStatus);
        }
        setCalendarLoading(false);
      };
      fetchAvailability();
    }, 300); // 300ms debounce
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [selectedDate]);

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
      ...formData,
      date: selectedDate.toISOString().split('T')[0],
      timeSlot: formData.timeSlot,
      contactPreference: formData.contactPreference,
      address: formData.address,
      city: formData.city,
      zipcode: formData.zipcode,
    };
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
      setVariant('danger');
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === "string") {
          setMessage(err.response.data.detail);
        } else if (Array.isArray(err.response.data.detail)) {
          setMessage(err.response.data.detail.map(d => d.msg).join(", "));
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
      await axios.post(`${API_BASE}/waitlist`, waitlistData);
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
                  
                  <div style={{ position: "relative", minHeight: "340px" }}>
                    {calendarLoading && (
                      <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                      </div>
                    )}
                    <DatePicker
                      selected={selectedDate}
                      onChange={date => setSelectedDate(date)}
                      dayClassName={dayClassName}
                      minDate={minSelectableDate}
                      excludeDates={fullyBookedDates}
                      inline
                      aria-label="Select booking date"
                    />
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
                        type="text" 
                        required
                        className="enhanced-form-control"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      />
                    </div>

                    <div className="enhanced-form-group">
                      <Form.Label htmlFor="phone" className="enhanced-form-label">
                        <span className="label-icon emoji-visible">📞</span>
                        Phone Number
                      </Form.Label>
                      <Form.Control 
                        id="phone" 
                        type="tel" 
                        required 
                        pattern="[0-9]{10,15}"
                        className="enhanced-form-control"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        isInvalid={formData.phone && !isPhoneValid(formData.phone)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid phone number (10-15 digits).
                      </Form.Control.Feedback>
                    </div>

                    <div className="enhanced-form-group">
                      <Form.Label htmlFor="email" className="enhanced-form-label">
                        <span className="label-icon emoji-visible">✉️</span>
                        Email Address
                      </Form.Label>
                      <Form.Control 
                        id="email" 
                        type="email" 
                        required 
                        className="enhanced-form-control"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      />
                    </div>

                    <div className="enhanced-form-group">
                      <Form.Label htmlFor="address" className="enhanced-form-label">
                        <span className="label-icon emoji-visible">🏠</span>
                        Street Address
                      </Form.Label>
                      <Form.Control
                        id="address"
                        type="text"
                        required
                        className="enhanced-form-control"
                        placeholder="Enter your street address"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div className="address-grid">
                      <div className="enhanced-form-group">
                        <Form.Label htmlFor="city" className="enhanced-form-label">
                          <span className="label-icon emoji-visible">🏙️</span>
                          City
                        </Form.Label>
                        <Form.Control
                          id="city"
                          type="text"
                          required
                          className="enhanced-form-control"
                          placeholder="Enter your city"
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>

                      <div className="enhanced-form-group">
                        <Form.Label htmlFor="zipcode" className="enhanced-form-label">
                          <span className="label-icon emoji-visible">📮</span>
                          Zip Code
                        </Form.Label>
                        <Form.Control
                          id="zipcode"
                          type="text"
                          required
                          className="enhanced-form-control"
                          placeholder="Enter zip code"
                          value={formData.zipcode}
                          onChange={e => setFormData({ ...formData, zipcode: e.target.value })}
                          isInvalid={formData.zipcode && !isZipValid(formData.zipcode)}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter a valid zip code (4-10 digits).
                        </Form.Control.Feedback>
                      </div>
                    </div>

                    <div className="enhanced-form-group">
                      <Form.Label htmlFor="contactPreference" className="enhanced-form-label">
                        <span className="label-icon emoji-visible">📱</span>
                        Contact Preference
                      </Form.Label>
                      <Form.Select 
                        id="contactPreference" 
                        required
                        className="enhanced-form-control"
                        value={formData.contactPreference}
                        onChange={e => setFormData({ ...formData, contactPreference: e.target.value })}
                      >
                        <option value="" disabled>Choose your preference</option>
                        <option value="text">📱 Text Message</option>
                        <option value="call">📞 Phone Call</option>
                        <option value="email">✉️ Email</option>
                      </Form.Select>
                    </div>

                    <div className="timeslot-section">
                      <div className="timeslot-header">
                        <span className="calendar-icon emoji-visible">⏰</span>
                        <h4 className="timeslot-title">Select Time Slot</h4>
                      </div>
                      
                      <Form.Select 
                        id="timeSlot" 
                        required 
                        className="enhanced-form-control"
                        value={formData.timeSlot}
                        onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}
                            disabled={slotStatus[time]?.status === "booked"}
                          >
                            {time}
                            {slotStatus[time]?.status === "available" && " (Available)"}
                            {slotStatus[time]?.status === "waiting" && " (Waiting List)"}
                            {slotStatus[time]?.status === "booked" && " (Booked)"}
                          </option>
                        ))}
                      </Form.Select>
                      
                      <TimeSlotStatus timeSlots={timeSlots} slotStatus={slotStatus} selectedTime={formData.timeSlot} />
                    </div>

                    <Button
                      type="button"
                      className="enhanced-btn"
                      disabled={loading}
                      onClick={handleSubmitClick}
                      aria-label="Submit Booking"
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          <span className="btn-icon emoji-visible">📅</span>
                          Submit Booking
                        </>
                      )}
                    </Button>
                  </Form>

                  {/* Info Cards */}
                  <div className="info-card warning">
                    <div className="info-content">
                      <span className="info-icon emoji-visible">⚠️</span>
                      <div>
                        <div className="info-text">Deposit Required</div>
                        <small>Booking requires a deposit to lock the slot within 6 hours. If not, the slot will be released.</small>
                      </div>
                    </div>
                  </div>

                  <div className="info-card info">
                    <div className="info-content">
                      <span className="info-icon emoji-visible">ℹ️</span>
                      <div>
                        <div className="info-text">Advance Booking</div>
                        <small>Bookings must be made at least 2 days in advance.</small>
                      </div>
                    </div>
                  </div>

                  {/* Waitlist Section */}
                  {timeSlots.every(time => slotStatus[time]?.status === "booked") && (
                    <div className="info-card warning">
                      <div className="info-content">
                        <span className="info-icon emoji-visible">⏰</span>
                        <div>
                          <div className="info-text">All Slots Booked</div>
                          <small>All time slots are fully booked for this date. Please choose another date or join the waitlist.</small>
                        </div>
                      </div>
                      <Button
                        variant="warning"
                        className="enhanced-btn enhanced-btn-warning mt-3"
                        onClick={handleWaitlistOpen}
                        aria-label="Join Waitlist"
                      >
                        <span className="btn-icon emoji-visible">📝</span>
                        Join Waitlist
                      </Button>
                    </div>
                  )}

                  {allSlotsFullyBooked && nextAvailableDate && (
                    <div className="info-card info">
                      <div className="info-content">
                        <span className="info-icon emoji-visible">📅</span>
                        <div>
                          <div className="info-text">Next Available Date</div>
                          <small>{nextAvailableDate.toLocaleDateString()}</small>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </Container>

      {/* Booking Confirmation Modal */}
      {showModal && (
        <Suspense fallback={<Spinner animation="border" />}>
          <BookingModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={(e) => {
              setShowModal(false);
              handleSubmit(e);
            }}
            selectedDate={selectedDate}
            formData={formData}
          />
        </Suspense>
      )}
      
      {/* Missing Fields Modal */}
      {showMissingFieldsModal && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="modal-content"
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "15px",
              minWidth: "320px",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
              margin: "1rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
              <h3 style={{ color: "#dc3545", marginBottom: "0.5rem" }}>Missing Required Fields</h3>
              <p style={{ color: "#6c757d", margin: "0" }}>
                Please complete all required fields to proceed with your booking.
              </p>
            </div>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <h5 style={{ color: "#495057", marginBottom: "1rem" }}>Please complete:</h5>
              <ul style={{ 
                listStyle: "none", 
                padding: "1rem", 
                margin: "0",
                background: "#f8f9fa",
                borderRadius: "8px"
              }}>
                {getMissingFields().map((field, index) => (
                  <li key={index} style={{ 
                    padding: "0.5rem 0", 
                    borderBottom: index < getMissingFields().length - 1 ? "1px solid #dee2e6" : "none",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <span style={{ color: "#dc3545", marginRight: "0.5rem" }}>•</span>
                    <span style={{ color: "#495057" }}>{field}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <Button
                variant="primary"
                onClick={() => setShowMissingFieldsModal(false)}
                style={{
                  background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                  border: "none",
                  borderRadius: "25px",
                  padding: "0.75rem 2rem",
                  fontWeight: "600",
                  boxShadow: "0 4px 15px rgba(0,123,255,0.3)",
                }}
              >
                <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>✏️</span>
                Continue Filling Form
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Waitlist Modal */}
      {showWaitlistModal && (
        <Suspense fallback={<Spinner animation="border" />}>
          <WaitlistModal
            show={showWaitlistModal}
            onClose={() => setShowWaitlistModal(false)}
            onSubmit={handleWaitlistSubmit}
            waitlistData={waitlistData}
            setWaitlistData={setWaitlistData}
            loading={loading}
            waitlistMessage={waitlistMessage}
            waitlistVariant={waitlistVariant}
            timeSlots={timeSlots}
          />
        </Suspense>
      )}
      {/* Waitlist feedback */}
      {waitlistMessage && !showWaitlistModal && (
        <Alert variant={waitlistVariant} className="enhanced-alert mt-3" aria-live="polite">
          <span className="alert-icon emoji-visible">
            {waitlistVariant === 'success' ? '✅' : '⚠️'}
          </span>
          {waitlistMessage}
        </Alert>
      )}
    </div>
  );
};

const TimeSlotStatus = React.memo(({ timeSlots, slotStatus, selectedTime }) => (
  <div className="slot-status-container">
    {timeSlots.map(time => (
      <div 
        key={time} 
        className={`slot-status-item ${selectedTime === time ? 'selected' : ''}`}
      >
        <div
          className="slot-status-dot"
          style={{
            background: slotStatusColor(slotStatus[time]?.status),
          }}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{time}</div>
          <div style={{ 
            fontSize: '0.8rem', 
            color: slotStatusColor(slotStatus[time]?.status),
            fontWeight: 500 
          }}>
            {slotStatus[time]?.status === "available" && "Available"}
            {slotStatus[time]?.status === "waiting" && "Waiting List"}
            {slotStatus[time]?.status === "booked" && "Booked"}
          </div>
        </div>
      </div>
    ))}
  </div>
));

export default OrderServices;

