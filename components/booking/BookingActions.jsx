// Booking Actions Component - Centralized action buttons and controls
import React, { memo, useCallback } from 'react';
import { Button, ButtonGroup, Dropdown, Card } from 'react-bootstrap';
import { useBooking } from '../context/BookingContext';
import './BookingActions.css';

const BookingActions = memo(({
  onSubmit,
  onReset,
  onSaveAsDraft,
  showAdvancedActions = false
}) => {
  const { 
    selectedDate, 
    selectedTime, 
    customerInfo, 
    isLoading, 
    currentStep,
    actions 
  } = useBooking();

  const isFormValid = useCallback(() => {
    return !!(
      selectedDate &&
      selectedTime &&
      customerInfo.name &&
      customerInfo.email &&
      customerInfo.phone &&
      customerInfo.address &&
      customerInfo.city &&
      customerInfo.zipcode &&
      customerInfo.contactPreference
    );
  }, [selectedDate, selectedTime, customerInfo]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (isFormValid() && onSubmit) {
      onSubmit();
    }
  }, [isFormValid, onSubmit]);

  const handleReset = useCallback(() => {
    actions.resetBooking();
    if (onReset) onReset();
  }, [actions, onReset]);

  const handleSaveAsDraft = useCallback(() => {
    actions.saveDraft();
    if (onSaveAsDraft) onSaveAsDraft();
  }, [actions, onSaveAsDraft]);

  const getSubmitButtonText = () => {
    if (isLoading) return 'Processing...';
    if (currentStep === 'confirm') return 'Confirm Booking';
    return 'Submit Booking';
  };

  const getSubmitButtonIcon = () => {
    if (isLoading) return null;
    if (currentStep === 'confirm') return '🎯';
    return '📅';
  };

  return (
    <Card className="booking-actions-card">
      <Card.Body className="actions-body">
        {/* Primary Actions */}
        <div className="primary-actions">
          <Button
            type="submit"
            variant="success"
            size="lg"
            disabled={!isFormValid() || isLoading}
            onClick={handleSubmit}
            className="submit-btn"
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                {getSubmitButtonText()}
              </>
            ) : (
              <>
                {getSubmitButtonIcon() && (
                  <span className="btn-icon emoji-visible me-2">
                    {getSubmitButtonIcon()}
                  </span>
                )}
                {getSubmitButtonText()}
              </>
            )}
          </Button>

          {/* Secondary Actions */}
          <ButtonGroup className="secondary-actions">
            <Button
              variant="outline-secondary"
              onClick={handleSaveAsDraft}
              disabled={isLoading}
              className="draft-btn"
            >
              <span className="btn-icon emoji-visible me-2">💾</span>
              Save as Draft
            </Button>

            <Button
              variant="outline-danger"
              onClick={handleReset}
              disabled={isLoading}
              className="reset-btn"
            >
              <span className="btn-icon emoji-visible me-2">🔄</span>
              Reset Form
            </Button>
          </ButtonGroup>
        </div>

        {/* Advanced Actions (Optional) */}
        {showAdvancedActions && (
          <div className="advanced-actions">
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-info" 
                id="advanced-actions-dropdown"
                className="advanced-dropdown"
              >
                <span className="btn-icon emoji-visible me-2">⚙️</span>
                More Options
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => actions.loadDraft()}>
                  <span className="emoji-visible me-2">📂</span>
                  Load Draft
                </Dropdown.Item>
                <Dropdown.Item onClick={() => actions.exportBooking()}>
                  <span className="emoji-visible me-2">📤</span>
                  Export Details
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => actions.requestCallback()}>
                  <span className="emoji-visible me-2">📞</span>
                  Request Callback
                </Dropdown.Item>
                <Dropdown.Item onClick={() => actions.scheduleReminder()}>
                  <span className="emoji-visible me-2">⏰</span>
                  Set Reminder
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}

        {/* Form Validation Summary */}
        <div className="validation-summary">
          <div className="validation-header">
            <span className="emoji-visible">📋</span>
            <span className="validation-title">Required Fields</span>
          </div>
          
          <div className="validation-items">
            <div className={`validation-item ${selectedDate ? 'complete' : 'incomplete'}`}>
              <span className="validation-icon emoji-visible">
                {selectedDate ? '✅' : '❌'}
              </span>
              <span className="validation-text">Date Selection</span>
            </div>
            
            <div className={`validation-item ${selectedTime ? 'complete' : 'incomplete'}`}>
              <span className="validation-icon emoji-visible">
                {selectedTime ? '✅' : '❌'}
              </span>
              <span className="validation-text">Time Slot</span>
            </div>
            
            <div className={`validation-item ${customerInfo.name && customerInfo.email ? 'complete' : 'incomplete'}`}>
              <span className="validation-icon emoji-visible">
                {customerInfo.name && customerInfo.email ? '✅' : '❌'}
              </span>
              <span className="validation-text">Contact Information</span>
            </div>
            
            <div className={`validation-item ${customerInfo.address && customerInfo.city ? 'complete' : 'incomplete'}`}>
              <span className="validation-icon emoji-visible">
                {customerInfo.address && customerInfo.city ? '✅' : '❌'}
              </span>
              <span className="validation-text">Address Details</span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="help-text">
          <p className="help-note">
            <span className="emoji-visible">💡</span>
            <strong>Note:</strong> A deposit is required within 6 hours to secure your booking.
            We'll send you payment instructions via email once your booking is confirmed.
          </p>
        </div>
      </Card.Body>
    </Card>
  );
});

BookingActions.displayName = 'BookingActions';

export default BookingActions;
