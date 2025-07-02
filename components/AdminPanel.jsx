import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Spinner, Button, Container } from "react-bootstrap";
import { API_BASE } from '../lib/config/api';
import AdminConfirmationModal from './AdminConfirmationModal';
import NewsletterManager from './NewsletterManager';
import LogPanel from './LogPanel';
import SuperAdminManager from './SuperAdminManager';
import OptimizedBookingCard from './performance/OptimizedBookingCard';
import { 
  useOptimizedAdminState, 
  useOptimizedBookingFilters,
  useStableCallback,
  useDebouncedState,
  useRenderProfiler 
} from './performance/PerformanceOptimizedHooks';
import './AdminPanel.css';

function AdminPanel() {
  // Use optimized state management instead of multiple useState calls
  const [state, actions] = useOptimizedAdminState();
  
  // Legacy state for backward compatibility
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState(null);

  // Router and constants
  const router = useRouter();
  const pageSize = 10;

  // Performance monitoring
  const renderCount = useRenderProfiler('AdminPanel');
  
  // Debounced search for better performance
  const [searchTerm, setSearchTerm, debouncedSearch] = useDebouncedState(state.search, 300);

  
  // Optimized booking filtering with memoization
  const filteredBookings = useOptimizedBookingFilters(state.bookings, {
    search: debouncedSearch,
    status: null, // Add filtering by status if needed
    sortBy: 'date',
    sortOrder: 'asc'
  });

  // Memoized pagination calculation
  const paginatedBookings = useMemo(() => {
    const startIndex = (state.page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBookings.slice(startIndex, endIndex);
  }, [filteredBookings, state.page, pageSize]);

  // Total pages calculation
  const totalPages = useMemo(() => {
    return Math.ceil(filteredBookings.length / pageSize);
  }, [filteredBookings.length, pageSize]);

  // Client-side only initialization
  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("adminToken");
    setToken(storedToken);
  }, []);

  // Check authentication when client is ready
  useEffect(() => {
    if (isClient && !token) {
      router.push("/admin-login");
    }
  }, [isClient, token, router]);

  // Initialize user data when token is available
  useEffect(() => {
    if (isClient && token) {
      fetchCurrentUser();
    }
  }, [token, isClient, fetchCurrentUser]);

  // Auto-load upcoming bookings when component mounts and user is authenticated
  useEffect(() => {
    if (token && state.mode === "upcoming") {
      fetchUpcoming();
    }
  }, [token, state.mode, fetchUpcoming]);

  // KPI card click handlers - optimized with stable callbacks
  const handleThisWeekClick = useStableCallback(async () => {
    actions.setFilters({ mode: "weekly" });
    
    // Get current week's Monday
    const now = new Date();
    const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    const mondayStr = monday.toISOString().split('T')[0];
    
    actions.setFilters({ date: mondayStr });
    
    // Fetch current week data
    try {
      actions.setLoading(true);
      const res = await axios.get(`${API_BASE}/api/booking/admin/weekly?start_date=${mondayStr}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      actions.setBookings(res.data);
      actions.setFilters({ page: 1 }); // Reset to first page
    } catch (e) {
      actions.setError("Error loading current week data: " + (e.response?.data?.detail || e.message));
    }
  }, [actions, token]);

  const handleThisMonthClick = useStableCallback(async () => {
    actions.setFilters({ mode: "monthly" });
    
    // Get current month and year
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString();
    
    actions.setFilters({ year: currentYear, month: currentMonth });
    
    // Fetch current month data
    try {
      actions.setLoading(true);
      const res = await axios.get(`${API_BASE}/api/booking/admin/monthly?year=${currentYear}&month=${currentMonth}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      actions.setBookings(res.data);
      actions.setFilters({ page: 1 }); // Reset to first page
    } catch (e) {
      actions.setError("Error loading current month data: " + (e.response?.data?.detail || e.message));
    }
  }, [actions, token]);

  const handleTotalBookingsClick = useStableCallback(async () => {
    actions.setFilters({ mode: "total" });
    
    // Fetch all bookings from all time periods and sort by date (earliest first) and deposit status
    try {
      actions.setLoading(true);
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
      
      actions.setBookings(sortedBookings);
      actions.setFilters({ page: 1 }); // Reset to first page
    } catch (e) {
      actions.setError("Error loading all bookings: " + (e.response?.data?.detail || e.message));
    }
  }, [actions, token]);

  const handleWaitlistClick = useStableCallback(async () => {
    actions.setFilters({ mode: "waitlist" });
    
    // Fetch all waitlist entries sorted by earliest date
    try {
      actions.setLoading(true);
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
      
      actions.setBookings(sortedWaitlist);
      actions.setFilters({ page: 1 }); // Reset to first page
    } catch (e) {
      actions.setError("Error loading waitlist: " + (e.response?.data?.detail || e.message));
    }
  }, [actions, token]);

  const fetchCurrentUser = useStableCallback(async () => {
    try {
      // Decode the token to get username and role
      const payload = JSON.parse(atob(token.split('.')[1]));
      actions.setUser(payload.sub || 'Admin', payload.role || 'admin');
    } catch {
      actions.setUser('Admin', 'admin');
    }
  }, [token, actions]);

  const fetchWeekly = useStableCallback(async () => {
    if (!state.date) return;
    actions.setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/booking/admin/weekly?start_date=${state.date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      actions.setBookings(res.data);
    } catch (e) {
      const errorMsg = e.response?.status === 401
        ? "Session expired. Please log in again."
        : e.response?.data?.detail || "Error fetching weekly data.";
      actions.setError(errorMsg);
      if (e.response?.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin-login");
      }
      actions.setBookings([]);
    }
  }, [state.date, token, actions, router]);

  const fetchMonthly = useStableCallback(async () => {
    if (!state.year || !state.month) return;
    actions.setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/booking/admin/monthly?year=${state.year}&month=${state.month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      actions.setBookings(res.data);
    } catch (e) {
      const errorMsg = e.response?.status === 401
        ? "Session expired. Please log in again."
        : e.response?.data?.detail || "Error fetching monthly data.";
      actions.setError(errorMsg);
      if (e.response?.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin-login");
      }
      actions.setBookings([]);
    }
  }, [state.year, state.month, token, actions, router]);

  const fetchUpcoming = useStableCallback(async () => {
    actions.setLoading(true);
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
      
      actions.setBookings(upcomingBookings);
    } catch (e) {
      const errorMsg = e.response?.status === 401
        ? "Session expired. Please log in again."
        : e.response?.data?.detail || "Error fetching upcoming bookings.";
      actions.setError(errorMsg);
      if (e.response?.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin-login");
      }
      actions.setBookings([]);
    }
  }, [token, router, actions]);

  const handleLogout = useStableCallback(() => {
    actions.setModal({
      show: true,
      title: "Confirm Logout",
      message: "Are you sure you want to logout from the admin panel?",
      actionType: "warning",
      confirmButtonText: "Logout",
      cancelButtonText: "Stay Logged In",
      requiresReason: false,
      onConfirm: () => {
        localStorage.removeItem("adminToken");
        router.push("/admin-login");
        actions.setModal({ show: false });
      }
    });
  }, [actions, router]);

  const handleChangePassword = useStableCallback(async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      actions.setError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      actions.setError("New password must be at least 6 characters long");
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
      actions.setError('');
      
      actions.setModal({
        show: true,
        title: "Password Changed",
        message: "Your password has been successfully changed!",
        actionType: "success",
        confirmButtonText: "OK",
        requiresReason: false,
        onConfirm: () => {
          actions.setModal({ show: false });
        }
      });
    } catch (err) {
      actions.setError("Failed to change password: " + (err.response?.data?.detail || err.message));
    }
  }, [passwordForm, token, actions]);

  useEffect(() => {
    // Fetch KPIs from backend (create an endpoint or compute from bookings)
    const fetchKpis = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/booking/admin/kpis`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        actions.setKpis(res.data);
      } catch {
        // fallback: compute from bookings if endpoint not available
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        actions.setKpis({
          total: state.bookings.length,
          week: state.bookings.filter(b => new Date(b.date) >= startOfWeek).length,
          month: state.bookings.filter(b => new Date(b.date) >= startOfMonth).length,
          waitlist: 0 // add waitlist logic if available
        });
      }
    };
    if (token) fetchKpis();
  }, [state.bookings, token, actions]);

  // Reset page when search changes (using optimized debounced search)
  useEffect(() => {
    actions.setFilters({ search: debouncedSearch });
  }, [debouncedSearch, actions]);

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
    switch (state.mode) {
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
  const handleCancelBooking = useStableCallback((booking) => {
    actions.setModal({
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
        actions.setModal({ isLoading: true });
        
        try {
          await axios.delete(`${API_BASE}/api/booking/admin/cancel_booking?booking_id=${booking.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: {
              reason: reason
            }
          });
          
          // Refresh the bookings list
          if (state.mode === "weekly") {
            await fetchWeekly();
          } else if (state.mode === "upcoming") {
            await fetchUpcoming();
          } else {
            await fetchMonthly();
          }
          
          actions.setModal({ show: false, isLoading: false });
          actions.setError("");
          
        } catch (e) {
          actions.setModal({ isLoading: false });
          const errorMsg = e.response?.status === 401
            ? "Session expired. Please log in again."
            : e.response?.data?.detail || "Error canceling booking. Please try again.";
          actions.setError(errorMsg);
          
          if (e.response?.status === 401) {
            localStorage.removeItem("adminToken");
            router.push("/admin-login");
          }
        }
      }
    });
  }, [actions, token, state.mode, fetchWeekly, fetchUpcoming, fetchMonthly, router]);

  const handleMarkDepositReceived = useStableCallback((booking) => {
    actions.setModal({
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
        actions.setModal({ isLoading: true });
        
        try {
          await axios.post(`${API_BASE}/api/booking/admin/confirm_deposit?booking_id=${booking.id}&date=${booking.date}`, {
            reason: reason || "Deposit confirmed by admin"
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Refresh the bookings list
          if (state.mode === "weekly") {
            await fetchWeekly();
          } else if (state.mode === "upcoming") {
            await fetchUpcoming();
          } else {
            await fetchMonthly();
          }
          
          actions.setModal({ show: false, isLoading: false });
          actions.setError("");
          
        } catch (e) {
          actions.setModal({ isLoading: false });
          const errorMsg = e.response?.status === 401
            ? "Session expired. Please log in again."
            : e.response?.data?.detail || "Error updating deposit status. Please try again.";
          actions.setError(errorMsg);
          
          if (e.response?.status === 401) {
            localStorage.removeItem("adminToken");
            router.push("/admin-login");
          }
        }
      }
    });
  }, [actions, token, state.mode, fetchWeekly, fetchUpcoming, fetchMonthly, router]);

  const handleContactWaitlistCustomer = useStableCallback((waitlistEntry) => {
    actions.setModal({
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
        
        actions.setModal({ show: false });
      }
    });
  }, [actions]);

  const handleRemoveFromWaitlist = useStableCallback((waitlistEntry) => {
    actions.setModal({
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
        actions.setModal({ isLoading: true });
        
        try {
          await axios.delete(`${API_BASE}/api/booking/admin/waitlist/${waitlistEntry.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { reason: reason }
          });
          
          // Refresh the waitlist
          await handleWaitlistClick();
          
          actions.setModal({ show: false, isLoading: false });
          actions.setError("");
          
        } catch (e) {
          actions.setModal({ isLoading: false });
          const errorMsg = e.response?.status === 401
            ? "Session expired. Please log in again."
            : e.response?.data?.detail || "Error removing from waitlist. Please try again.";
          actions.setError(errorMsg);
          
          if (e.response?.status === 401) {
            localStorage.removeItem("adminToken");
            router.push("/admin-login");
          }
        }
      }
    });
  }, [actions, token, handleWaitlistClick, router]);

  return (
    <div className="admin-panel-container">
      {/* Show loading while checking authentication */}
      {!isClient || !token ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
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
                    Welcome, {state.username}! • Booking Management & Analytics Portal
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
              className={`tab-btn ${state.activeTab === "bookings" ? "active" : ""}`}
              onClick={() => actions.setFilters({ activeTab: "bookings" })}
            >
              <span className="emoji-visible">📋</span>
              Booking Management
            </button>
            <button 
              className={`tab-btn ${state.activeTab === "newsletter" ? "active" : ""}`}
              onClick={() => actions.setFilters({ activeTab: "newsletter" })}
            >
              <span className="emoji-visible">📧</span>
              Newsletter Manager
            </button>
            <button 
              className={`tab-btn ${state.activeTab === "logs" ? "active" : ""}`}
              onClick={() => actions.setFilters({ activeTab: "logs" })}
            >
              <span className="emoji-visible">📊</span>
              Activity Logs
            </button>
            {state.userRole === "superadmin" && (
              <button 
                className={`tab-btn ${state.activeTab === "superadmin" ? "active" : ""}`}
                onClick={() => actions.setFilters({ activeTab: "superadmin" })}
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
        {state.activeTab === "bookings" && (
          <>
            {/* Mode Toggle */}
            <div className="mode-toggle-container">
              <h3 className="mode-toggle-title">
                <span className="emoji-visible">📅</span>
                View Mode
              </h3>
              <div>
                <Button
                  className={`mode-btn ${state.mode === "upcoming" ? "active" : ""}`}
                  onClick={() => actions.setFilters({ mode: "upcoming" })}
                >
                  <span className="emoji-visible">⏰</span>
                  Upcoming (14 days)
                </Button>
                <Button
                  className={`mode-btn ${state.mode === "weekly" ? "active" : ""}`}
                  onClick={() => actions.setFilters({ mode: "weekly" })}
                >
                  <span className="emoji-visible">📅</span>
                  Weekly View
                </Button>
                <Button
                  className={`mode-btn ${state.mode === "monthly" ? "active" : ""}`}
                  onClick={() => actions.setFilters({ mode: "monthly" })}
                >
                  <span className="emoji-visible">📆</span>
                  Monthly View
                </Button>
              </div>
            </div>

            {/* Filter Form */}
            <div className="filter-form-container" style={{ position: "relative" }}>
              {state.loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner-large"></div>
                </div>
              )}
              
              <h3 className="filter-form-title">
                <span className="emoji-visible">🔍</span>
                Filter Bookings
              </h3>
              
              {state.mode === "upcoming" && (
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
                    disabled={state.loading}
                  >
                    {state.loading ? (
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
              
              {state.mode === "weekly" && (
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
                      value={state.date}
                      onChange={(e) => actions.setFilters({ date: e.target.value })}
                    />
                  </div>
                  <Button 
                    className="fetch-btn"
                    onClick={fetchWeekly} 
                    disabled={state.loading || !state.date}
                  >
                    {state.loading ? (
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
              
              {state.mode === "monthly" && (
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
                      value={state.year}
                      onChange={(e) => actions.setFilters({ year: e.target.value })}
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
                      value={state.month}
                      onChange={(e) => actions.setFilters({ month: e.target.value })}
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
                    disabled={state.loading || !state.year || !state.month}
                  >
                    {state.loading ? (
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
            {state.error && (
              <div className="admin-alert danger" role="alert">
                <span className="emoji-visible">❌</span>
                {state.error}
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
                <div className="kpi-value">{state.kpis.total}</div>
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
                <div className="kpi-value">{state.kpis.week}</div>
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
                <div className="kpi-value">{state.kpis.month}</div>
                <div className="kpi-label">This Month</div>
                <div className="kpi-hint">Click for current month</div>
              </div>
              <div 
                className="kpi-card danger clickable"
                onClick={handleWaitlistClick}
              >
                <div className="kpi-icon emoji-visible">⏳</div>
                <div className="kpi-value">{state.kpis.waitlist}</div>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    {paginatedBookings.length === 0 && !state.loading ? (
                      <tr>
                        <td colSpan={state.mode === 'waitlist' ? 7 : 9} className="no-bookings">
                          <div className="no-bookings-icon emoji-visible">📭</div>
                          <div>{state.mode === 'waitlist' ? 'No waitlist entries found.' : 'No bookings found.'}</div>
                          <small>Try adjusting your search or date filters.</small>
                        </td>
                      </tr>
                    ) : (
                      paginatedBookings.map((b, index) => (
                        <tr key={b.id + (b.date || b.preferred_date) + index}>
                          {state.mode === 'waitlist' ? (
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
                    disabled={state.page === 1}
                    onClick={() => actions.setFilters({ page: state.page - 1 })}
                  >
                    <span className="emoji-visible">⬅️</span>
                    Previous
                  </Button>
                  
                  <div className="pagination-info">
                    Page {state.page} of {totalPages}
                  </div>
                  
                  <Button
                    className="pagination-btn"
                    disabled={state.page === totalPages || totalPages === 0}
                    onClick={() => actions.setFilters({ page: state.page + 1 })}
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
        {state.activeTab === "newsletter" && (
          <NewsletterManager />
        )}

        {/* Activity Logs Tab */}
        {state.activeTab === "logs" && (
          <LogPanel />
        )}

        {/* Super Admin Management Tab */}
        {state.activeTab === "superadmin" && state.userRole === "superadmin" && (
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
        show={state.confirmModal.show}
        onClose={() => actions.setModal({ show: false })}
        onConfirm={state.confirmModal.onConfirm}
        title={state.confirmModal.title}
        message={state.confirmModal.message}
        actionType={state.confirmModal.actionType}
        confirmButtonText={state.confirmModal.confirmButtonText}
        cancelButtonText={state.confirmModal.cancelButtonText}
        requiresReason={state.confirmModal.requiresReason}
        reasonPlaceholder={state.confirmModal.reasonPlaceholder}
        bookingDetails={state.confirmModal.bookingDetails}
        isLoading={state.confirmModal.isLoading}
      />
        </>
      )}
    </div>
  );
}

export default AdminPanel;
