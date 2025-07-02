// Real-time Update Notifications Component
// Displays real-time booking updates and conflict notifications

import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import './RealTimeNotifications.css';

const RealTimeNotifications = ({ 
  notifications, 
  onClearNotification, 
  onClearAll,
  isConnected 
}) => {
  if (notifications.length === 0) {
    return null;
  }

  const getAlertVariant = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'info';
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="real-time-notifications">
      {/* Connection Status */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        <span className="status-indicator"></span>
        <small>
          {isConnected ? 'Live updates active' : 'Live updates unavailable'}
        </small>
      </div>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            variant={getAlertVariant(notification.type)}
            className="notification-alert"
            dismissible
            onClose={() => onClearNotification(notification.id)}
          >
            <div className="notification-content">
              <span className="notification-icon">
                {getIconForType(notification.type)}
              </span>
              <div className="notification-text">
                <div className="notification-message">
                  {notification.message}
                </div>
                <small className="notification-time">
                  {notification.timestamp.toLocaleTimeString()}
                </small>
              </div>
            </div>
          </Alert>
        ))}
        
        {/* Clear All Button */}
        {notifications.length > 1 && (
          <div className="clear-all-container">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={onClearAll}
              className="clear-all-btn"
            >
              Clear All ({notifications.length})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeNotifications;
