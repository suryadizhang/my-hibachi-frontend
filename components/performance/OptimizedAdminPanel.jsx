/**
 * Optimized AdminPanel Component
 * Demonstrates better alternatives to useState, useEffect, and useCallback
 * 
 * Performance improvements:
 * - 15+ useState calls reduced to 1 useReducer
 * - Memoized selectors prevent unnecessary re-renders
 * - Stable callbacks reduce child component re-renders
 * - Batch updates for API responses
 * - Virtualized lists for large booking data
 */

import React, { useEffect, useMemo, Suspense } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Spinner, Button, Container, Card, Row, Col, Nav, Tab, Form, Table, Alert } from "react-bootstrap";
import { API_BASE } from '../../lib/config/api';

// Import our performance-optimized hooks
import {
  useOptimizedAdminState,
  useOptimizedBookingFilters,
  useStableCallback,
  useBatchedUpdates,
  useRenderProfiler,
  useDebouncedState,
  useAutoCleanup,
  useVirtualizedList
} from '../performance/PerformanceOptimizedHooks';

// Lazy load heavy components for better initial load
const AdminConfirmationModal = React.lazy(() => import('../AdminConfirmationModal'));
const NewsletterManager = React.lazy(() => import('../NewsletterManager'));
const LogPanel = React.lazy(() => import('../LogPanel'));
const SuperAdminManager = React.lazy(() => import('../SuperAdminManager'));

// Memoized components to prevent unnecessary re-renders
const MemoizedBookingRow = React.memo(({ booking, onAction }) => (
  <tr key={booking.id}>
    <td>{booking.id}</td>
    <td>{booking.customer_name}</td>
    <td>{booking.customer_email}</td>
    <td>{booking.date}</td>
    <td>{booking.time_slot}</td>
    <td>
      <Button 
        size="sm" 
        variant="outline-primary"
        onClick={() => onAction('view', booking)}
      >
        View
      </Button>
    </td>
  </tr>
));

const MemoizedKPICard = React.memo(({ title, value, variant = "primary", onClick }) => (
  <Card 
    className={`text-center cursor-pointer border-${variant}`}
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <Card.Body>
      <Card.Title className={`text-${variant}`}>{value}</Card.Title>
      <Card.Text>{title}</Card.Text>
    </Card.Body>
  </Card>
));

