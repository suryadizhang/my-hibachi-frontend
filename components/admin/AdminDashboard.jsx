// AdminDashboard Component - Main Orchestrator for Optimized Admin Panel
import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Alert, Toast } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

// Import optimized split components
import AdminHeader from './AdminHeader';
import KPIMetrics from './KPIMetrics';
import BookingFilters from './BookingFilters';
import BookingsList from './BookingsList';

// Import existing components for integration
import NewsletterManager from '../NewsletterManager';
import LogPanel from '../LogPanel';
import SuperAdminManager from '../SuperAdminManager';

// Import optimized hooks
import { 
  useOptimizedAdminState, 
  useOptimizedBookingFilters,
  useStableCallback,
  useDebouncedState,
  useRenderProfiler 
} from '../performance/PerformanceOptimizedHooks';

const AdminDashboard = memo(() => {
  const router = useRouter();
  
  // Performance monitoring
  const renderCount = useRenderProfiler('AdminDashboard');
  
  // Optimized state management
  const [state, actions] = useOptimizedAdminState();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI state
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState(null);
  
  // Debounced search for better performance
  const [searchTerm, setSearchTerm, debouncedSearch] = useDebouncedState('', 300);
  
  // Filters state
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: { start: null, end: null },
    sortBy: 'date',
    sortOrder: 'desc'
  });
  
  // Optimized booking filtering with memoization
  const filteredBookings = useOptimizedBookingFilters(state.bookings, {
    search: debouncedSearch,
    status: filters.status === 'all' ? null : filters.status,
    dateRange: filters.dateRange,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Memoized pagination calculation
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBookings.slice(startIndex, endIndex);
  }, [filteredBookings, currentPage, pageSize]);
  
  const totalPages = useMemo(() => 
    Math.ceil(filteredBookings.length / pageSize),
    [filteredBookings.length, pageSize]
  );
  
  // Memoized KPI calculations
  const kpiMetrics = useMemo(() => {
    const bookings = state.bookings || [];
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    
    return {
      totalBookings: bookings.length,
      weeklyBookings: bookings.filter(b => 
        new Date(b.created_at) >= weekStart
      ).length,
      monthlyRevenue: bookings
        .filter(b => new Date(b.created_at).getMonth() === now.getMonth())
        .reduce((sum, b) => sum + (b.total_amount || 0), 0),
      averageBookingValue: bookings.length > 0 
        ? bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0) / bookings.length 
        : 0,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      cancellationRate: bookings.length > 0 
        ? (bookings.filter(b => b.status === 'cancelled').length / bookings.length) * 100 
        : 0
    };
  }, [state.bookings]);
  
  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (debouncedSearch) count++;
    if (filters.status !== 'all') count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    return count;
  }, [debouncedSearch, filters]);
  
  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin-login');
      return;
    }
    
    // Verify token and load user data
    fetchCurrentUser();
  }, []);
  
  // Load initial data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);
  
  // Stable callback for fetching current user
  const fetchCurrentUser = useStableCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/booking/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      localStorage.removeItem('adminToken');
      router.push('/admin-login');
    } finally {
      setIsLoading(false);
    }
  });
  
  // Stable callback for loading dashboard data
  const loadDashboardData = useStableCallback(async () => {
    try {
      actions.setLoading(true);
      
      // Load bookings
      await actions.fetchBookings();
      
      // Load notifications
      await fetchNotifications();
      
    } catch (error) {
      console.error('Dashboard data loading error:', error);
      actions.setError('Failed to load dashboard data');
    } finally {
      actions.setLoading(false);
    }
  });
  
  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/booking/admin/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const notificationsData = await response.json();
        setNotifications(notificationsData);
      }
    } catch (error) {
      console.error('Notifications fetch error:', error);
    }
  }, []);
  
  // Stable callback for logout
  const handleLogout = useStableCallback(async () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('adminToken');
    router.push('/admin-login');
  });
  
  // Booking action handlers
  const handleBookingAction = useStableCallback(async (action, bookingId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/booking/admin/bookings/${bookingId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setToastMessage(`Booking ${action}ed successfully`);
        await actions.fetchBookings(); // Refresh bookings
      } else {
        throw new Error(`Failed to ${action} booking`);
      }
    } catch (error) {
      console.error(`Booking ${action} error:`, error);
      setToastMessage(`Failed to ${action} booking`);
    }
  });
  
  // Bulk action handler
  const handleBulkAction = useStableCallback(async (action, bookingIds) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/booking/admin/bookings/bulk/${action}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ booking_ids: bookingIds })
      });
      
      if (response.ok) {
        setToastMessage(`${bookingIds.length} bookings ${action}ed successfully`);
        setSelectedBookings([]);
        await actions.fetchBookings();
      } else {
        throw new Error(`Failed to ${action} bookings`);
      }
    } catch (error) {
      console.error(`Bulk ${action} error:`, error);
      setToastMessage(`Failed to ${action} bookings`);
    }
  });
  
  // Filter handlers
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  }, [setSearchTerm]);
  
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  }, []);
  
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({
      status: 'all',
      dateRange: { start: null, end: null },
      sortBy: 'date',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
  }, [setSearchTerm]);
  
  // Booking selection handlers
  const handleBookingSelect = useCallback((bookingId) => {
    if (bookingId === null) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(prev => 
        prev.includes(bookingId) 
          ? prev.filter(id => id !== bookingId)
          : [...prev, bookingId]
      );
    }
  }, []);
  
  // Notification handlers
  const handleNotificationClick = useCallback(async (notification) => {
    // Mark as read
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/booking/admin/notifications/${notification.id}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Mark notification read error:', error);
    }
  }, []);
  
  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'newsletter':
        return <NewsletterManager />;
      case 'logs':
        return <LogPanel />;
      case 'superadmin':
        return <SuperAdminManager />;
      default:
        return (
          <>
            <KPIMetrics
              {...kpiMetrics}
              isLoading={state.isLoading}
              lastUpdated={state.lastUpdated}
            />
            
            <BookingFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              statusFilter={filters.status}
              onStatusFilterChange={(value) => handleFilterChange('status', value)}
              dateRange={filters.dateRange}
              onDateRangeChange={(value) => handleFilterChange('dateRange', value)}
              sortBy={filters.sortBy}
              onSortChange={(value) => handleFilterChange('sortBy', value)}
              sortOrder={filters.sortOrder}
              onSortOrderChange={(value) => handleFilterChange('sortOrder', value)}
              totalResults={filteredBookings.length}
              activeFiltersCount={activeFiltersCount}
              onClearFilters={handleClearFilters}
            />
            
            <BookingsList
              bookings={paginatedBookings}
              isLoading={state.isLoading}
              error={state.error}
              onBookingAction={handleBookingAction}
              onBookingSelect={handleBookingSelect}
              selectedBookings={selectedBookings}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onBulkAction={handleBulkAction}
            />
          </>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      <AdminHeader
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        notifications={notifications}
        onLogout={handleLogout}
        onNotificationClick={handleNotificationClick}
        onSettingsClick={() => setActiveTab('settings')}
        currentPath={`/admin/${activeTab}`}
      />
      
      <Container fluid className="py-4">
        {state.error && (
          <Alert variant="danger" dismissible onClose={actions.clearError}>
            {state.error}
          </Alert>
        )}
        
        {/* Tab Navigation */}
        <Row className="mb-4">
          <Col>
            <nav className="nav nav-pills">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: '📊' },
                { key: 'newsletter', label: 'Newsletter', icon: '📧' },
                { key: 'logs', label: 'Logs', icon: '📋' },
                { key: 'superadmin', label: 'Super Admin', icon: '👑' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </Col>
        </Row>
        
        {/* Tab Content */}
        {renderTabContent()}
      </Container>
      
      {/* Toast Notifications */}
      {toastMessage && (
        <Toast
          show={!!toastMessage}
          onClose={() => setToastMessage(null)}
          delay={3000}
          autohide
          className="position-fixed bottom-0 end-0 m-3"
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      )}
      
      {/* Performance Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="position-fixed bottom-0 start-0 m-2 p-2 bg-dark text-white rounded small">
          Renders: {renderCount}
        </div>
      )}
    </div>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;
