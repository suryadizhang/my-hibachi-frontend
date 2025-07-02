import React, { memo, useCallback } from 'react';
import { Button } from 'react-bootstrap';

/**
 * Optimized Booking Card Component with React.memo
 * Prevents unnecessary re-renders when booking data hasn't changed
 */
const OptimizedBookingCard = memo(({ 
  booking, 
  onEdit, 
  onDelete, 
  onCancel, 
  onComplete,
  userRole,
  formatDate,
  formatTime 
}) => {
  // Memoized event handlers to prevent function recreation
  const handleEdit = useCallback(() => {
    onEdit(booking);
  }, [onEdit, booking]);

  const handleDelete = useCallback(() => {
    onDelete(booking);
  }, [onDelete, booking]);

  const handleCancel = useCallback(() => {
    onCancel(booking);
  }, [onCancel, booking]);

  const handleComplete = useCallback(() => {
    onComplete(booking);
  }, [onComplete, booking]);

  // Memoized status badge class
  const getStatusBadgeClass = useCallback((status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed': return 'badge bg-success';
      case 'pending': return 'badge bg-warning text-dark';
      case 'cancelled': return 'badge bg-danger';
      case 'completed': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  }, []);

  // Memoized deposit status
  const getDepositStatus = useCallback((booking) => {
    if (booking.deposit_paid) return 'Paid';
    if (booking.deposit_amount > 0) return 'Pending';
    return 'Not Required';
  }, []);

  return (
    <div className="booking-card border rounded p-3 mb-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h5 className="mb-1">{booking.name || booking.customer_name}</h5>
        <span className={getStatusBadgeClass(booking.status)}>
          {booking.status || 'Pending'}
        </span>
      </div>
      
      <div className="booking-details">
        <div className="row">
          <div className="col-md-6">
            <p className="mb-1">
              <strong>Date:</strong> {formatDate ? formatDate(booking.date) : booking.date}
            </p>
            <p className="mb-1">
              <strong>Time:</strong> {formatTime ? formatTime(booking.time) : booking.time}
            </p>
            <p className="mb-1">
              <strong>Party Size:</strong> {booking.party_size || booking.guests}
            </p>
          </div>
          <div className="col-md-6">
            <p className="mb-1">
              <strong>Phone:</strong> {booking.phone}
            </p>
            <p className="mb-1">
              <strong>Email:</strong> {booking.email}
            </p>
            {booking.deposit_amount && (
              <p className="mb-1">
                <strong>Deposit:</strong> ${booking.deposit_amount} - {getDepositStatus(booking)}
              </p>
            )}
          </div>
        </div>
        
        {booking.special_requests && (
          <div className="mt-2">
            <strong>Special Requests:</strong>
            <p className="text-muted">{booking.special_requests}</p>
          </div>
        )}
      </div>

      <div className="booking-actions mt-3 d-flex gap-2">
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={handleEdit}
          className="flex-fill"
        >
          Edit
        </Button>
        
        {booking.status !== 'completed' && (
          <Button 
            variant="outline-success" 
            size="sm" 
            onClick={handleComplete}
            className="flex-fill"
          >
            Complete
          </Button>
        )}
        
        {booking.status !== 'cancelled' && (
          <Button 
            variant="outline-warning" 
            size="sm" 
            onClick={handleCancel}
            className="flex-fill"
          >
            Cancel
          </Button>
        )}
        
        {userRole === 'superadmin' && (
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={handleDelete}
            className="flex-fill"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for optimal re-rendering
  const prevBooking = prevProps.booking;
  const nextBooking = nextProps.booking;
  
  // Only re-render if booking data actually changed
  return (
    prevBooking.id === nextBooking.id &&
    prevBooking.name === nextBooking.name &&
    prevBooking.customer_name === nextBooking.customer_name &&
    prevBooking.date === nextBooking.date &&
    prevBooking.time === nextBooking.time &&
    prevBooking.party_size === nextBooking.party_size &&
    prevBooking.guests === nextBooking.guests &&
    prevBooking.phone === nextBooking.phone &&
    prevBooking.email === nextBooking.email &&
    prevBooking.status === nextBooking.status &&
    prevBooking.deposit_paid === nextBooking.deposit_paid &&
    prevBooking.deposit_amount === nextBooking.deposit_amount &&
    prevBooking.special_requests === nextBooking.special_requests &&
    prevProps.userRole === nextProps.userRole
  );
});

OptimizedBookingCard.displayName = 'OptimizedBookingCard';

export default OptimizedBookingCard;
