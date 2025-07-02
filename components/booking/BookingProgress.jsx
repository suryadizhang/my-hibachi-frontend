// Booking Progress Component - Shows current step and progress
import React, { memo } from 'react';
import { Card, ProgressBar, Badge } from 'react-bootstrap';
import { useBooking } from '../context/BookingContext';
import './BookingProgress.css';

const BookingProgress = memo(() => {
  const { selectedDate, selectedTime, customerInfo, currentStep } = useBooking();

  const steps = [
    {
      id: 'date',
      title: 'Select Date',
      icon: '📅',
      completed: !!selectedDate,
      required: true
    },
    {
      id: 'time',
      title: 'Choose Time',
      icon: '⏰',
      completed: !!selectedTime,
      required: true
    },
    {
      id: 'info',
      title: 'Your Details',
      icon: '👤',
      completed: !!(customerInfo.name && customerInfo.email && customerInfo.phone && customerInfo.address),
      required: true
    },
    {
      id: 'confirm',
      title: 'Confirm Booking',
      icon: '✅',
      completed: false,
      required: true
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <Card className="booking-progress-card">
      <Card.Body className="progress-body">
        {/* Progress Header */}
        <div className="progress-header">
          <h6 className="progress-title">
            <span className="emoji-visible">🎯</span>
            Booking Progress
          </h6>
          <Badge 
            bg={progressPercentage === 100 ? 'success' : 'primary'}
            className="progress-badge"
          >
            {Math.round(progressPercentage)}% Complete
          </Badge>
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          now={progressPercentage} 
          className="main-progress-bar"
          variant={progressPercentage === 100 ? 'success' : 'primary'}
          animated={progressPercentage > 0 && progressPercentage < 100}
        />

        {/* Steps List */}
        <div className="steps-container">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`step-item ${
                step.completed ? 'completed' : 
                index === currentStepIndex ? 'current' : 'pending'
              }`}
            >
              <div className="step-indicator">
                <span className="step-icon emoji-visible">
                  {step.completed ? '✅' : 
                   index === currentStepIndex ? '👉' : 
                   step.icon}
                </span>
                <div className="step-connector" />
              </div>
              
              <div className="step-content">
                <div className="step-title">{step.title}</div>
                <div className="step-status">
                  {step.completed ? (
                    <span className="status-completed">
                      <span className="emoji-visible">✓</span> Completed
                    </span>
                  ) : index === currentStepIndex ? (
                    <span className="status-current">
                      <span className="emoji-visible">▶</span> Current Step
                    </span>
                  ) : (
                    <span className="status-pending">
                      <span className="emoji-visible">⏳</span> Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Status Check */}
        <div className="status-summary">
          <div className="summary-item">
            <span className="summary-label">Date Selected:</span>
            <span className={`summary-value ${selectedDate ? 'complete' : 'incomplete'}`}>
              {selectedDate ? selectedDate.toLocaleDateString() : 'Not selected'}
            </span>
          </div>
          
          <div className="summary-item">
            <span className="summary-label">Time Slot:</span>
            <span className={`summary-value ${selectedTime ? 'complete' : 'incomplete'}`}>
              {selectedTime || 'Not selected'}
            </span>
          </div>
          
          <div className="summary-item">
            <span className="summary-label">Contact Info:</span>
            <span className={`summary-value ${customerInfo.name && customerInfo.email ? 'complete' : 'incomplete'}`}>
              {customerInfo.name && customerInfo.email ? 'Provided' : 'Missing'}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
});

BookingProgress.displayName = 'BookingProgress';

export default BookingProgress;
