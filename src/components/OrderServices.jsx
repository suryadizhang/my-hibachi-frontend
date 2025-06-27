import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const timeSlots = ['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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

  const [selectedDate, setSelectedDate] = useState(minSelectableDate);
  const [slotStatus, setSlotStatus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
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
    if (selectedDate && !isDateAllowed(selectedDate)) {
      setSelectedDate(minSelectableDate);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isDateAllowed(selectedDate)) return;
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
        } catch {
          setSlotStatus({});
        }
        setCalendarLoading(false);
      };
      fetchAvailability();
    }, 300); // 300ms debounce
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDateAllowed(selectedDate)) {
      setVariant('danger');
      setMessage('You must book at least 2 days in advance.');
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
      setLoading(false);
    }
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
      await axios.post(`${API_BASE}/api/booking/waitlist`, waitlistData);
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

  // Disable booking button if any required field is empty or invalid
  const isBookingDisabled = () =>
    !formData.name ||
    !formData.phone ||
    !isPhoneValid(formData.phone) ||
    !formData.email ||
    !formData.address ||
    !formData.city ||
    !formData.zipcode ||
    !isZipValid(formData.zipcode) ||
    !formData.timeSlot ||
    !formData.contactPreference ||
    slotStatus[formData.timeSlot]?.status === "booked" ||
    !isDateAllowed(selectedDate) ||
    loading;

  // Highlight selected time slot in the dropdown and slot status
  const isSelectedTime = (time) => formData.timeSlot === time;

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showModal || showWaitlistModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showModal, showWaitlistModal]);

  // Keyboard ESC support for modals
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (showModal) setShowModal(false);
        if (showWaitlistModal) setShowWaitlistModal(false);
      }
    };
    if (showModal || showWaitlistModal) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal, showWaitlistModal]);

  return (
    <Card className="p-4 shadow" style={{ maxWidth: 900, margin: "40px auto", borderRadius: 18 }}>
      <h2 className="mb-4 text-center" style={{ color: "#FFD700", fontWeight: "bold" }}>Order & Book a Service</h2>
      <div className="container">
        <div className="row">
          {/* Calendar Section */}
          <div className="col-12 col-md-6 mb-4">
            <div className="mb-2 fw-bold">Select Date:</div>
            <div style={{ minHeight: 340, position: "relative" }}>
              {calendarLoading && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                  background: "rgba(255,255,255,0.7)", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Spinner animation="border" />
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
            <div className="mt-3">
              <span className="badge" style={{ background: "#28a745", color: "#fff", marginRight: 8 }}>Available</span>
              <span className="badge" style={{ background: "#ffc107", color: "#222", marginRight: 8 }}>Waiting List</span>
              <span className="badge" style={{ background: "#dc3545", color: "#fff", marginRight: 8 }}>Booked</span>
              <span className="badge" style={{ background: "#0056b3", color: "#fff" }}>Selected</span>
            </div>
          </div>
          {/* Booking Form Section */}
          <div className="col-12 col-md-6">
            {message && <Alert variant={variant} aria-live="polite">{message}</Alert>}
            <Form onSubmit={handleSubmit} aria-label="Booking form">
              <Form.Group className="mb-2">
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control id="name" type="text" required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="phone">Phone</Form.Label>
                <Form.Control id="phone" type="tel" required pattern="[0-9]{10,15}"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  isInvalid={formData.phone && !isPhoneValid(formData.phone)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid phone number (10-15 digits).
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control id="email" type="email" required value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="address">Address</Form.Label>
                <Form.Control
                  id="address"
                  type="text"
                  required
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="city">City</Form.Label>
                <Form.Control
                  id="city"
                  type="text"
                  required
                  placeholder="City"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="zipcode">Zip Code</Form.Label>
                <Form.Control
                  id="zipcode"
                  type="text"
                  required
                  placeholder="Zip Code"
                  value={formData.zipcode}
                  onChange={e => setFormData({ ...formData, zipcode: e.target.value })}
                  isInvalid={formData.zipcode && !isZipValid(formData.zipcode)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid zip code (4-10 digits).
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="contactPreference">Contact Preference</Form.Label>
                <Form.Select id="contactPreference" required
                  value={formData.contactPreference}
                  onChange={e => setFormData({ ...formData, contactPreference: e.target.value })}
                >
                  <option value="" disabled>Choose your preference</option>
                  <option value="text">Text</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="timeSlot">Time Slot</Form.Label>
                <Form.Select id="timeSlot" required value={formData.timeSlot}
                  onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}>
                  <option value="">Select a time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}
                      disabled={slotStatus[time]?.status === "booked"}
                      style={isSelectedTime(time) ? { background: "#0056b3", color: "#fff" } : {}}
                    >
                      {time}
                      {slotStatus[time]?.status === "available" && " (Available)"}
                      {slotStatus[time]?.status === "waiting" && " (Waiting List)"}
                      {slotStatus[time]?.status === "booked" && " (Booked)"}
                    </option>
                  ))}
                </Form.Select>
                <TimeSlotStatus timeSlots={timeSlots} slotStatus={slotStatus} selectedTime={formData.timeSlot} />
              </Form.Group>
              <Button
                type="button"
                aria-label="Submit Booking"
                disabled={isBookingDisabled()}
                onClick={() => setShowModal(true)}
                style={{ minWidth: 140 }}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Submit Booking"}
              </Button>
            </Form>
            <div className="mt-3 text-warning" style={{ fontWeight: "bold" }}>
              Booking requires a deposit to lock the slot within 6 hours. If not, the slot will be released.
            </div>
            <div className="mt-2 text-muted" style={{ fontSize: "0.95em" }}>
              * Bookings must be made at least 2 days in advance.
            </div>
            {timeSlots.every(time => slotStatus[time]?.status === "booked") && (
              <div className="mt-3">
                <Button
                  variant="warning"
                  aria-label="Join Waitlist"
                  onClick={handleWaitlistOpen}
                  style={{ minWidth: 140 }}
                >
                  Join Waitlist
                </Button>
                <div style={{ color: 'red', marginTop: '8px' }}>
                  All time slots are fully booked for this date. Please choose another date or join the waitlist.
                </div>
              </div>
            )}
            {allSlotsFullyBooked && nextAvailableDate && (
              <div style={{ color: 'blue', marginTop: '8px' }}>
                Next available date: {nextAvailableDate.toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
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
        <Alert variant={waitlistVariant} className="mt-3" aria-live="polite">
          {waitlistMessage}
        </Alert>
      )}
    </Card>
  );
};

const TimeSlotStatus = React.memo(({ timeSlots, slotStatus, selectedTime }) => (
  <div className="mt-2">
    {timeSlots.map(time => (
      <span key={time} style={{ marginRight: 12 }}>
        <span
          className="slot-status-dot"
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: slotStatusColor(slotStatus[time]?.status),
            marginRight: 4,
            border: selectedTime === time ? "2px solid #0056b3" : "none"
          }}
        />
        {time}:
        <span style={{
          color: slotStatusColor(slotStatus[time]?.status),
          fontWeight: selectedTime === time ? 700 : 500,
          marginLeft: 4,
          textDecoration: selectedTime === time ? "underline" : "none"
        }}>
          {slotStatus[time]?.status === "available" && "Available"}
          {slotStatus[time]?.status === "waiting" && "Waiting List"}
          {slotStatus[time]?.status === "booked" && "Booked"}
        </span>
      </span>
    ))}
  </div>
));

export default OrderServices;

