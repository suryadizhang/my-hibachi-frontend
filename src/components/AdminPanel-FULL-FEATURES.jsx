import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container, Nav, Tab, Table, Form, Modal, Alert, Card, Row, Col } from "react-bootstrap";
import { API_BASE } from '../config/api-simple';
import AdminConfirmationModal from './AdminConfirmationModal';
import NewsletterManager from './NewsletterManager';
import LogPanel from './LogPanel';
import SuperAdminManager from './SuperAdminManager';
import './AdminPanel.css';

function AdminPanel() {
  // All state variables from original
  const [activeTab, setActiveTab] = useState("bookings");
  const [mode, setMode] = useState("upcoming");
  const [date, setDate] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState({ total_bookings: 0, bookings_this_week: 0, bookings_this_month: 0, waitlist_count: 0 });
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
      const response = await axios.get(`${API_BASE}/api/booking/admin/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.username) {
        setUsername(response.data.username);
        setUserRole(response.data.user_type || 'admin');
      }
    } catch (error) {
      console.log('Could not fetch current user info:', error.message);
    }
  }, [token]);

  // FIXED: useEffect with proper dependency ordering
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

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      let endpoint = `${API_BASE}/api/booking/admin/all-bookings`;
      
      if (mode === "weekly") {
        endpoint = `${API_BASE}/api/booking/admin/weekly-bookings`;
      } else if (mode === "monthly") {
        endpoint = `${API_BASE}/api/booking/admin/monthly-bookings`;
      } else if (mode === "waitlist") {
        endpoint = `${API_BASE}/api/booking/admin/waitlist`;
      } else if (mode === "specific-date" && date) {
        endpoint = `${API_BASE}/api/booking/admin/bookings-by-date?date=${date}`;
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookings(response.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(`Failed to load ${mode} data`);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [token, mode, date]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs]);

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab, fetchBookings]);

  // Password change handler
  const handlePasswordChange = async () => {
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError("New passwords don't match");
        return;
      }

      await axios.post(`${API_BASE}/api/booking/admin/change-password`, {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert("Password changed successfully!");
    } catch (error) {
      setError("Failed to change password");
    }
  };

  // Filtered bookings based on search
  const filteredBookings = bookings.filter(booking => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      booking.customer_name?.toLowerCase().includes(searchLower) ||
      booking.customer_email?.toLowerCase().includes(searchLower) ||
      booking.event_date?.includes(search) ||
      booking.location?.toLowerCase().includes(searchLower)
    );
  });

  // Paginated bookings
  const startIndex = (page - 1) * pageSize;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredBookings.length / pageSize);

  // Render loading state
  if (loading && bookings.length === 0) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="admin-panel">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Hibachi Chef Admin Dashboard</h1>
        <div>
          <span className="me-3">Welcome, {username || 'Admin'} ({userRole})</span>
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

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* KPIs Dashboard */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center kpi-card">
            <Card.Body>
              <Card.Title>Total Bookings</Card.Title>
              <h2 className="text-primary">{kpis.total_bookings || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center kpi-card">
            <Card.Body>
              <Card.Title>This Week</Card.Title>
              <h2 className="text-success">{kpis.bookings_this_week || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center kpi-card">
            <Card.Body>
              <Card.Title>This Month</Card.Title>
              <h2 className="text-info">{kpis.bookings_this_month || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center kpi-card">
            <Card.Body>
              <Card.Title>Waitlist</Card.Title>
              <h2 className="text-warning">{kpis.waitlist_count || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Tabs */}
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="bookings">Bookings Management</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="newsletter">Newsletter</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="logs">System Logs</Nav.Link>
          </Nav.Item>
          {userRole === 'superadmin' && (
            <Nav.Item>
              <Nav.Link eventKey="superadmin">Super Admin</Nav.Link>
            </Nav.Item>
          )}
        </Nav>

        <Tab.Content>
          {/* Bookings Tab */}
          <Tab.Pane eventKey="bookings">
            <Card>
              <Card.Header>
                <Row className="align-items-center">
                  <Col md={4}>
                    <h5>Bookings Management</h5>
                  </Col>
                  <Col md={8}>
                    <div className="d-flex gap-2">
                      <Form.Select 
                        value={mode} 
                        onChange={(e) => setMode(e.target.value)}
                        style={{ maxWidth: '200px' }}
                      >
                        <option value="upcoming">Upcoming Bookings</option>
                        <option value="weekly">This Week</option>
                        <option value="monthly">This Month</option>
                        <option value="total">All Bookings</option>
                        <option value="waitlist">Waitlist</option>
                        <option value="specific-date">Specific Date</option>
                      </Form.Select>
                      
                      {mode === "specific-date" && (
                        <Form.Control 
                          type="date" 
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          style={{ maxWidth: '150px' }}
                        />
                      )}
                      
                      <Form.Control 
                        type="text"
                        placeholder="Search bookings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ maxWidth: '200px' }}
                      />
                      
                      <Button variant="primary" onClick={fetchBookings}>
                        Refresh
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              
              <Card.Body>
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Email</th>
                          <th>Event Date</th>
                          <th>Location</th>
                          <th>Guests</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedBookings.length > 0 ? (
                          paginatedBookings.map((booking, index) => (
                            <tr key={booking.id || index}>
                              <td>{booking.customer_name || 'N/A'}</td>
                              <td>{booking.customer_email || 'N/A'}</td>
                              <td>{booking.event_date || booking.preferred_date || 'N/A'}</td>
                              <td>{booking.location || 'N/A'}</td>
                              <td>{booking.guest_count || booking.estimated_guests || 'N/A'}</td>
                              <td>${booking.total_amount || 'N/A'}</td>
                              <td>
                                <span className={`badge ${
                                  booking.status === 'confirmed' ? 'bg-success' :
                                  booking.status === 'pending' ? 'bg-warning' :
                                  booking.status === 'cancelled' ? 'bg-danger' :
                                  'bg-secondary'
                                }`}>
                                  {booking.status || 'pending'}
                                </span>
                              </td>
                              <td>
                                <Button variant="outline-primary" size="sm" className="me-1">
                                  View
                                </Button>
                                <Button variant="outline-success" size="sm" className="me-1">
                                  Edit
                                </Button>
                                <Button variant="outline-danger" size="sm">
                                  Cancel
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-4">
                              No bookings found for {mode}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-center mt-3">
                        <Button 
                          variant="outline-primary" 
                          disabled={page === 1}
                          onClick={() => setPage(page - 1)}
                          className="me-2"
                        >
                          Previous
                        </Button>
                        <span className="align-self-center mx-3">
                          Page {page} of {totalPages} ({filteredBookings.length} total)
                        </span>
                        <Button 
                          variant="outline-primary" 
                          disabled={page === totalPages}
                          onClick={() => setPage(page + 1)}
                          className="ms-2"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Newsletter Tab */}
          <Tab.Pane eventKey="newsletter">
            <NewsletterManager />
          </Tab.Pane>

          {/* Logs Tab */}
          <Tab.Pane eventKey="logs">
            <LogPanel />
          </Tab.Pane>

          {/* Super Admin Tab */}
          {userRole === 'superadmin' && (
            <Tab.Pane eventKey="superadmin">
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
          <Button variant="primary" onClick={handlePasswordChange}>
            Change Password
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <AdminConfirmationModal 
        show={confirmModal.show}
        onClose={() => setConfirmModal({...confirmModal, show: false})}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        actionType={confirmModal.actionType}
        confirmButtonText={confirmModal.confirmButtonText}
        cancelButtonText={confirmModal.cancelButtonText}
        requiresReason={confirmModal.requiresReason}
        reasonPlaceholder={confirmModal.reasonPlaceholder}
        bookingDetails={confirmModal.bookingDetails}
        isLoading={confirmModal.isLoading}
      />
    </Container>
  );
}

export default AdminPanel;
