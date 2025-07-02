import React, { memo, useState, useEffect, useCallback } from 'react';
import { Badge, Card, Row, Col, Alert } from 'react-bootstrap';
import { useWebSocket } from '../../hooks/useWebSocket';

/**
 * 🔴 REAL-TIME ACTIVITY FEED
 * Live updates for admin dashboard with WebSocket integration
 */
const RealTimeActivityFeed = memo(() => {
  const [activities, setActivities] = useState([]);
  const [isConnected, socketRef] = useWebSocket('ws://localhost:8000/ws/admin');

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'activity_update') {
          setActivities(prev => [data.activity, ...prev.slice(0, 19)]); // Keep last 20
        }
      };
    }
  }, [socketRef]);

  const getActivityIcon = useCallback((type) => {
    const icons = {
      'new_booking': '📅',
      'booking_cancelled': '❌', 
      'waitlist_joined': '⏳',
      'payment_received': '💰',
      'review_submitted': '⭐',
      'user_registered': '👤'
    };
    return icons[type] || '📋';
  }, []);

  const getActivityColor = useCallback((type) => {
    const colors = {
      'new_booking': 'success',
      'booking_cancelled': 'danger',
      'waitlist_joined': 'warning', 
      'payment_received': 'success',
      'review_submitted': 'info',
      'user_registered': 'primary'
    };
    return colors[type] || 'secondary';
  }, []);

  return (
    <Card className="real-time-activity-feed">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <span className="emoji-visible">🔴</span>
          Live Activity Feed
        </h5>
        <Badge bg={isConnected ? 'success' : 'danger'}>
          {isConnected ? 'LIVE' : 'DISCONNECTED'}
        </Badge>
      </Card.Header>
      <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {activities.length === 0 ? (
          <Alert variant="info" className="text-center">
            <span className="emoji-visible">⏳</span>
            Waiting for live updates...
          </Alert>
        ) : (
          <div className="activity-list">
            {activities.map((activity, index) => (
              <div 
                key={`${activity.timestamp}-${index}`}
                className="activity-item d-flex align-items-center mb-3 p-2 bg-light rounded"
              >
                <div className="activity-icon me-3">
                  <span className="emoji-visible fs-4">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                <div className="activity-content flex-grow-1">
                  <div className="activity-title fw-bold">
                    {activity.title}
                  </div>
                  <div className="activity-description text-muted small">
                    {activity.description}
                  </div>
                  <div className="activity-time text-muted small">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <Badge bg={getActivityColor(activity.type)}>
                  {activity.type.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
});

RealTimeActivityFeed.displayName = 'RealTimeActivityFeed';
export default RealTimeActivityFeed;
