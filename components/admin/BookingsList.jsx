// BookingsList Component - Optimized Paginated Booking Display
import React, { memo, useMemo, useCallback } from 'react';
import { Table, Badge, Button, Card, Spinner, Alert } from 'react-bootstrap';

const _BookingsList = memo(({ 
  bookings = [],
  isLoading = false,
  error = null,
  onBookingAction,
  onBookingSelect,
  selectedBookings = [],
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  onBulkAction
}) => {
  // Memoized status badge renderer
  const _getStatusBadge = useCallback((status) => {
    const _statusConfig = {
      'pending': { variant: 'warning', text: '⏳ Pending' },
      'confirmed': { variant: 'success', text: '✅ Confirmed' },
      'cancelled': { variant: 'danger', text: '❌ Cancelled' },
      'completed': { variant: 'info', text: '🎉 Completed' }
    };
    
    const _config = statusConfig[status] || { variant: 'secondary', text: status };
    
    return (
      <Badge bg={config.variant}>
        {config.text}
      </Badge>
    );
  }, []);
  
  // Memoized action buttons renderer
  const _renderActionButtons = useCallback((booking) => {
    const _actions = [];
    
    if (booking.status === 'pending') {
      actions.push(
        <Button
          key="confirm"
          size="sm"
          variant="success"
          onClick={() => onBookingAction('confirm', booking.id)}
          className="me-1"
        >
          Confirm
        </Button>,
        <Button
          key="reject"
          size="sm"
          variant="danger"
          onClick={() => onBookingAction('reject', booking.id)}
        >
          Reject
        </Button>
      );
    }
    
    if (booking.status === 'confirmed') {
      actions.push(
        <Button
          key="complete"
          size="sm"
          variant="info"
          onClick={() => onBookingAction('complete', booking.id)}
          className="me-1"
        >
          Complete
        </Button>
      );
    }
    
    actions.push(
      <Button
        key="view"
        size="sm"
        variant="outline-primary"
        onClick={() => onBookingAction('view', booking.id)}
      >
        View
      </Button>
    );
    
    return <div className="action-buttons">{actions}</div>;
  }, [onBookingAction]);
  
  // Memoized table rows to prevent unnecessary re-renders
  const _tableRows = useMemo(() => 
    bookings.map((booking) => (
      <tr key={booking.id} className={selectedBookings.includes(booking.id) ? 'table-active' : ''}>
        <td>
          <input
            type="checkbox"
            checked={selectedBookings.includes(booking.id)}
            onChange={() => onBookingSelect(booking.id)}
            className="form-check-input"
          />
        </td>
        <td>
          <div>
            <strong>{booking.customer_name}</strong>
            <br />
            <small className="text-muted">{booking.email}</small>
          </div>
        </td>
        <td>{booking.phone}</td>
        <td>
          <div>
            {new Date(booking.booking_date).toLocaleDateString()}
            <br />
            <small className="text-muted">{booking.time_slot}</small>
          </div>
        </td>
        <td>{getStatusBadge(booking.status)}</td>
        <td>
          <strong>${booking.total_amount?.toFixed(2) || '0.00'}</strong>
        </td>
        <td>
          <small className="text-muted">
            {new Date(booking.created_at).toLocaleDateString()}
          </small>
        </td>
        <td>{renderActionButtons(booking)}</td>
      </tr>
    )),
    [bookings, selectedBookings, onBookingSelect, getStatusBadge, renderActionButtons]
  );
  
  // Memoized pagination controls
  const _paginationControls = useMemo(() => {
    const _pages = [];
    const _maxVisiblePages = 5;
    const _startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const _endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          size="sm"
          variant={i === currentPage ? 'primary' : 'outline-primary'}
          onClick={() => onPageChange(i)}
          className="me-1"
        >
          {i}
        </Button>
      );
    }
    
    return (
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <Button
            size="sm"
            variant="outline-secondary"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="me-2"
          >
            ← Previous
          </Button>
          {pages}
          <Button
            size="sm"
            variant="outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="ms-2"
          >
            Next →
          </Button>
        </div>
        <small className="text-muted">
          Page {currentPage} of {totalPages} ({bookings.length} bookings)
        </small>
      </div>
    );
  }, [currentPage, totalPages, bookings.length, onPageChange]);
  
  // Memoized bulk action controls
  const _bulkActionControls = useMemo(() => {
    if (selectedBookings.length === 0) return null;
    
    return (
      <div className="bulk-actions mb-3 p-3 bg-light rounded">
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <strong>{selectedBookings.length}</strong> booking{selectedBookings.length !== 1 ? 's' : ''} selected
          </span>
          <div>
            <Button
              size="sm"
              variant="success"
              onClick={() => onBulkAction('confirm', selectedBookings)}
              className="me-2"
            >
              Bulk Confirm
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onBulkAction('reject', selectedBookings)}
              className="me-2"
            >
              Bulk Reject
            </Button>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => onBookingSelect(null)} // Clear selection
            >
              Clear Selection
            </Button>
          </div>
        </div>
      </div>
    );
  }, [selectedBookings, onBulkAction, onBookingSelect]);
  
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error Loading Bookings</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }
  
  return (
    <Card className="bookings-list-component">
      <Card.Header>
        <h6 className="mb-0">📋 Bookings List</h6>
      </Card.Header>
      
      <Card.Body className="p-0">
        {bulkActionControls}
        
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted">No bookings found</h5>
            <p className="text-muted">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '50px' }}>
                      <input
                        type="checkbox"
                        checked={selectedBookings.length === bookings.length && bookings.length > 0}
                        onChange={() => {
                          if (selectedBookings.length === bookings.length) {
                            onBookingSelect(null); // Clear all
                          } else {
                            // Select all
                            bookings.forEach(booking => onBookingSelect(booking.id));
                          }
                        }}
                        className="form-check-input"
                      />
                    </th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Created</th>
                    <th style={{ width: '150px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows}
                </tbody>
              </Table>
            </div>
            
            <div className="p-3 border-top">
              {paginationControls}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
});

BookingsList.displayName = 'BookingsList';

export default BookingsList;
