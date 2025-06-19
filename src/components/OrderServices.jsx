import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const timeSlots = ['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];
const API_BASE = 'http://localhost:8000/api/booking';

const OrderServices = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nextAvailableDate, setNextAvailableDate] = useState(null);

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
    timeSlot: '',
    contactPreference: ''
  });
  const [slotAvailability, setSlotAvailability] = useState({});
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState('success');

  // Helper: Check if date is at least 2 days in the future
  const isDateAllowed = (date) => {
    const now = new Date();
    now.setHours(0,0,0,0);
    const minDate = new Date(now);
    minDate.setDate(now.getDate() + 2);
    return date >= minDate;
  };

  useEffect(() => {
    if (!isDateAllowed(selectedDate)) {
      const now = new Date();
      now.setHours(0,0,0,0);
      const minDate = new Date(now);
      minDate.setDate(now.getDate() + 2);
      setSelectedDate(minDate);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      try {
        const res = await axios.get(`${API_BASE}/availability?date=${dateStr}`);
        setSlotAvailability(res.data);
      } catch {
        setSlotAvailability({});
      }
    };
    if (isDateAllowed(selectedDate)) {
      fetchAvailability();
    }
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDateAllowed(selectedDate)) {
      setVariant('danger');
      setMessage('You must book at least 2 days in advance.');
      return;
    }
    const payload = {
      ...formData,
      date: selectedDate.toISOString().split('T')[0],
      timeSlot: formData.timeSlot,
      contactPreference: formData.contactPreference,
    };
    try {
      await axios.post(`${API_BASE}/book`, payload);
      setVariant('success');
      setMessage('Booking submitted!');
      setFormData({ name: '', phone: '', email: '', address: '', timeSlot: '', contactPreference: '' });
      // Re-fetch slot availability after booking
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await axios.get(`${API_BASE}/availability?date=${dateStr}`);
      setSlotAvailability(res.data);
    } catch (err) {
      setVariant('danger');
      if (err.response?.data?.detail) {
        setMessage(
          typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : Array.isArray(err.response.data.detail)
            ? err.response.data.detail.map(d => d.msg).join(", ")
            : "Booking failed."
        );
      } else {
        setMessage('Booking failed. Please check your details and try again.');
      }
    }
  };

  // Calculate min selectable date (today + 2 days)
  const now = new Date();
  now.setHours(0,0,0,0);
  const minSelectableDate = new Date(now);
  minSelectableDate.setDate(now.getDate() + 2);

  const findNextAvailableDate = async (startDate) => {
    let date = new Date(startDate);
    for (let i = 0; i < 30; i++) {
      date.setDate(date.getDate() + 1);
      const dateStr = date.toISOString().split('T')[0];
      try {
        const res = await axios.get(`${API_BASE}/availability?date=${dateStr}`);
        if (Object.values(res.data).some(count => count < 2)) {
          return new Date(date);
        }
      } catch {
        // ignore errors and continue
      }
    }
    return null;
  };

  useEffect(() => {
    if (selectedDate && timeSlots.every(time => slotAvailability[time] >= 2)) {
      findNextAvailableDate(selectedDate).then(setNextAvailableDate);
    } else {
      setNextAvailableDate(null);
    }
    // eslint-disable-next-line
  }, [selectedDate, slotAvailability]);

  const allSlotsFullyBooked = nextAvailableDate && timeSlots.every(time => slotAvailability[time] >= 2);

  return (
    <Card className="p-4">
      <h2>Order & Book a Service</h2>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 mb-4">
            {/* Calendar */}
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              dayClassName={date => {
                const now = new Date();
                now.setHours(0,0,0,0);
                const minForPast = new Date(now);
                minForPast.setDate(now.getDate() + 2); // 2-day offset
                if (date < minForPast) return "past-day"; // Mark days before minForPast as past-day
                if (fullyBookedDates.some(d => d.toDateString() === date.toDateString()))
                  return "fully-booked-day";
                return "available-day";
              }}
              minDate={minSelectableDate} // Already set to +2 days
              excludeDates={fullyBookedDates}
            />
          </div>
          <div className="col-12 col-md-6">
            {/* Booking Form */}
            {message && <Alert variant={variant}>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control id="name" type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="phone">Phone</Form.Label>
                <Form.Control id="phone" type="tel" required value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control id="email" type="email" required value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="address">Address</Form.Label>
                <Form.Control id="address" type="text" required value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <label className="form-label" htmlFor="contactPreference">Contact Preference</label>
                <select id="contactPreference" className="form-select" required
                  value={formData.contactPreference}
                  onChange={e => setFormData({ ...formData, contactPreference: e.target.value })}
                >
                  <option value="" disabled>Choose your preference</option>
                  <option value="text">Text</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                </select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="timeSlot">Time Slot</Form.Label>
                <Form.Select id="timeSlot" required value={formData.timeSlot}
                  onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}>
                  <option value="">Select a time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}
                      disabled={slotAvailability[time] >= 2}>
                      {time}
                      {slotAvailability[time] === 0 && " (Available)"}
                      {slotAvailability[time] === 1 && " (1 left)"}
                      {slotAvailability[time] >= 2 && " (Fully booked)"}
                    </option>
                  ))}
                </Form.Select>
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
                          background:
                            slotAvailability[time] === 0 ? "#28a745" :
                            slotAvailability[time] === 1 ? "#ffc107" : "#dc3545",
                          marginRight: 4
                        }}
                      />
                      {time}:
                      <span style={{
                        color:
                          slotAvailability[time] === 0 ? "#28a745" :
                          slotAvailability[time] === 1 ? "#ffc107" : "#dc3545",
                        fontWeight: 500,
                        marginLeft: 4
                      }}>
                        {slotAvailability[time] === 0 && "Available"}
                        {slotAvailability[time] === 1 && "1 left"}
                        {slotAvailability[time] >= 2 && "Fully booked"}
                      </span>
                    </span>
                  ))}
                </div>
              </Form.Group>
              <Button
                type="button"
                disabled={
                  !formData.timeSlot ||
                  slotAvailability[formData.timeSlot] >= 2 ||
                  !isDateAllowed(selectedDate)
                }
                onClick={() => setShowModal(true)}
              >
                Submit Booking
              </Button>
            </Form>
            <div className="mt-2 text-muted" style={{ fontSize: "0.95em" }}>
              * Bookings must be made at least 2 days in advance.
            </div>
            {timeSlots.every(time => slotAvailability[time] >= 2) && (
              <div className="mt-3">
                <Button variant="warning" onClick={() => alert("You have been added to the waitlist!")}>
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
      {showModal && (
        <div className="modal-backdrop" style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="modal-content" style={{
            background: "#fff", padding: 24, borderRadius: 8, minWidth: 300, maxWidth: 400
          }}>
            <h4>Confirm Booking</h4>
            <p><b>Date:</b> {selectedDate?.toLocaleDateString()}</p>
            <p><b>Time:</b> {formData.timeSlot}</p>
            <p><b>Name:</b> {formData.name}</p>
            <Button variant="success" onClick={(e) => { setShowModal(false); handleSubmit(e); }}>
              Confirm
            </Button>
            <Button variant="secondary" className="ms-2" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OrderServices;

