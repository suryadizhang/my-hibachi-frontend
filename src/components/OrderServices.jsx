import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const timeSlots = ['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];
const API_BASE = 'http://localhost:8000/api/booking';

const OrderServices = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
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
    // Remove time part for both dates
    now.setHours(0,0,0,0);
    const minDate = new Date(now);
    minDate.setDate(now.getDate() + 2);
    return date >= minDate;
  };

  useEffect(() => {
    if (!isDateAllowed(selectedDate)) {
      // If somehow selectedDate is not allowed, reset to next allowed date
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
    // Extra safety: Prevent booking if date is not allowed
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
    } catch (err) {
      setVariant('danger');
      setMessage(err.response?.data?.detail || 'Booking failed.');
    }
  };

  // Calculate min selectable date (today + 2 days)
  const now = new Date();
  now.setHours(0,0,0,0);
  const minSelectableDate = new Date(now);
  minSelectableDate.setDate(now.getDate() + 2);

  return (
    <Card className="p-4">
      <h2>Order & Book a Service</h2>
      <Calendar
        value={selectedDate}
        onChange={setSelectedDate}
        className="my-3"
        minDate={minSelectableDate}
        tileDisabled={({ date }) => !isDateAllowed(date)}
      />
      {message && <Alert variant={variant}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" required value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="tel" required value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" required value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Contact Preference</Form.Label>
          <Form.Select
            required
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
          <Form.Label>Time Slot</Form.Label>
          <Form.Select required value={formData.timeSlot}
            onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}>
            <option value="">Select a time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}
                disabled={slotAvailability[time] >= 2}>
                {time} {slotAvailability[time] >= 2 ? "(Fully booked)" : ""}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button
          type="submit"
          disabled={
            !formData.timeSlot ||
            slotAvailability[formData.timeSlot] >= 2 ||
            !isDateAllowed(selectedDate)
          }
        >
          Submit Booking
        </Button>
      </Form>
      <div className="mt-2 text-muted" style={{ fontSize: "0.95em" }}>
        * Bookings must be made at least 2 days in advance.
      </div>
    </Card>
  );
};

export default OrderServices;