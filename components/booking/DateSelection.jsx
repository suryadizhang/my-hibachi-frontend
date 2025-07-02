// Date Selection Component - Modular and Optimized
// Handles only date selection with real-time availability

import React, { memo, useCallback, useMemo } from 'react';
import { Card, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useBooking } from '../context/BookingContext';
import SmartDateSuggestions from '../SmartDateSuggestions';
import './DateSelection.css';

const DateSelection = memo(() => {
  const { 
    selectedDate, 
    availability, 
    isLoading, 
    error, 
    actions,
    realTime 
  } = useBooking();
  
  // Memoized date validation
  const isDateAvailable = useCallback((date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dateAvailability = availability[dateStr];
    
    if (!dateAvailability) return true; // Unknown dates are considered available
    
    // Check if any time slot is available
    return Object.values(dateAvailability).some(slot => slot.status !== 'booked');
  }, [availability]);
  
  // Memoized date filtering
  const filterDate = useCallback((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Don't allow past dates
    if (date < today) return false;
    
    // Don't allow more than 60 days in advance
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    if (date > maxDate) return false;
    
    return isDateAvailable(date);
  }, [isDateAvailable]);
  
  // Handle date selection
  const handleDateChange = useCallback((date) => {
    actions.setSelectedDate(date);
    actions.clearError();
  }, [actions]);
  
  // Memoized availability status for selected date
  const selectedDateAvailability = useMemo(() => {
    if (!selectedDate) return null;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    return availability[dateStr];
  }, [selectedDate, availability]);
  
  // Memoized date picker props
  const datePickerProps = useMemo(() => ({
    selected: selectedDate,
    onChange: handleDateChange,
    filterDate: filterDate,
    minDate: new Date(),
    maxDate: (() => {
      const max = new Date();
      max.setDate(max.getDate() + 60);
      return max;
    })(),
    dateFormat: "MMMM d, yyyy",
    placeholderText: "Select a date",
    className: "form-control",
    disabled: isLoading,
    inline: true,
    showMonthDropdown: false,
    showYearDropdown: false,
    disabledKeyboardNavigation: false
  }), [selectedDate, handleDateChange, filterDate, isLoading]);
  
  // Fallback native date input props
  const nativeDateProps = useMemo(() => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    
    return {
      type: "date",
      value: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      min: today.toISOString().split('T')[0],
      max: maxDate.toISOString().split('T')[0],
      onChange: (e) => {
        if (e.target.value) {
          handleDateChange(new Date(e.target.value));
        }
      },
      disabled: isLoading,
      className: "form-control"
    };
  }, [selectedDate, handleDateChange, isLoading]);
  
  return (
    <Card className="mb-4 date-selection-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">📅 Select Date</h5>
        {realTime.isConnected && (
          <small className="text-success">
            🟢 Live Updates Active
          </small>
        )}
      </Card.Header>
      
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        {/* Smart Date Suggestions */}
        <SmartDateSuggestions 
          onDateSelect={handleDateChange}
          availability={availability}
          isLoading={isLoading}
        />
        
        {/* Date Picker */}
        <div className="date-picker-container mb-3">
          {/* Use native date picker by default - more reliable */}
          <div className="native-date-picker mb-3">
            <label htmlFor="date-select" className="form-label">
              <strong>Select Date:</strong>
            </label>
            <input 
              id="date-select"
              {...nativeDateProps} 
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '16px',
                width: '100%'
              }}
            />
          </div>
          
          {/* Advanced calendar toggle */}
          <details className="advanced-calendar">
            <summary className="text-primary" style={{ cursor: 'pointer' }}>
              📅 Use Advanced Calendar
            </summary>
            <div className="calendar-override mt-2" style={{
              background: 'white',
              padding: '15px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <DatePicker {...datePickerProps} />
            </div>
          </details>
        </div>
        
        {/* Selected Date Info */}
        {selectedDate && (
          <div className="selected-date-info">
            <h6>Selected: {selectedDate.toLocaleDateString()}</h6>
            
            {selectedDateAvailability && (
              <div className="availability-preview">
                <small className="text-muted">Available times:</small>
                <div className="time-slots-preview">
                  {Object.entries(selectedDateAvailability).map(([time, slot]) => (
                    <span 
                      key={time}
                      className={`time-preview ${slot.status}`}
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {realTime.lastUpdate && realTime.lastUpdate.date === selectedDate.toISOString().split('T')[0] && (
              <div className="real-time-update">
                <small className="text-info">
                  ✨ Updated {new Date(realTime.lastUpdate.timestamp).toLocaleTimeString()}
                </small>
              </div>
            )}
          </div>
        )}
        
        {isLoading && (
          <div className="text-center">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <small className="text-muted ms-2">Checking availability...</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
});

DateSelection.displayName = 'DateSelection';

export default DateSelection;
