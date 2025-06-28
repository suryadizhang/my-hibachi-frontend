import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container } from "react-bootstrap";
import { API_BASE } from '../config/api';
import './AdminPanel.css';

function AdminPanel() {
  const [mode, setMode] = useState("weekly");
  const [date, setDate] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
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
    if (!date) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/api/booking/admin/weekly?start_date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (e) {
      setError(
        e.response?.status === 401
          ? "Session expired. Please log in again."
          : e.response?.data?.detail || "Error fetching weekly data."
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
    if (!year || !month) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/api/booking/admin/monthly?year=${year}&month=${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (e) {
      setError(
        e.response?.status === 401
          ? "Session expired. Please log in again."
          : e.response?.data?.detail || "Error fetching monthly data."
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
        const res = await axios.get(`${API_BASE}/api/booking/admin/kpis`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setKpis(res.data);
      } catch {
        // fallback: compute from bookings if endpoint not available
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        setKpis({
          total: bookings.length,
          week: bookings.filter(b => new Date(b.date) >= startOfWeek).length,
          month: bookings.filter(b => new Date(b.date) >= startOfMonth).length,
          waitlist: 0 // add waitlist logic if available
        });
      }
    };
    if (token) fetchKpis();
    // eslint-disable-next-line
  }, [bookings, token]);

  const filteredBookings = bookings.filter(b => {
    const searchTerm = search.toLowerCase();
    return (
      (b.name && b.name.toLowerCase().includes(searchTerm)) ||
      (b.phone && b.phone.includes(search)) ||
      (b.email && b.email.toLowerCase().includes(searchTerm)) ||
      (b.date && b.date.includes(search))
    );
  });

  const totalPages = Math.ceil(filteredBookings.length / pageSize);
  const paginatedBookings = filteredBookings.slice((page - 1) * pageSize, page * pageSize);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="admin-panel-container">
      {/* Enhanced Header */}
      <div className="admin-header">
        <Container>
          <div className="admin-header-content d-flex justify-content-between align-items-center">
            <div>
              <h1 className="admin-header-title">
                <span className="admin-header-icon emoji-visible">📊</span>
                Admin Dashboard
              </h1>
              <p className="admin-header-subtitle">
                Booking Management & Analytics Portal
              </p>
            </div>
            <Button 
              className="admin-logout-btn"
              onClick={handleLogout}
              aria-label="Logout from admin panel"
            >
              <span className="emoji-visible">🚪</span>
              Logout
            </Button>
          </div>
        </Container>
      </div>

      <div className="admin-content">
        {/* Mode Toggle */}
        <div className="mode-toggle-container">
          <h3 className="mode-toggle-title">
            <span className="emoji-visible">📅</span>
            View Mode
          </h3>
          <div>
            <Button
              className={`mode-btn ${mode === "weekly" ? "active" : ""}`}
              onClick={() => setMode("weekly")}
            >
              <span className="emoji-visible">📅</span>
              Weekly View
            </Button>
            <Button
              className={`mode-btn ${mode === "monthly" ? "active" : ""}`}
              onClick={() => setMode("monthly")}
            >
              <span className="emoji-visible">📆</span>
              Monthly View
            </Button>
          </div>
        </div>

        {/* Filter Form */}
        <div className="filter-form-container" style={{ position: "relative" }}>
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner-large"></div>
            </div>
          )}
          
          <h3 className="filter-form-title">
            <span className="emoji-visible">🔍</span>
            Filter Bookings
          </h3>
          
          {mode === "weekly" && (
            <div className="filter-form">
              <div className="filter-form-group">
                <label className="filter-form-label" htmlFor="weekDate">
                  <span className="emoji-visible">📅</span>
                  Week Start Date (Monday)
                </label>
                <input
                  id="weekDate"
                  type="date"
                  className="filter-form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <Button 
                className="fetch-btn"
                onClick={fetchWeekly} 
                disabled={loading || !date}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    Loading...
                  </>
                ) : (
                  <>
                    <span className="emoji-visible">🔄</span>
                    Fetch Weekly Data
                  </>
                )}
              </Button>
            </div>
          )}
          
          {mode === "monthly" && (
            <div className="filter-form">
              <div className="filter-form-group">
                <label className="filter-form-label" htmlFor="monthYear">
                  <span className="emoji-visible">📅</span>
                  Year
                </label>
                <input
                  id="monthYear"
                  type="number"
                  className="filter-form-input"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2020"
                  max="2100"
                  placeholder="Enter year"
                />
              </div>
              <div className="filter-form-group">
                <label className="filter-form-label" htmlFor="monthMonth">
                  <span className="emoji-visible">📆</span>
                  Month
                </label>
                <select
                  id="monthMonth"
                  className="filter-form-input"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <Button 
                className="fetch-btn"
                onClick={fetchMonthly} 
                disabled={loading || !year || !month}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    Loading...
                  </>
                ) : (
                  <>
                    <span className="emoji-visible">🔄</span>
                    Fetch Monthly Data
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="admin-alert danger" role="alert">
            <span className="emoji-visible">❌</span>
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <div className="kpi-container">
          <div className="kpi-card primary">
            <div className="kpi-icon emoji-visible">📊</div>
            <div className="kpi-value">{kpis.total}</div>
            <div className="kpi-label">Total Bookings</div>
          </div>
          <div className="kpi-card success">
            <div className="kpi-icon emoji-visible">📅</div>
            <div className="kpi-value">{kpis.week}</div>
            <div className="kpi-label">This Week</div>
          </div>
          <div className="kpi-card warning">
            <div className="kpi-icon emoji-visible">📆</div>
            <div className="kpi-value">{kpis.month}</div>
            <div className="kpi-label">This Month</div>
          </div>
          <div className="kpi-card danger">
            <div className="kpi-icon emoji-visible">⏳</div>
            <div className="kpi-value">{kpis.waitlist}</div>
            <div className="kpi-label">Waitlist</div>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">
              <span className="emoji-visible">📋</span>
              Booking Records ({filteredBookings.length})
            </h3>
            <div className="search-container">
              <span className="search-icon emoji-visible">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, phone, email, or date..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search bookings"
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="enhanced-table">
              <thead>
                <tr>
                  <th>📅 Date</th>
                  <th>⏰ Time</th>
                  <th>👤 Name</th>
                  <th>📞 Phone</th>
                  <th>✉️ Email</th>
                  <th>🏠 Address</th>
                  <th>📱 Contact Pref</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={7} className="no-bookings">
                      <div className="no-bookings-icon emoji-visible">📭</div>
                      <div>No bookings found.</div>
                      <small>Try adjusting your search or date filters.</small>
                    </td>
                  </tr>
                ) : (
                  paginatedBookings.map((b, index) => (
                    <tr key={b.id + b.date + index}>
                      <td>{formatDate(b.date)}</td>
                      <td>{b.time_slot}</td>
                      <td>{b.name}</td>
                      <td>{formatPhone(b.phone)}</td>
                      <td>{b.email}</td>
                      <td>{`${b.address}, ${b.city} ${b.zipcode}`}</td>
                      <td>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '6px', 
                          fontSize: '0.85rem',
                          background: b.contact_preference === 'email' ? '#e0f2fe' : 
                                    b.contact_preference === 'call' ? '#f3e8ff' : '#ecfdf5',
                          color: b.contact_preference === 'email' ? '#0369a1' : 
                                b.contact_preference === 'call' ? '#7c3aed' : '#059669'
                        }}>
                          {b.contact_preference === 'email' && '✉️ Email'}
                          {b.contact_preference === 'call' && '📞 Call'}
                          {b.contact_preference === 'text' && '📱 Text'}
                          {!['email', 'call', 'text'].includes(b.contact_preference) && b.contact_preference}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <Button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <span className="emoji-visible">⬅️</span>
                Previous
              </Button>
              
              <div className="pagination-info">
                Page {page} of {totalPages}
              </div>
              
              <Button
                className="pagination-btn"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
              >
                Next
                <span className="emoji-visible">➡️</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
