import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container, Card, Row, Col, Nav, Tab, Form, Table, Pagination, Modal, Alert, Badge } from "react-bootstrap";
import { API_BASE } from '../config/api-simple';
import AdminConfirmationModal from './AdminConfirmationModal';
import NewsletterManager from './NewsletterManager';
import LogPanel from './LogPanel';
import SuperAdminManager from './SuperAdminManager';
import './AdminPanel.css';

function AdminPanel() {
  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mode, setMode] = useState("upcoming");
  const [date, setDate] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState({ 
    total_bookings: 0, 
    bookings_this_week: 0, 
    bookings_this_month: 0, 
    waitlist_count: 0 
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("admin");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Modal state
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    actionType: "warning",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    requiresReason: false,
    reasonPlaceholder: "",
    bookingDetails: null,
    onConfirm: () => {},
    isLoading: false
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const pageSize = 10;

  // CRITICAL FIX: Define fetchCurrentUser BEFORE using it in useEffect
  const fetchCurrentUser = useCallback(async () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.sub || 'Admin');
      setUserRole(payload.role || 'admin');
    } catch {
      setUsername('Admin');
      setUserRole('admin');
    }
  }, [token]);

  // Authentication check
  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    fetchCurrentUser();
  }, [token, navigate, fetchCurrentUser]);

  // Fetch KPIs
  const fetchKPIs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/booking/admin/kpis`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKpis(response.data);
    } catch (error) {
      console.error("Error fetching KPIs:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch upcoming bookings
  const fetchUpcoming = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/booking/admin/upcoming`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      setError("Failed to load upcoming bookings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch all bookings
  const fetchAllBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/booking/admin/all-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      setError("Failed to load all bookings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch waitlist
  const fetchWaitlist = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/booking/admin/waitlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      setError("Failed to load waitlist");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch weekly bookings
  const fetchWeekly = async () => {
    if (!date) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/booking/admin/weekly?start_date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching weekly bookings:", error);
      setError("Failed to load weekly bookings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch monthly bookings
  const fetchMonthly = async () => {
    if (!year || !month) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/booking/admin/monthly?year=${year}&month=${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching monthly bookings:", error);
      setError("Failed to load monthly bookings");
    } finally {
      setLoading(false);
    }
  };

  // KPI click handlers
  const handleThisWeekClick = async () => {
    setMode("weekly");
    setActiveTab("bookings");
    const now = new Date();
    const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    const mondayStr = monday.toISOString().split('T')[0];
    setDate(mondayStr);
    
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/booking/admin/weekly?start_date=${mondayStr}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
      setPage(1);
    } catch (e) {
      setError("Error loading current week data: " + (e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleThisMonthClick = async () => {
    setMode("monthly");
    setActiveTab("bookings");
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString();
    setYear(currentYear);
    setMonth(currentMonth);
    
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/booking/admin/monthly?year=${currentYear}&month=${currentMonth}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
      setPage(1);
    } catch (e) {
      setError("Error loading current month data: " + (e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleTotalBookingsClick = async () => {
    setMode("total");
    setActiveTab("bookings");
    await fetchAllBookings();
  };

  const handleWaitlistClick = async () => {
    setMode("waitlist");
    setActiveTab("bookings");
    await fetchWaitlist();
  };

  // Load initial data
  useEffect(() => {
    if (token) {
      fetchKPIs();
      if (activeTab === "bookings" && mode === "upcoming") {
        fetchUpcoming();
      }
    }
  }, [token, fetchKPIs, fetchUpcoming, activeTab, mode]);

  // Booking actions
  const deleteBooking = async (bookingId) => {
    try {
      await axios.delete(`${API_BASE}/api/booking/admin/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh current view
      if (mode === "upcoming") fetchUpcoming();
      else if (mode === "total") fetchAllBookings();
      else if (mode === "waitlist") fetchWaitlist();
      else if (mode === "weekly") fetchWeekly();
      else if (mode === "monthly") fetchMonthly();
      
      // Refresh KPIs
      fetchKPIs();
    } catch (error) {
      setError("Failed to delete booking: " + (error.response?.data?.detail || error.message));
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`${API_BASE}/api/booking/admin/bookings/${bookingId}/status`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh current view
      if (mode === "upcoming") fetchUpcoming();
      else if (mode === "total") fetchAllBookings();
      fetchKPIs();
    } catch (error) {
      setError("Failed to update booking status: " + (error.response?.data?.detail || error.message));
    }
  };

  // Pagination
  const totalPages = Math.ceil(bookings.length / pageSize);
  const paginatedBookings = bookings.slice((page - 1) * pageSize, page * pageSize);

  // Search filter
  const filteredBookings = paginatedBookings.filter(booking => 
    booking.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    booking.email?.toLowerCase().includes(search.toLowerCase()) ||
    booking.phone?.includes(search)
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!token) {
    return (
      <div className="text-center mt-5">
        <h3>Redirecting to login...</h3>
      </div>
    );
  }

  return (
    <Container fluid className="admin-panel">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>🍱 My Hibachi Chef - Admin Dashboard</h1>
        <div>
          <span className="me-3">Welcome, <strong>{username}</strong> ({userRole})</span>
          <Button 
            variant="outline-secondary" 
            size="sm"
            className="me-2"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </Button>
          <Button 
            variant="outline-danger" 
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/admin-login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="pills" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="dashboard">📊 Dashboard</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="bookings">📅 Bookings</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="newsletter">📧 Newsletter</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="logs">📋 Logs</Nav.Link>
          </Nav.Item>
          {userRole === "superadmin" && (
            <Nav.Item>
              <Nav.Link eventKey="admin-management">👥 Admin Management</Nav.Link>
            </Nav.Item>
          )}
        </Nav>

        <Tab.Content>
          {/* Dashboard Tab */}
          <Tab.Pane eventKey="dashboard">
            <Row className="mb-4">
              <Col md={3}>
                <Card 
                  className="text-center kpi-card cursor-pointer" 
                  onClick={handleTotalBookingsClick}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <h5 className="card-title">📋 Total Bookings</h5>
                    <h2 className="text-primary">{kpis.total_bookings || 0}</h2>
                    <small className="text-muted">Click to view all</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card 
                  className="text-center kpi-card cursor-pointer" 
                  onClick={handleThisWeekClick}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <h5 className="card-title">📅 This Week</h5>
                    <h2 className="text-success">{kpis.bookings_this_week || 0}</h2>
                    <small className="text-muted">Click to view details</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card 
                  className="text-center kpi-card cursor-pointer" 
                  onClick={handleThisMonthClick}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <h5 className="card-title">📆 This Month</h5>
                    <h2 className="text-info">{kpis.bookings_this_month || 0}</h2>
                    <small className="text-muted">Click to view details</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card 
                  className="text-center kpi-card cursor-pointer" 
                  onClick={handleWaitlistClick}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <h5 className="card-title">⏳ Waitlist</h5>
                    <h2 className="text-warning">{kpis.waitlist_count || 0}</h2>
                    <small className="text-muted">Click to view waitlist</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Quick Actions */}
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <h5>🚀 Quick Actions</h5>
                  </Card.Header>
                  <Card.Body>
                    <Button 
                      variant="primary" 
                      className="me-2 mb-2"
                      onClick={() => {
                        setActiveTab("bookings");
                        setMode("upcoming");
                        fetchUpcoming();
                      }}
                    >
                      📅 View Upcoming Bookings
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="me-2 mb-2"
                      onClick={() => {
                        setActiveTab("bookings");
                        setMode("waitlist");
                        fetchWaitlist();
                      }}
                    >
                      ⏳ Manage Waitlist
                    </Button>
                    <Button 
                      variant="info" 
                      className="me-2 mb-2"
                      onClick={() => setActiveTab("newsletter")}
                    >
                      📧 Newsletter Management
                    </Button>
                    <Button 
                      variant="dark" 
                      className="me-2 mb-2"
                      onClick={() => setActiveTab("logs")}
                    >
                      📋 View System Logs
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Bookings Tab */}
          <Tab.Pane eventKey="bookings">
            <Row className="mb-3">
              <Col md={6}>
                <Form.Select 
                  value={mode} 
                  onChange={(e) => {
                    setMode(e.target.value);
                    setPage(1);
                    if (e.target.value === "upcoming") fetchUpcoming();
                    else if (e.target.value === "total") fetchAllBookings();
                    else if (e.target.value === "waitlist") fetchWaitlist();
                  }}
                >
                  <option value="upcoming">📅 Upcoming Bookings</option>
                  <option value="total">📋 All Bookings</option>
                  <option value="weekly">📅 Weekly View</option>
                  <option value="monthly">📆 Monthly View</option>
                  <option value="waitlist">⏳ Waitlist</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="🔍 Search by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>
            </Row>

            {/* Date filters for weekly/monthly */}
            {mode === "weekly" && (
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Col>
                <Col md={2}>
                  <Button onClick={fetchWeekly} disabled={!date}>
                    Load Week
                  </Button>
                </Col>
              </Row>
            )}

            {mode === "monthly" && (
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
                    {[2024, 2025, 2026].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={i+1}>
                        {new Date(2024, i).toLocaleString('en-US', { month: 'long' })}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button onClick={fetchMonthly}>
                    Load Month
                  </Button>
                </Col>
              </Row>
            )}

            {/* Bookings Table */}
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
                <div>Loading bookings...</div>
              </div>
            ) : (
              <>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Guests</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{formatDate(booking.date || booking.event_date || booking.preferred_date)}</td>
                        <td>{booking.time_slot || booking.preferred_time || 'N/A'}</td>
                        <td>
                          <strong>{booking.customer_name}</strong>
                          {booking.special_requests && (
                            <div><small className="text-muted">📝 {booking.special_requests}</small></div>
                          )}
                        </td>
                        <td>
                          <div>{booking.email}</div>
                          <div><small>{booking.phone}</small></div>
                        </td>
                        <td>{booking.guest_count || booking.party_size || 'N/A'}</td>
                        <td>{formatCurrency(booking.total_amount)}</td>
                        <td>
                          <Badge bg={
                            booking.status === 'confirmed' ? 'success' :
                            booking.status === 'pending' ? 'warning' :
                            booking.status === 'cancelled' ? 'danger' : 'secondary'
                          }>
                            {booking.status || 'pending'}
                          </Badge>
                        </td>
                        <td>
                          <div className="btn-group">
                            {booking.status !== 'confirmed' && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              >
                                ✅ Confirm
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this booking?')) {
                                  deleteBooking(booking.id);
                                }
                              }}
                            >
                              🗑️ Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center">
                    <Pagination>
                      <Pagination.Prev 
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      />
                      {Array.from({length: totalPages}, (_, i) => (
                        <Pagination.Item
                          key={i + 1}
                          active={i + 1 === page}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next 
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                      />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Tab.Pane>

          {/* Newsletter Tab */}
          <Tab.Pane eventKey="newsletter">
            <NewsletterManager />
          </Tab.Pane>

          {/* Logs Tab */}
          <Tab.Pane eventKey="logs">
            <LogPanel />
          </Tab.Pane>

          {/* Admin Management Tab */}
          {userRole === "superadmin" && (
            <Tab.Pane eventKey="admin-management">
              <SuperAdminManager />
            </Tab.Pane>
          )}
        </Tab.Content>
      </Tab.Container>

      {/* Password Change Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            Update Password
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <AdminConfirmationModal {...confirmModal} />
    </Container>
  );
}

export default AdminPanel;
