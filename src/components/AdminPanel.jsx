import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Alert, Button, Table, Form } from "react-bootstrap";

const API_BASE = "http://localhost:8000/api/booking";

function AdminPanel() {
  const [mode, setMode] = useState("weekly");
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState({ total: 0, week: 0, month: 0, waitlist: 0 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const pageSize = 10;

  // Redirect to login if no token
  useEffect(() => {
    if (!token) navigate("/admin-login");
  }, [token, navigate]);

  const fetchWeekly = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/admin/weekly?start_date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (e) {
      setError(
        e.response?.status === 401
          ? "Session expired. Please log in again."
          : "Error fetching data."
      );
      if (e.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
      }
      setBookings([]);
    }
    setLoading(false);
  };

  const fetchMonthly = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/admin/monthly?year=${year}&month=${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (e) {
      setError(
        e.response?.status === 401
          ? "Session expired. Please log in again."
          : "Error fetching data."
      );
      if (e.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
      }
      setBookings([]);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  useEffect(() => {
    // Fetch KPIs from backend (create an endpoint or compute from bookings)
    const fetchKpis = async () => {
      try {
        const res = await axios.get(`${API_BASE}/admin/kpis`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setKpis(res.data);
      } catch {
        // fallback: compute from bookings if endpoint not available
        setKpis({
          total: bookings.length,
          week: bookings.filter(() => /* logic for this week */ true).length,
          month: bookings.filter(() => /* logic for this month */ true).length,
          waitlist: 0 // add waitlist logic if available
        });
      }
    };
    fetchKpis();
    // eslint-disable-next-line
  }, [bookings]);

  const filteredBookings = bookings.filter(b => {
    const searchTerm = search.toLowerCase();
    return (
      (b.name && b.name.toLowerCase().includes(searchTerm)) ||
      (b.phone && b.phone.includes(search)) ||
      (b.date && b.date.includes(search))
    );
  });

  const totalPages = Math.ceil(filteredBookings.length / pageSize);

  const paginatedBookings = filteredBookings.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Booking Panel</h2>
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className="mb-3">
        <Button
          variant={mode === "weekly" ? "primary" : "outline-primary"}
          className="me-2"
          onClick={() => setMode("weekly")}
        >
          Weekly
        </Button>
        <Button
          variant={mode === "monthly" ? "primary" : "outline-primary"}
          onClick={() => setMode("monthly")}
        >
          Monthly
        </Button>
      </div>
      {mode === "weekly" && (
        <Form className="mb-3 d-flex align-items-end">
          <Form.Group className="me-2">
            <Form.Label>Week Start (Monday):</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </Form.Group>
          <Button onClick={fetchWeekly} disabled={loading || !date}>
            {loading ? <Spinner size="sm" /> : "Fetch Weekly Bookings"}
          </Button>
        </Form>
      )}
      {mode === "monthly" && (
        <Form className="mb-3 d-flex align-items-end">
          <Form.Group className="me-2">
            <Form.Label>Year:</Form.Label>
            <Form.Control
              type="number"
              value={year}
              onChange={e => setYear(e.target.value)}
              min="2020"
              max="2100"
            />
          </Form.Group>
          <Form.Group className="me-2">
            <Form.Label>Month:</Form.Label>
            <Form.Control
              type="number"
              value={month}
              onChange={e => setMonth(e.target.value)}
              min="1"
              max="12"
            />
          </Form.Group>
          <Button onClick={fetchMonthly} disabled={loading || !year || !month}>
            {loading ? <Spinner size="sm" /> : "Fetch Monthly Bookings"}
          </Button>
        </Form>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <div className="p-3 bg-primary text-white rounded shadow text-center">
            <div style={{ fontSize: 22, fontWeight: 700 }}>{kpis.total}</div>
            <div>Total Bookings</div>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="p-3 bg-success text-white rounded shadow text-center">
            <div style={{ fontSize: 22, fontWeight: 700 }}>{kpis.week}</div>
            <div>This Week</div>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="p-3 bg-warning text-dark rounded shadow text-center">
            <div style={{ fontSize: 22, fontWeight: 700 }}>{kpis.month}</div>
            <div>This Month</div>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="p-3 bg-danger text-white rounded shadow text-center">
            <div style={{ fontSize: 22, fontWeight: 700 }}>{kpis.waitlist}</div>
            <div>Waitlist</div>
          </div>
        </div>
      </div>
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name, phone, or date..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300, display: "inline-block" }}
        />
      </Form>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Contact Preference</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBookings.length === 0 && !loading ? (
            <tr>
              <td colSpan={6} className="text-center">
                No bookings found.
              </td>
            </tr>
          ) : (
            paginatedBookings.map(b => (
              <tr key={b.id + b.date}>
                <td>{b.date}</td>
                <td>{b.time_slot}</td>
                <td>{b.name}</td>
                <td>{b.phone}</td>
                <td>{b.address}</td>
                <td>{b.contact_preference}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <div className="d-flex justify-content-center my-3">
        <Button
          variant="outline-secondary"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="me-2"
        >
          Prev
        </Button>
        <span style={{ lineHeight: "2.2em" }}>
          Page {page} of {totalPages || 1}
        </span>
        <Button
          variant="outline-secondary"
          size="sm"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="ms-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default AdminPanel;