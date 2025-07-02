// AdminDashboard Component - Main Orchestrator for Optimized Admin Panel
import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Alert, Toast } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

// Import optimized split components
import AdminHeader from './AdminHeader';
import KPIMetrics from './KPIMetrics';
import BookingFilters from './BookingFilters';
import BookingsList from './BookingsList';

// Import new enhanced components 
import AdvancedSearchSystem from './AdvancedSearchSystem';
import BulkOperationsHub from './BulkOperationsHub';
import CustomizableDashboard from './CustomizableDashboard';
import { VirtualizedBookingsList } from './VirtualizedList';
import RealTimeActivityFeed from './RealTimeActivityFeed';
import AdvancedAnalytics from './AdvancedAnalytics';
import SmartNotificationSystem from './SmartNotificationSystem';
import QuickActionsToolbar from './QuickActionsToolbar';

// Import existing components for integration
import NewsletterManager from '../NewsletterManager';
import LogPanel from '../LogPanel';
import SuperAdminManager from '../SuperAdminManager';
import CustomerManagement from './CustomerManagement';

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
  
  // Client-side hydration state
  const [isClient, setIsClient] = useState(false);
  
  // Ensure component is hydrated on client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
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
  
  // Enhanced dashboard preferences with local storage (using useState for now)
  const [dashboardLayout, setDashboardLayout] = useState([
    { id: 'kpi_metrics', x: 0, y: 0, w: 12, h: 2 },
    { id: 'recent_bookings', x: 0, y: 2, w: 8, h: 4 },
    { id: 'activity_feed', x: 8, y: 2, w: 4, h: 4 }
  ]);
  
  const [savedSearches, setSavedSearches] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    useVirtualScrolling: true,
    dashboardTheme: 'light',
    enableRealTimeUpdates: true,
    autoRefreshInterval: 30000
  });
  
  // Enhanced search state
  const [advancedSearch, setAdvancedSearch] = useState({
    query: '',
    type: 'all',
    quickFilters: []
  });
  
  // Bulk operations state
  const [bulkOperationProgress, setBulkOperationProgress] = useState(null);
  
  // Debounced search for better performance
  const [searchTerm, setSearchTerm, debouncedSearch] = useDebouncedState('', 300);
  
  // Filters state
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: { start: null, end: null },
    sortBy: 'date',
    sortOrder: 'desc'
  });
  
  // Enhanced quick filters for advanced search
  const quickFilters = useMemo(() => [
    { key: 'today', label: 'Today', icon: '📅' },
    { key: 'pending', label: 'Pending', icon: '⏳' },
    { key: 'high-value', label: 'High Value ($200+)', icon: '💰' },
    { key: 'this-week', label: 'This Week', icon: '📊' },
    { key: 'no-show-risk', label: 'No-Show Risk', icon: '⚠️' },
    { key: 'vip-customers', label: 'VIP Customers', icon: '⭐' }
  ], []);

  // Available bulk actions
  const availableBulkActions = useMemo(() => [
    'approve', 'cancel', 'reschedule', 'export', 'sendReminder', 'updateStatus'
  ], []);

  // Combined filtering with advanced search and existing filters
  const combinedFilters = useMemo(() => ({
    ...filters,
    search: advancedSearch.query,
    searchType: advancedSearch.type,
    quickFilters: advancedSearch.quickFilters
  }), [filters, advancedSearch]);

  // Use optimized filtering with combined filters
  const filteredBookings = useOptimizedBookingFilters(state.bookings, combinedFilters);
  
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
    // Ensure we're on the client side
    if (typeof window === 'undefined') return;
    
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
      
      // Ensure we're on the client side
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No token found');
      }
      
      // Decode the token to get username and role (same pattern as AdminPanel.jsx)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userData = {
          username: payload.sub || 'Admin',
          role: payload.role || 'admin',
          user_type: payload.role || 'admin'
        };
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } catch (decodeError) {
        console.error('Token decode error:', decodeError);
        // Fallback user data
        setCurrentUser({ username: 'Admin', role: 'admin', user_type: 'admin' });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
      }
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
      if (typeof window === 'undefined') return;
      
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
    }
    router.push('/admin-login');
  });
  
  // Booking action handlers
  const handleBookingAction = useStableCallback(async (action, bookingId) => {
    try {
      if (typeof window === 'undefined') return;
      
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
  
  // Enhanced bulk action handler with progress tracking
  const handleBulkAction = useStableCallback(async (action, bookingIds, parameters = {}) => {
    try {
      if (typeof window === 'undefined') return;
      
      setBulkOperationProgress({
        operation: `${action}ing bookings`,
        total: bookingIds.length,
        current: 0,
        hasErrors: false,
        errors: 0
      });

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/booking/admin/bookings/bulk/${action}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          booking_ids: bookingIds,
          parameters 
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setBulkOperationProgress({
          operation: `${action}ing bookings`,
          total: bookingIds.length,
          current: bookingIds.length,
          hasErrors: result.errors?.length > 0,
          errors: result.errors?.length || 0
        });

        setToastMessage(`${bookingIds.length} bookings ${action}ed successfully`);
        setSelectedBookings([]);
        await actions.fetchBookings();
      } else {
        throw new Error(`Failed to ${action} bookings`);
      }
    } catch (error) {
      console.error(`Bulk ${action} error:`, error);
      setToastMessage(`Failed to ${action} bookings`);
      setBulkOperationProgress(null);
    } finally {
      setTimeout(() => setBulkOperationProgress(null), 3000);
    }
  });

  // Advanced search handler
  const handleAdvancedSearch = useCallback((searchConfig) => {
    setAdvancedSearch(searchConfig);
    setCurrentPage(1); // Reset pagination
  }, []);

  // Saved search handlers
  const handleSaveSearch = useCallback((searchToSave) => {
    setSavedSearches(prev => [...prev, searchToSave]);
    setToastMessage('Search saved successfully');
  }, [setSavedSearches]);

  const handleDeleteSearch = useCallback((searchId) => {
    setSavedSearches(prev => prev.filter(s => s.id !== searchId));
    setToastMessage('Search deleted');
  }, [setSavedSearches]);

  // Dashboard customization handlers
  const handleDashboardLayoutChange = useCallback((newLayout) => {
    setDashboardLayout(newLayout);
  }, [setDashboardLayout]);

  // Select all bookings handler
  const handleSelectAllBookings = useCallback(() => {
    const visibleBookingIds = paginatedBookings.map(booking => booking.id);
    setSelectedBookings(visibleBookingIds);
  }, [paginatedBookings]);

  // Clear selection handler
  const handleClearSelection = useCallback(() => {
    setSelectedBookings([]);
  }, []);
  
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
      if (typeof window === 'undefined') return;
      
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
      case 'customers':
        return <CustomerManagement />;
      case 'superadmin':
        return <SuperAdminManager />;
      case 'analytics':
        return <AdvancedAnalytics />;
      case 'customize':
        return (
          <CustomizableDashboard
            layout={dashboardLayout}
            onLayoutChange={handleDashboardLayoutChange}
            userPreferences={userPreferences}
            onPreferencesChange={setUserPreferences}
          />
        );
      default:
        return (
          <>
            {/* Enhanced KPI Section */}
            <Row className="mb-4">
              <Col md={8}>
                <KPIMetrics
                  {...kpiMetrics}
                  isLoading={state.isLoading}
                  lastUpdated={state.lastUpdated}
                />
              </Col>
              <Col md={4}>
                <QuickActionsToolbar />
              </Col>
            </Row>

            {/* Advanced Search System */}
            <AdvancedSearchSystem
              onSearch={handleAdvancedSearch}
              searchValue={advancedSearch.query}
              savedSearches={savedSearches}
              onSaveSearch={handleSaveSearch}
              onDeleteSearch={handleDeleteSearch}
              quickFilters={quickFilters}
              placeholder="Search bookings, customers, or IDs..."
            />

            {/* Bulk Operations Hub */}
            <BulkOperationsHub
              selectedItems={selectedBookings}
              availableActions={availableBulkActions}
              onBulkAction={handleBulkAction}
              onSelectAll={handleSelectAllBookings}
              onClearSelection={handleClearSelection}
              totalItems={filteredBookings.length}
              isLoading={state.isLoading}
              operationProgress={bulkOperationProgress}
            />

            {/* Main Content Area */}
            <Row>
              <Col lg={8}>
                {/* Bookings List with Performance Toggle */}
                {userPreferences.useVirtualScrolling && filteredBookings.length > 50 ? (
                  <VirtualizedBookingsList
                    bookings={filteredBookings}
                    onBookingSelect={handleBookingSelect}
                    onBookingAction={handleBookingAction}
                    selectedBookings={selectedBookings}
                    isLoading={state.isLoading}
                    error={state.error}
                  />
                ) : (
                  <>
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
                )}
              </Col>
              
              <Col lg={4}>
                {/* Right Sidebar */}
                <div className="admin-sidebar">
                  {/* Real-time Activity Feed */}
                  {userPreferences.enableRealTimeUpdates && (
                    <div className="mb-4">
                      <RealTimeActivityFeed />
                    </div>
                  )}
                  
                  {/* Smart Notifications */}
                  <div className="mb-4">
                    <SmartNotificationSystem 
                      notifications={notifications}
                      onNotificationAction={(action, notificationId) => {
                        console.log('Notification action:', action, notificationId);
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </>
        );
    }
  };
  
  // Show loading if not client-side hydrated or if still loading
  if (!isClient || isLoading) {
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
                { key: 'analytics', label: 'Analytics', icon: '📈' },
                { key: 'customers', label: 'Customers', icon: '👥' },
                { key: 'customize', label: 'Customize', icon: '🎨' },
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
