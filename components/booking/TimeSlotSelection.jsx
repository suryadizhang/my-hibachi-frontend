// Time Slot Selection Component - Modular and Optimized
// Handles only time slot selection with real-time updates

import React, { memo, useCallback, useMemo, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import { useBooking } from '../context/BookingContext';
import { API_BASE } from '../../lib/config/api';
import './TimeSlotSelection.css';

const TimeSlotSelection = memo(() => {
  const { 
    selectedDate,
    selectedTime,
    availability,
    isLoading,
    error,
    actions,
    realTime
  } = useBooking();
  
  const timeSlots = ['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];
  
  // Get availability for selected date
  const dateAvailability = useMemo(() => {
    if (!selectedDate) return {};
    const dateStr = selectedDate.toISOString().split('T')[0];
    return availability[dateStr] || {};
  }, [selectedDate, availability]);
  
  // Fetch availability when date changes
  useEffect(() => {
    if (!selectedDate) return;
    
    const fetchAvailability = async () => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Check cache first
      const cached = actions.cache?.getCachedData(`availability_${dateStr}`);
      if (cached) return;
      
      try {
        actions.setLoading(true);
        const response = await fetch(`${API_BASE}/api/booking/availability?date=${dateStr}`);
        
        if (response.ok) {
          const data = await response.json();
          actions.setAvailability(dateStr, data);
        } else {
          throw new Error('Failed to fetch availability');
        }
      } catch (err) {
        actions.setError('Failed to load availability. Please try again.');
      } finally {
        actions.setLoading(false);
      }
    };
    
    fetchAvailability();
  }, [selectedDate, actions]);
  
  // Handle time slot selection
  const handleTimeSlotSelect = useCallback((timeSlot) => {
    const slotInfo = dateAvailability[timeSlot];
    
    if (slotInfo?.status === 'booked') {
      actions.setError('This time slot is fully booked. Please select another time.');
      return;
    }
    
    actions.setSelectedTime(timeSlot);
    actions.clearError();
  }, [dateAvailability, actions]);
  
  // Memoized slot status helper
  const getSlotStatus = useCallback((timeSlot) => {
    const slotInfo = dateAvailability[timeSlot];
    return slotInfo?.status || 'available';
  }, [dateAvailability]);
  
  // Memoized slot count helper
  const getSlotCount = useCallback((timeSlot) => {
    const slotInfo = dateAvailability[timeSlot];
    return slotInfo?.count || 0;
  }, [dateAvailability]);
  
  // Memoized button variant helper
  const getButtonVariant = useCallback((timeSlot) => {
    const status = getSlotStatus(timeSlot);
    const isSelected = selectedTime === timeSlot;
    
    if (isSelected) return 'primary';
    if (status === 'booked') return 'danger';
    if (status === 'waiting') return 'warning';
    return 'outline-primary';
  }, [getSlotStatus, selectedTime]);
  
  // Memoized status badge
  const getStatusBadge = useCallback((timeSlot) => {
    const status = getSlotStatus(timeSlot);
    const count = getSlotCount(timeSlot);
    
    switch (status) {
      case 'available':
        return <Badge bg="success">Available</Badge>;
      case 'waiting':
        return <Badge bg="warning">1 booking</Badge>;
      case 'booked':
        return <Badge bg="danger">Fully booked</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  }, [getSlotStatus, getSlotCount]);
  
  if (!selectedDate) {
    return (
      <Card className="mb-4 time-slot-card disabled">
        <Card.Header>
          <h5 className="mb-0">🕐 Select Time</h5>
        </Card.Header>
        <Card.Body className="text-center text-muted">
          <p>Please select a date first</p>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card className="mb-4 time-slot-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">🕐 Select Time</h5>
        <small className="text-muted">
          {selectedDate.toLocaleDateString()}
        </small>
      </Card.Header>
      
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        {/* Real-time update notification */}
        {realTime.lastUpdate && realTime.lastUpdate.date === selectedDate.toISOString().split('T')[0] && (
          <Alert variant="info" className="mb-3 real-time-alert">
            <div className="d-flex align-items-center">
              <span className="me-2">✨</span>
              <div>
                <strong>Live Update:</strong> {realTime.lastUpdate.timeSlot} is now {realTime.lastUpdate.status}
                <br />
                <small>{new Date(realTime.lastUpdate.timestamp).toLocaleTimeString()}</small>
              </div>
            </div>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading time slots...</span>
            </div>
            <p className="mt-2 text-muted">Loading available times...</p>
          </div>
        ) : (
          <Row>
            {timeSlots.map((timeSlot) => {
              const status = getSlotStatus(timeSlot);
              const isSelected = selectedTime === timeSlot;
              const isDisabled = status === 'booked';
              
              return (
                <Col md={6} className="mb-3" key={timeSlot}>
                  <div className="time-slot-option">
                    <Button
                      variant={getButtonVariant(timeSlot)}
                      size="lg"
                      className={`w-100 time-slot-button ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => handleTimeSlotSelect(timeSlot)}
                      disabled={isDisabled || isLoading}
                    >
                      <div className="time-slot-content">
                        <div className="time-text">{timeSlot}</div>
                        <div className="status-badge">
                          {getStatusBadge(timeSlot)}
                        </div>
                      </div>
                    </Button>
                    
                    {status === 'waiting' && (
                      <small className="text-muted d-block mt-1 text-center">
                        1 spot remaining
                      </small>
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
        
        {selectedTime && (
          <div className="selected-time-info mt-3">
            <Alert variant="success">
              <strong>Selected Time:</strong> {selectedTime} on {selectedDate.toLocaleDateString()}
            </Alert>
          </div>
        )}
        
        {/* Legend */}
        <div className="availability-legend mt-3">
          <small className="text-muted">Legend:</small>
          <div className="d-flex flex-wrap gap-2 mt-1">
            <span className="legend-item">
              <Badge bg="success">Available</Badge> - 2 spots open
            </span>
            <span className="legend-item">
              <Badge bg="warning">1 booking</Badge> - 1 spot remaining
            </span>
            <span className="legend-item">
              <Badge bg="danger">Fully booked</Badge> - No spots available
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
});

TimeSlotSelection.displayName = 'TimeSlotSelection';

export default TimeSlotSelection;
