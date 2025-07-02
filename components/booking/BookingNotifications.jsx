// Booking Notifications Component - Real-time updates and alerts
import React, { memo, useCallback } from 'react';
import { Alert, Badge, Button, Toast, ToastContainer } from 'react-bootstrap';
import { useBooking } from '../context/BookingContext';
import './BookingNotifications.css';

const BookingNotifications = memo(() => {
  const { 
    notifications, 
    realTime, 
    actions,
    error,
    isLoading 
  } = useBooking();

  const handleDismissNotification = useCallback((id) => {
    actions.dismissNotification(id);
  }, [actions]);

  const handleClearAllNotifications = useCallback(() => {
    actions.clearAllNotifications();
  }, [actions]);

  const getNotificationVariant = (type) => {
    switch (type) {
      case 'booking_confirmed':
      case 'availability_opened':
        return 'success';
      case 'booking_cancelled':
      case 'slot_unavailable':
        return 'danger';
      case 'slot_limited':
      case 'deposit_reminder':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return '✅';
      case 'booking_cancelled':
        return '❌';
      case 'availability_opened':
        return '🎉';
      case 'slot_unavailable':
        return '🚫';
      case 'slot_limited':
        return '⚠️';
      case 'deposit_reminder':
        return '💰';
      default:
        return 'ℹ️';
    }
  };

  if (!notifications.length && !error && !realTime.isConnected) {
    return null;
  }

  return (
    <div className="booking-notifications">
      {/* Connection Status */}
      <div className="connection-status">
        <Badge 
          bg={realTime.isConnected ? 'success' : 'danger'}
          className="connection-badge"
        >
          <span className="connection-icon emoji-visible">
            {realTime.isConnected ? '🟢' : '🔴'}
          </span>
          {realTime.isConnected ? 'Live Updates Active' : 'Connection Lost'}
        </Badge>
        
        {/* WebSocket Connection Status */}
        {realTime.websocket && (
          <Badge 
            bg={realTime.websocket.connected ? 'success' : 'warning'}
            className="websocket-badge ms-2"
          >
            <span className="connection-icon emoji-visible">
              {realTime.websocket.connected ? '⚡' : '⏸️'}
            </span>
            WebSocket {realTime.websocket.connected ? 'Connected' : 'Disconnected'}
          </Badge>
        )}
        
        {realTime.lastUpdate && (
          <small className="last-update">
            Last update: {new Date(realTime.lastUpdate).toLocaleTimeString()}
          </small>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="danger" className="error-alert">
          <div className="alert-content">
            <span className="alert-icon emoji-visible">❌</span>
            <div className="alert-text">
              <strong>Error:</strong> {error}
            </div>
          </div>
        </Alert>
      )}

      {/* Notifications List */}
      {notifications.length > 0 && (
        <div className="notifications-container">
          <div className="notifications-header">
            <h6 className="notifications-title">
              <span className="emoji-visible">🔔</span>
              Updates ({notifications.length})
            </h6>
            {notifications.length > 1 && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleClearAllNotifications}
                className="clear-all-btn"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.map((notification) => (
              <Alert
                key={notification.id}
                variant={getNotificationVariant(notification.type)}
                dismissible
                onClose={() => handleDismissNotification(notification.id)}
                className="notification-item"
              >
                <div className="notification-content">
                  <span className="notification-icon emoji-visible">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="notification-text">
                    <div className="notification-message">
                      {notification.message}
                      {notification.source === 'websocket' && (
                        <Badge bg="info" className="ms-2 source-badge">
                          <span className="emoji-visible">⚡</span> Real-time
                        </Badge>
                      )}
                    </div>
                    {notification.timestamp && (
                      <small className="notification-time">
                        {new Date(notification.timestamp).toLocaleString()}
                      </small>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notifications for Real-time Updates */}
      <ToastContainer position="bottom-end" className="toast-container">
        {notifications
          .filter(n => n.isToast && !n.dismissed)
          .slice(-3) // Show only latest 3 toasts
          .map((notification) => (
            <Toast
              key={`toast-${notification.id}`}
              onClose={() => handleDismissNotification(notification.id)}
              show={true}
              delay={notification.autoHide !== false ? 5000 : null}
              autohide={notification.autoHide !== false}
              className="notification-toast"
            >
              <Toast.Header>
                <span className="toast-icon emoji-visible me-2">
                  {getNotificationIcon(notification.type)}
                </span>
                <strong className="me-auto">Booking Update</strong>
                <small className="text-muted">
                  {notification.timestamp && 
                    new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
                      .format(
                        Math.round((new Date(notification.timestamp) - new Date()) / 60000),
                        'minute'
                      )
                  }
                </small>
              </Toast.Header>
              <Toast.Body>
                {notification.message}
              </Toast.Body>
            </Toast>
          ))
        }
      </ToastContainer>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="loading-notification">
          <div className="loading-content">
            <div className="spinner-border spinner-border-sm text-primary" />
            <span className="loading-text">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
});

BookingNotifications.displayName = 'BookingNotifications';

export default BookingNotifications;
