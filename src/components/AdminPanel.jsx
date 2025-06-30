import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container } from "react-bootstrap";
import { API_BASE } from '../config/api';
import AdminConfirmationModal from './AdminConfirmationModal';
import NewsletterManager from './NewsletterManager';
import LogPanel from './LogPanel';
import SuperAdminManager from './SuperAdminManager';
import './AdminPanel.css';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("bookings");
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

  // Redirect to login if no token
  useEffect(() => {
    if (!token) navigate("/admin-login");
    else fetchCurrentUser();
  }, [token, navigate]);

  const fetchCurrentUser = async () => {
    try {
      // Decode the token to get username and role
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.sub || 'Admin');
      setUserRole(payload.role || 'admin');
    } catch (error) {
      setUsername('Admin');
      setUserRole('admin');
    }
  };

  const fetchWeekly = async () => {
    if (!date) return;
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
      const res = await axios.get(`${API_BASE}/admin/monthly?year=${year}&month=${month}`, {
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
    setConfirmModal({
      show: true,
      title: "Confirm Logout",
      message: "Are you sure you want to logout from the admin panel?",
      actionType: "warning",
      confirmButtonText: "Logout",
      cancelButtonText: "Stay Logged In",
      requiresReason: false,
      onConfirm: () => {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
        setConfirmModal(prev => ({ ...prev, show: false }));
      }
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('current_password', passwordForm.currentPassword);
      formData.append('new_password', passwordForm.newPassword);

      await axios.post(`${API_BASE}/admin/change_password`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setError('');
      
      setConfirmModal({
        show: true,
        title: "Password Changed",
        message: "Your password has been successfully changed!",
        actionType: "success",
        confirmButtonText: "OK",
        requiresReason: false,
        onConfirm: () => {
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      });
    } catch (err) {
      setError("Failed to change password: " + (err.response?.data?.detail || err.message));
    }
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

  // Admin action handlers
  const handleCancelBooking = (booking) => {
    setConfirmModal({
      show: true,
      title: "Cancel Booking",
      message: "This will permanently cancel the booking and send a cancellation email to the customer.",
      actionType: "danger",
      confirmButtonText: "Cancel Booking",
      cancelButtonText: "Keep Booking",
      requiresReason: true,
      reasonPlaceholder: "Please provide a reason for canceling this booking (e.g., customer request, scheduling conflict, etc.)",
      bookingDetails: booking,
      onConfirm: async (reason) => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        
        try {
          await axios.delete(`${API_BASE}/admin/cancel_booking?booking_id=${booking.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: {
              reason: reason
            }
          });
          
          // Refresh the bookings list
          if (mode === "weekly") {
            await fetchWeekly();
          } else {
            await fetchMonthly();
          }
          
          setConfirmModal(prev => ({ ...prev, show: false, isLoading: false }));
          setError("");
          
          // Show success message
          setTimeout(() => {
            setError(""); // Clear any previous errors
          }, 100);
          
        } catch (e) {
          setConfirmModal(prev => ({ ...prev, isLoading: false }));
          setError(
            e.response?.status === 401
              ? "Session expired. Please log in again."
              : e.response?.data?.detail || "Error canceling booking. Please try again."
          );
          
          if (e.response?.status === 401) {
            localStorage.removeItem("adminToken");
            navigate("/admin-login");
          }
        }
      }
    });
  };

  const handleMarkDepositReceived = (booking) => {
    setConfirmModal({
      show: true,
      title: "Mark Deposit as Received",
      message: "This will mark the deposit as received for this booking. This action affects payment tracking.",
      actionType: "warning",
      confirmButtonText: "Mark as Received",
      cancelButtonText: "Cancel",
      requiresReason: false,
      bookingDetails: booking,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        
        try {
          await axios.post(`${API_BASE}/admin/confirm_deposit`, {
            booking_id: booking.id
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Refresh the bookings list
          if (mode === "weekly") {
            await fetchWeekly();
          } else {
            await fetchMonthly();
          }
          
          setConfirmModal(prev => ({ ...prev, show: false, isLoading: false }));
          setError("");
          
        } catch (e) {
          setConfirmModal(prev => ({ ...prev, isLoading: false }));
          setError(
            e.response?.status === 401
              ? "Session expired. Please log in again."
              : e.response?.data?.detail || "Error updating deposit status. Please try again."
          );
          
          if (e.response?.status === 401) {
            localStorage.removeItem("adminToken");
            navigate("/admin-login");
          }
        }
      }
    });
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
                Welcome, {username}! • Booking Management & Analytics Portal
              </p>
            </div>
            <div className="admin-header-buttons">
              <Button 
                className="admin-change-password-btn"
                onClick={() => setShowPasswordModal(true)}
                aria-label="Change password"
              >
                <span className="emoji-visible">🔑</span>
                Change Password
              </Button>
              <Button 
                className="admin-logout-btn"
                onClick={handleLogout}
                aria-label="Logout from admin panel"
              >
                <span className="emoji-visible">🚪</span>
                Logout
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <Container>
          <div className="tab-nav">
            <button 
              className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              <span className="emoji-visible">📋</span>
              Booking Management
            </button>
            <button 
              className={`tab-btn ${activeTab === "newsletter" ? "active" : ""}`}
              onClick={() => setActiveTab("newsletter")}
            >
              <span className="emoji-visible">📧</span>
              Newsletter Manager
            </button>
            <button 
              className={`tab-btn ${activeTab === "logs" ? "active" : ""}`}
              onClick={() => setActiveTab("logs")}
            >
              <span className="emoji-visible">📊</span>
              Activity Logs
            </button>
            {userRole === "superadmin" && (
              <button 
                className={`tab-btn ${activeTab === "superadmin" ? "active" : ""}`}
                onClick={() => setActiveTab("superadmin")}
              >
                <span className="emoji-visible">⚙️</span>
                Super Admin
              </button>
            )}
          </div>
        </Container>
      </div>

      <div className="admin-content">
        {/* Booking Management Tab */}
        {activeTab === "bookings" && (
          <>
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
                      <th>💰 Deposit</th>
                      <th>⚡ Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBookings.length === 0 && !loading ? (
                      <tr>
                        <td colSpan={9} className="no-bookings">
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
                          <td>
                            <span style={{ 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '6px', 
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              background: b.deposit_received ? '#d4edda' : '#f8d7da',
                              color: b.deposit_received ? '#155724' : '#721c24'
                            }}>
                              {b.deposit_received ? '✅ Received' : '⏳ Pending'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {!b.deposit_received && (
                                <Button
                                  size="sm"
                                  variant="outline-success"
                                  onClick={() => handleMarkDepositReceived(b)}
                                  style={{
                                    borderRadius: '15px',
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.75rem'
                                  }}
                                  title="Mark deposit as received"
                                >
                                  <span className="emoji-visible">💰</span>
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleCancelBooking(b)}
                                style={{
                                  borderRadius: '15px',
                                  fontSize: '0.75rem',
                                  padding: '0.25rem 0.75rem'
                                }}
                                title="Cancel booking"
                              >
                                <span className="emoji-visible">🗑️</span>
                              </Button>
                            </div>
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
          </>
        )}

        {/* Newsletter Management Tab */}
        {activeTab === "newsletter" && (
          <NewsletterManager />
        )}

        {/* Activity Logs Tab */}
        {activeTab === "logs" && (
          <LogPanel />
        )}

        {/* Super Admin Management Tab */}
        {activeTab === "superadmin" && userRole === "superadmin" && (
          <SuperAdminManager />
        )}
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Current Password:</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({
                      ...passwordForm, 
                      currentPassword: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password:</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({
                      ...passwordForm, 
                      newPassword: e.target.value
                    })}
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password:</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({
                      ...passwordForm, 
                      confirmPassword: e.target.value
                    })}
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Confirmation Modal */}
      <AdminConfirmationModal
        show={confirmModal.show}
        onClose={() => setConfirmModal(prev => ({ ...prev, show: false }))}
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
    </div>
  );
}

export default AdminPanel;
