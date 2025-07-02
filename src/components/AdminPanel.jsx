import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container } from "react-bootstrap";
import { API_BASE } from '../config/api-simple';
import AdminConfirmationModal from './AdminConfirmationModal';
import NewsletterManager from './NewsletterManager';
import LogPanel from './LogPanel';
import SuperAdminManager from './SuperAdminManager';
import './AdminPanel.css';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [mode, setMode] = useState("upcoming"); // Changed default to "upcoming"
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

  // Define fetchCurrentUser BEFORE using it in useEffect
  const fetchCurrentUser = useCallback(async () => {
    try {
      // Decode the token to get username and role
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.sub || 'Admin');
      setUserRole(payload.role || 'admin');
    } catch {
      setUsername('Admin');
      setUserRole('admin');
    }
  }, [token]);

  // Redirect to login if no token
  useEffect(() => {
    console.log('AdminPanel: Checking authentication...', { hasToken: !!token });
    if (!token) {
      console.log('AdminPanel: No token found, redirecting to login');
      navigate("/admin-login");
    } else {
      console.log('AdminPanel: Token found, fetching current user');
      fetchCurrentUser();
    }
  }, [token, navigate, fetchCurrentUser]);

  // Auto-load upcoming bookings when component mounts and user is authenticated
  useEffect(() => {
    console.log('AdminPanel useEffect triggered:', { token: !!token, mode });
    if (token && mode === "upcoming") {
      console.log('Calling fetchUpcoming...');
      fetchUpcoming();
    }
  }, [token, mode, fetchUpcoming]);

  // KPI card click handlers
  const handleThisWeekClick = async () => {
    setMode("weekly");
    setError("");
    
    // Get current week's Monday
    const now = new Date();
    const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    const mondayStr = monday.toISOString().split('T')[0];
    
    setDate(mondayStr);
    
    // Fetch current week data
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/booking/admin/weekly?start_date=${mondayStr}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
      setPage(1); // Reset to first page
    } catch (e) {
      setError("Error loading current week data: " + (e.response?.data?.detail || e.message));
    }
    setLoading(false);
  };

  const handleThisMonthClick = async () => {
    setMode("monthly");
    setError("");
    
    // Get current month and year
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString();
    
    setYear(currentYear);
    setMonth(currentMonth);
    
    // Fetch current month data
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/booking/admin/monthly?year=${currentYear}&month=${currentMonth}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
      setPage(1); // Reset to first page
    } catch (e) {
      setError("Error loading current month data: " + (e.response?.data?.detail || e.message));
    }
    setLoading(false);
  };

  const handleTotalBookingsClick = async () => {
    setMode("total");
    setError("");
    
    // Fetch all bookings from all time periods and sort by date (earliest first) and deposit status
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/booking/admin/all-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Sort by date (earliest first), then by deposit status (pending first)
      const sortedBookings = res.data.sort((a, b) => {
        // First sort by date (earliest first)
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare !== 0) return dateCompare;
        
        // Then by time slot
        const timeCompare = (a.time_slot || '').localeCompare(b.time_slot || '');
        if (timeCompare !== 0) return timeCompare;
        
        // Finally by deposit status (pending deposits first)
        const aDeposit = a.deposit_received || 0;
        const bDeposit = b.deposit_received || 0;
        return aDeposit - bDeposit;
      });
      
      setBookings(sortedBookings);
      setPage(1); // Reset to first page
    } catch (e) {
      setError("Error loading all bookings: " + (e.response?.data?.detail || e.message));
    }
    setLoading(false);
  };

  const handleWaitlistClick = async () => {
    setMode("waitlist");
    setError("");
    
    // Fetch all waitlist entries sorted by earliest date
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/booking/admin/waitlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Sort by preferred date (earliest first), then by created_at
      const sortedWaitlist = res.data.sort((a, b) => {
        // First sort by preferred date (earliest first)
        const dateCompare = new Date(a.preferred_date) - new Date(b.preferred_date);
        if (dateCompare !== 0) return dateCompare;
        
        // Then by preferred time
        const timeCompare = (a.preferred_time || '').localeCompare(b.preferred_time || '');
        if (timeCompare !== 0) return timeCompare;
        
        // Finally by creation time (earliest first)
        return new Date(a.created_at) - new Date(b.created_at);
      });
      
      setBookings(sortedWaitlist);
      setPage(1); // Reset to first page
    } catch (e) {
      setError("Error loading waitlist: " + (e.response?.data?.detail || e.message));
    }
    setLoading(false);
  };

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

  const fetchUpcoming = useCallback(async () => {
    console.log('fetchUpcoming called');
    setLoading(true);
    setError("");
    try {
      // Get current date and 14 days from now
      const now = new Date();
      const fourteenDaysLater = new Date();
      fourteenDaysLater.setDate(now.getDate() + 14);
      
      // Collect bookings from all months that overlap with our 14-day range
      const monthsToFetch = new Set();
      
      // Add current month
      monthsToFetch.add(`${now.getFullYear()}-${now.getMonth() + 1}`);
      
      // Add next month if 14 days later is in a different month
      if (fourteenDaysLater.getMonth() !== now.getMonth() || fourteenDaysLater.getFullYear() !== now.getFullYear()) {
        monthsToFetch.add(`${fourteenDaysLater.getFullYear()}-${fourteenDaysLater.getMonth() + 1}`);
      }
      
      let allBookings = [];
      
      // Fetch bookings from each month
      for (const monthKey of monthsToFetch) {
        const [year, month] = monthKey.split('-');
        try {
          const res = await axios.get(`${API_BASE}/api/booking/admin/monthly?year=${year}&month=${month}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          allBookings = allBookings.concat(res.data);
          console.log(`Loaded ${res.data.length} bookings for ${year}-${month}`);
        } catch {
          console.log(`No bookings found for ${year}-${month}`);
        }
      }
      
      // Filter bookings to only show next 14 days
      const upcomingBookings = allBookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return bookingDate >= todayStart && bookingDate <= fourteenDaysLater;
      });
      
      // Sort by date and time
      upcomingBookings.sort((a, b) => {
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare !== 0) return dateCompare;
        return (a.time_slot || '').localeCompare(b.time_slot || '');
      });
      
      console.log(`Found ${upcomingBookings.length} upcoming bookings`);
      setBookings(upcomingBookings);
    } catch (e) {
      console.error('fetchUpcoming error:', e);
      setError(
        e.response?.status === 401
          ? "Session expired. Please log in again."
          : e.response?.data?.detail || "Error fetching upcoming bookings."
      );
      if (e.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
      }
      setBookings([]);
    }
    setLoading(false);
  }, [token, navigate]);

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

      await axios.post(`${API_BASE}/api/booking/admin/change_password`, formData, {
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

  const calculateFallbackKpis = useCallback(() => {
    if (bookings.length > 0) {
      console.log('AdminPanel: Using fallback KPI calculation');
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const fallbackKpis = {
        total: bookings.length,
        week: bookings.filter(b => new Date(b.date) >= startOfWeek).length,
        month: bookings.filter(b => new Date(b.date) >= startOfMonth).length,
        waitlist: 0 // add waitlist logic if available
      };
      console.log('AdminPanel: Fallback KPIs:', fallbackKpis);
      setKpis(fallbackKpis);
    } else {
      console.log('AdminPanel: No bookings available for fallback KPI calculation');
    }
  }, [bookings]);

  useEffect(() => {
    // Fetch KPIs from backend independently of bookings
    const fetchKpis = async () => {
      console.log('AdminPanel: Starting KPIs fetch...');
      try {
        const res = await axios.get(`${API_BASE}/api/booking/admin/kpis`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('AdminPanel: KPIs loaded successfully:', res.data);
        setKpis(res.data);
      } catch (error) {
        console.error('AdminPanel: KPIs fetch failed:', error);
        console.error('AdminPanel: Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        // Only use fallback if we have bookings data
        calculateFallbackKpis();
      }
    };
    if (token) {
      console.log('AdminPanel: Token available, fetching KPIs...');
      fetchKpis();
    } else {
      console.log('AdminPanel: No token available for KPIs fetch');
    }
  }, [token, calculateFallbackKpis]);

  const filteredBookings = bookings.filter(b => {
    const searchTerm = search.toLowerCase();
    return (
      (b.name && b.name.toLowerCase().includes(searchTerm)) ||
      (b.phone && b.phone.includes(search)) ||
      (b.email && b.email.toLowerCase().includes(searchTerm)) ||
      (b.date && b.date.includes(search)) ||
      (b.preferred_date && b.preferred_date.includes(search))
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

  // Get current view title for display
  const getCurrentViewTitle = () => {
    switch (mode) {
      case "upcoming":
        return "📋 Upcoming Events (Next 14 Days)";
      case "weekly":
        return "📅 This Week's Bookings";
      case "monthly":
        return "📆 This Month's Bookings";
      case "total":
        return "📊 All Bookings (Sorted by Date & Deposit)";
      case "waitlist":
        return "📝 Waitlist Entries";
      default:
        return "📋 Booking Records";
    }
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
          await axios.delete(`${API_BASE}/api/booking/admin/cancel_booking?booking_id=${booking.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: {
              reason: reason
            }
          });
          
          // Refresh the bookings list
          if (mode === "weekly") {
            await fetchWeekly();
          } else if (mode === "upcoming") {
            await fetchUpcoming();
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
      requiresReason: true,
      reasonPlaceholder: "Please provide confirmation details (e.g., payment method, transaction ID)...",
      bookingDetails: booking,
      onConfirm: async (reason) => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        
        try {
          await axios.post(`${API_BASE}/api/booking/admin/confirm_deposit?booking_id=${booking.id}&date=${booking.date}`, {
            reason: reason || "Deposit confirmed by admin"
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Refresh the bookings list
          if (mode === "weekly") {
            await fetchWeekly();
          } else if (mode === "upcoming") {
            await fetchUpcoming();
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

  const handleContactWaitlistCustomer = (waitlistEntry) => {
    setConfirmModal({
      show: true,
      title: "Contact Waitlist Customer",
      message: `Do you want to contact ${waitlistEntry.name} about their waitlist request for ${waitlistEntry.preferred_date} at ${waitlistEntry.preferred_time}?`,
      actionType: "info",
      confirmButtonText: "Open Contact Info",
      cancelButtonText: "Cancel",
      requiresReason: false,
      bookingDetails: waitlistEntry,
      onConfirm: () => {
        // Open contact information - could be enhanced to open email/phone app
        const contactInfo = `
Customer: ${waitlistEntry.name}
Phone: ${waitlistEntry.phone}
Email: ${waitlistEntry.email}
Preferred Date: ${waitlistEntry.preferred_date}
Preferred Time: ${waitlistEntry.preferred_time}
        `.trim();
        
        // Copy to clipboard
        navigator.clipboard.writeText(contactInfo).then(() => {
          alert('Contact information copied to clipboard!');
        }).catch(() => {
          alert(contactInfo);
        });
        
        setConfirmModal(prev => ({ ...prev, show: false }));
      }
    });
  };

  const handleRemoveFromWaitlist = (waitlistEntry) => {
    setConfirmModal({
      show: true,
      title: "Remove from Waitlist",
      message: `Are you sure you want to remove ${waitlistEntry.name} from the waitlist?`,
      actionType: "danger",
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
      requiresReason: true,
      reasonPlaceholder: "Please provide a reason for removing from waitlist...",
      bookingDetails: waitlistEntry,
      onConfirm: async (reason) => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        
        try {
          await axios.delete(`${API_BASE}/api/booking/admin/waitlist/${waitlistEntry.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { reason: reason }
          });
          
          // Refresh the waitlist
          await handleWaitlistClick();
          
          setConfirmModal(prev => ({ ...prev, show: false, isLoading: false }));
          setError("");
          
        } catch (e) {
          setConfirmModal(prev => ({ ...prev, isLoading: false }));
          setError(
            e.response?.status === 401
              ? "Session expired. Please log in again."
              : e.response?.data?.detail || "Error removing from waitlist. Please try again."
          );
          
          if (e.response?.status === 401) {
            localStorage.removeItem("adminToken");
            navigate("/admin-login");
          }
        }
      }
    });
  };

  console.log('AdminPanel: Rendering component', {
    hasToken: !!token,
    username,
    userRole,
    kpis,
    bookingsCount: bookings.length,
    mode,
    loading,
    error
  });

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

      {/* DEBUG PANEL - Remove in production */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '10px', margin: '10px', border: '1px solid #ddd', fontSize: '12px' }}>
        <strong>🔧 DEBUG INFO:</strong><br/>
        Token: {token ? 'Present' : 'Missing'}<br/>
        Username: {username}<br/>
        KPIs: Total={kpis.total}, Week={kpis.week}, Month={kpis.month}, Waitlist={kpis.waitlist}<br/>
        Bookings: {bookings.length} loaded<br/>
        Mode: {mode}<br/>
        Loading: {loading ? 'Yes' : 'No'}<br/>
        Error: {error || 'None'}<br/>
        Active Tab: {activeTab}
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
                  className={`mode-btn ${mode === "upcoming" ? "active" : ""}`}
                  onClick={() => setMode("upcoming")}
                >
                  <span className="emoji-visible">⏰</span>
                  Upcoming (14 days)
                </Button>
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
              
              {mode === "upcoming" && (
                <div className="filter-form">
                  <div className="upcoming-info">
                    <p className="upcoming-description">
                      <span className="emoji-visible">⏰</span>
                      Showing bookings for the next 14 days from today
                    </p>
                    <p className="upcoming-date-range">
                      <span className="emoji-visible">📅</span>
                      From: {new Date().toLocaleDateString()} to {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    className="fetch-btn"
                    onClick={fetchUpcoming} 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <span className="emoji-visible">🔄</span>
                        Refresh Upcoming Events
                      </>
                    )}
                  </Button>
                </div>
              )}
              
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
              <div 
                className="kpi-card primary clickable" 
                onClick={handleTotalBookingsClick}
                role="button"
                tabIndex={0}
                aria-label="View all bookings sorted by date and deposit status"
              >
                <div className="kpi-icon emoji-visible">📊</div>
                <div className="kpi-value">{kpis.total}</div>
                <div className="kpi-label">Total Bookings</div>
                <div className="kpi-hint">Click to view all</div>
              </div>
              <div 
                className="kpi-card success clickable" 
                onClick={handleThisWeekClick}
                role="button"
                tabIndex={0}
                aria-label="View current week bookings"
              >
                <div className="kpi-icon emoji-visible">📅</div>
                <div className="kpi-value">{kpis.week}</div>
                <div className="kpi-label">This Week</div>
                <div className="kpi-hint">Click for current week</div>
              </div>
              <div 
                className="kpi-card warning clickable" 
                onClick={handleThisMonthClick}
                role="button"
                tabIndex={0}
                aria-label="View current month bookings"
              >
                <div className="kpi-icon emoji-visible">📆</div>
                <div className="kpi-value">{kpis.month}</div>
                <div className="kpi-label">This Month</div>
                <div className="kpi-hint">Click for current month</div>
              </div>
              <div 
                className="kpi-card danger clickable"
                onClick={handleWaitlistClick}
              >
                <div className="kpi-icon emoji-visible">⏳</div>
                <div className="kpi-value">{kpis.waitlist}</div>
                <div className="kpi-label">Waitlist</div>
                <div className="kpi-hint">Click to view waitlist</div>
              </div>
            </div>

            {/* Table Section */}
            <div className="table-container">
              <div className="table-header">
                <h3 className="table-title">
                  {getCurrentViewTitle()} ({filteredBookings.length})
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
                      {mode === 'waitlist' ? (
                        <>
                          <th>📅 Preferred Date</th>
                          <th>⏰ Preferred Time</th>
                          <th>👤 Name</th>
                          <th>📞 Phone</th>
                          <th>✉️ Email</th>
                          <th>📅 Created</th>
                          <th>⚡ Actions</th>
                        </>
                      ) : (
                        <>
                          <th>📅 Date</th>
                          <th>⏰ Time</th>
                          <th>👤 Name</th>
                          <th>📞 Phone</th>
                          <th>✉️ Email</th>
                          <th>🏠 Address</th>
                          <th>📱 Contact Pref</th>
                          <th>💰 Deposit</th>
                          <th>⚡ Actions</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBookings.length === 0 && !loading ? (
                      <tr>
                        <td colSpan={mode === 'waitlist' ? 7 : 9} className="no-bookings">
                          <div className="no-bookings-icon emoji-visible">📭</div>
                          <div>{mode === 'waitlist' ? 'No waitlist entries found.' : 'No bookings found.'}</div>
                          <small>Try adjusting your search or date filters.</small>
                        </td>
                      </tr>
                    ) : (
                      paginatedBookings.map((b, index) => (
                        <tr key={b.id + (b.date || b.preferred_date) + index}>
                          {mode === 'waitlist' ? (
                            <>
                              <td>{formatDate(b.preferred_date)}</td>
                              <td>{b.preferred_time}</td>
                              <td>{b.name}</td>
                              <td>{formatPhone(b.phone)}</td>
                              <td>{b.email}</td>
                              <td>{formatDate(b.created_at ? b.created_at.split(' ')[0] : '')}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() => handleContactWaitlistCustomer(b)}
                                    style={{
                                      borderRadius: '15px',
                                      fontSize: '0.75rem',
                                      padding: '0.25rem 0.75rem'
                                    }}
                                    title="Contact customer"
                                  >
                                    <span className="emoji-visible">📞</span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleRemoveFromWaitlist(b)}
                                    style={{
                                      borderRadius: '15px',
                                      fontSize: '0.75rem',
                                      padding: '0.25rem 0.75rem'
                                    }}
                                    title="Remove from waitlist"
                                  >
                                    <span className="emoji-visible">🗑️</span>
                                  </Button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
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
                            </>
                          )}
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