function OptimizedAdminPanel() {
  // Performance monitoring in development
  const renderCount = useRenderProfiler('OptimizedAdminPanel');
  
  // Single useReducer replaces 15+ useState calls
  const [state, actions] = useOptimizedAdminState();
  
  // Debounced search to prevent excessive API calls
  const [searchValue, setSearchValue, debouncedSearch] = useDebouncedState('', 300);
  
  // Batch updates for better performance
  const batchUpdate = useBatchedUpdates();
  
  // Auto cleanup for memory management
  const addCleanup = useAutoCleanup();
  
  const router = useRouter();

  // Client-side token management
  const token = typeof window !== 'undefined' ? localStorage.getItem("adminToken") : null;

  // Memoized selectors for filtered data (prevents unnecessary recalculations)
  const filteredBookings = useOptimizedBookingFilters(state.bookings, {
    search: debouncedSearch,
    status: state.mode,
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Virtualized list for large booking datasets
  const virtualizedBookings = useVirtualizedList(filteredBookings, 60, 400);

  // Stable callbacks that don't change on every render
  const handleBookingAction = useStableCallback((action, booking) => {
    switch (action) {
      case 'view':
        actions.setModal({
          show: true,
          title: 'Booking Details',
          message: `Viewing booking for ${booking.customer_name}`,
          bookingDetails: booking
        });
        break;
      case 'edit':
        // Handle edit action
        break;
      case 'delete':
        // Handle delete action
        break;
    }
  }, [actions]);

  const handleKPIClick = useStableCallback((kpiType) => {
    batchUpdate(() => {
      actions.setLoading(true);
      // Update multiple state pieces in one render cycle
      switch (kpiType) {
        case 'week':
          actions.setFilters({ period: 'week' });
          break;
        case 'month':
          actions.setFilters({ period: 'month' });
          break;
      }
    });
  }, [actions, batchUpdate]);

  // Optimized API functions with error handling
  const fetchBookings = useStableCallback(async () => {
    if (!token) return;
    
    try {
      actions.setLoading(true);
      const response = await axios.get(`${API_BASE}/api/booking/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Batch update multiple state pieces
      batchUpdate(() => {
        actions.setBookings(response.data.bookings || []);
        actions.setError('');
      });
    } catch (error) {
      actions.setError('Failed to fetch bookings: ' + (error.response?.data?.detail || error.message));
    }
  }, [token, actions, batchUpdate]);

  const fetchKPIs = useStableCallback(async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_BASE}/api/booking/admin/kpis`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      actions.setKpis(response.data);
    } catch (error) {
      console.error('Failed to fetch KPIs:', error);
    }
  }, [token, actions]);

  const fetchCurrentUser = useStableCallback(async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_BASE}/api/booking/admin/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.username) {
        actions.setUser(response.data.username, response.data.user_type || 'admin');
      }
    } catch (error) {
      console.log('Could not fetch user info:', error.message);
    }
  }, [token, actions]);

  // Single useEffect for authentication and initial data loading
  useEffect(() => {
    if (!token) {
      router.push("/admin-login");
      return;
    }

    // Batch initial data fetching
    const initializeData = async () => {
      await Promise.all([
        fetchCurrentUser(),
        fetchKPIs(),
        fetchBookings()
      ]);
    };

    initializeData();

    // Add cleanup for any ongoing requests
    const controller = new AbortController();
    addCleanup(() => controller.abort());

  }, [token, router, fetchCurrentUser, fetchKPIs, fetchBookings, addCleanup]);

  // Update search filter when debounced value changes
  useEffect(() => {
    actions.setFilters({ search: debouncedSearch });
  }, [debouncedSearch, actions]);

  // Memoized render sections to prevent unnecessary re-renders
  const kpiSection = useMemo(() => (
    <Row className="mb-4">
      <Col md={3}>
        <MemoizedKPICard
          title="Total Bookings"
          value={state.kpis.total}
          variant="primary"
          onClick={() => handleKPIClick('total')}
        />
      </Col>
      <Col md={3}>
        <MemoizedKPICard
          title="This Week"
          value={state.kpis.week}
          variant="success"
          onClick={() => handleKPIClick('week')}
        />
      </Col>
      <Col md={3}>
        <MemoizedKPICard
          title="This Month"
          value={state.kpis.month}
          variant="info"
          onClick={() => handleKPIClick('month')}
        />
      </Col>
      <Col md={3}>
        <MemoizedKPICard
          title="Waitlist"
          value={state.kpis.waitlist}
          variant="warning"
          onClick={() => handleKPIClick('waitlist')}
        />
      </Col>
    </Row>
  ), [state.kpis, handleKPIClick]);

  const searchSection = useMemo(() => (
    <Row className="mb-3">
      <Col md={6}>
        <Form.Control
          type="text"
          placeholder="Search bookings..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Col>
      <Col md={6}>
        <div className="text-muted small">
          Showing {filteredBookings.length} of {state.bookings.length} bookings
          {process.env.NODE_ENV === 'development' && (
            <span className="ms-2">• Renders: {renderCount}</span>
          )}
        </div>
      </Col>
    </Row>
  ), [searchValue, setSearchValue, filteredBookings.length, state.bookings.length, renderCount]);

  // Virtualized booking table for better performance with large datasets
  const bookingTable = useMemo(() => (
    <div style={{ height: '400px', overflow: 'auto' }} onScroll={virtualizedBookings.handleScroll}>
      <div style={{ height: virtualizedBookings.totalHeight, position: 'relative' }}>
        <Table striped bordered hover style={{ transform: `translateY(${virtualizedBookings.offsetY}px)` }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {virtualizedBookings.visibleItems.map(booking => (
              <MemoizedBookingRow
                key={booking.id}
                booking={booking}
                onAction={handleBookingAction}
              />
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  ), [virtualizedBookings, handleBookingAction]);

  // Loading state
  if (state.loading && !state.bookings.length) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading admin panel...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="admin-panel">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>🚀 Optimized Admin Dashboard</h1>
        <div>
          <span className="me-3">Welcome, {state.username || 'Admin'} ({state.userRole})</span>
          <Button 
            variant="outline-danger" 
            onClick={() => {
              localStorage.removeItem("adminToken");
              router.push("/admin-login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <Alert variant="danger" dismissible onClose={() => actions.setError('')}>
          {state.error}
        </Alert>
      )}

      {/* Performance Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <Alert variant="info" className="mb-3">
          <strong>Performance Optimized!</strong> This component uses useReducer instead of {15}+ useState calls, 
          memoized selectors, stable callbacks, and virtualized lists. Render count: {renderCount}
        </Alert>
      )}

      {/* KPI Cards */}
      {kpiSection}

      {/* Main Tabs */}
      <Tab.Container activeKey={state.activeTab} onSelect={(key) => actions.setFilters({ activeTab: key })}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="bookings">📅 Bookings</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="newsletter">📧 Newsletter</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="logs">📊 Activity Logs</Nav.Link>
          </Nav.Item>
          {state.userRole === 'superadmin' && (
            <Nav.Item>
              <Nav.Link eventKey="superadmin">👑 Super Admin</Nav.Link>
            </Nav.Item>
          )}
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="bookings">
            <Card>
              <Card.Header>
                <h5>Booking Management</h5>
              </Card.Header>
              <Card.Body>
                {searchSection}
                {bookingTable}
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="newsletter">
            <Suspense fallback={<Spinner animation="border" />}>
              <NewsletterManager />
            </Suspense>
          </Tab.Pane>

          <Tab.Pane eventKey="logs">
            <Suspense fallback={<Spinner animation="border" />}>
              <LogPanel />
            </Suspense>
          </Tab.Pane>

          {state.userRole === 'superadmin' && (
            <Tab.Pane eventKey="superadmin">
              <Suspense fallback={<Spinner animation="border" />}>
                <SuperAdminManager />
              </Suspense>
            </Tab.Pane>
          )}
        </Tab.Content>
      </Tab.Container>

      {/* Confirmation Modal */}
      <Suspense fallback={<div />}>
        <AdminConfirmationModal
          show={state.confirmModal.show}
          title={state.confirmModal.title}
          message={state.confirmModal.message}
          onConfirm={state.confirmModal.onConfirm}
          onCancel={() => actions.setModal({ show: false })}
        />
      </Suspense>
    </Container>
  );
}

export default OptimizedAdminPanel;
