import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Form, Button, Card } from 'react-bootstrap';

const OrderServices = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    timeSlot: ''
  });

  const timeSlots = ['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...formData, selectedDate });
    alert('Booking submitted!');
  };

  return (
    <Card className="p-4">
      <h2>Order & Book a Service</h2>
      <Calendar value={selectedDate} onChange={setSelectedDate} className="my-3" />
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="tel" required onChange={e => setFormData({ ...formData, phone: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required onChange={e => setFormData({ ...formData, email: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" required onChange={e => setFormData({ ...formData, address: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Time Slot</Form.Label>
          <Form.Select required onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}>
            <option value="">Select a time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button type="submit">Submit Booking</Button>
      </Form>
    </Card>
  );
};

export default OrderServices;
