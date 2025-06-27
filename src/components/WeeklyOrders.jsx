import React, { useState } from "react";
import axios from "axios";
import { Card, Table, Button, Form } from "react-bootstrap";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function WeeklyOrders() {
  const [monday, setMonday] = useState("");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    if (!monday) return;
    const res = await axios.get(`${API_BASE}/api/booking/weekly?start_date=${monday}`);
    setOrders(res.data);
  };

  return (
    <Card className="p-4 my-4">
      <h2>Weekly Orders</h2>
      <Form.Group>
        <Form.Label>Week Starting (Monday)</Form.Label>
        <Form.Control
          type="date"
          value={monday}
          onChange={e => setMonday(e.target.value)}
        />
      </Form.Group>
      <Button className="my-2" onClick={fetchOrders} disabled={!monday}>
        Show Orders
      </Button>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Contact Preference</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.date}</td>
              <td>{order.time_slot}</td>
              <td>{order.name}</td>
              <td>{order.phone}</td>
              <td>{order.address}</td>
              <td>{order.contact_preference}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

export default WeeklyOrders;