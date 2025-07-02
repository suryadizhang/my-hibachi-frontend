import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Badge, Button, Dropdown, Alert, ProgressBar, Modal, ListGroup } from 'react-bootstrap';
import { useWebSocket } from '../../hooks/useWebSocket';

/**
 * 🔔 SMART NOTIFICATION SYSTEM
 * Intelligent alerts and notifications with AI-powered prioritization
 * 
 * COMPREHENSIVE NOTIFICATION TYPES FOR HIBACHI RESTAURANT:
 * 
 * 🚨 CRITICAL ALERTS (Priority 1):
 * - System failures, payment processing errors, security breaches
 * - Kitchen equipment malfunctions, fire safety alerts
 * - Data corruption, backup failures
 * 
 * ⚠️ URGENT BUSINESS (Priority 2):
 * - VIP customer issues, capacity warnings, staff shortages
 * - Large party cancellations, equipment breakdowns
 * - No-show spikes, health department visits
 * 
 * 📊 OPERATIONAL (Priority 3):
 * - Booking trends, revenue milestones, schedule conflicts
 * - Customer feedback, inventory alerts, maintenance needs
 * - Performance metrics, wait time issues
 * 
 * 💡 INSIGHTS (Priority 4):
 * - Revenue opportunities, customer behavior patterns
 * - Marketing suggestions, optimization tips
 * - Seasonal trends, competitive insights
 * 
 * 🔄 SYSTEM (Priority 5):
 * - Software updates, backup completions, routine maintenance
 * - Performance reports, data exports
 */
const _SmartNotificationSystem = memo(({ 
  notifications: externalNotifications = [],
  onNotificationAction,
  enableRealTime = true,
  maxNotifications = 20,
  autoMarkRead = false
}) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [settings, setSettings] = useState({
    enableSound: true,
    enableDesktop: true,
    autoRefresh: true,
    groupByType: true
  });

  // WebSocket connection for real-time notifications
  const [isConnected, socketRef] = useWebSocket(
    enableRealTime ? 'ws://localhost:8000/ws/admin/notifications' : null
  );

  // Comprehensive notification types with intelligent categorization
  const _notificationTypes = useMemo(() => ({
    // 🚨 CRITICAL ALERTS (Priority: 1)
    'system_down': {
      priority: 1, category: 'critical', icon: '🚨', color: '#dc3545',
      title: 'System Critical', description: 'Requires immediate attention'
    },
    'payment_failure': {
      priority: 1, category: 'critical', icon: '💳', color: '#dc3545',
      title: 'Payment Failed', description: 'Payment processing error'
    },
    'fire_safety_alert': {
      priority: 1, category: 'critical', icon: '🔥', color: '#dc3545',
      title: 'Fire Safety Alert', description: 'Emergency safety issue'
    },
    'security_breach': {
      priority: 1, category: 'critical', icon: '🔒', color: '#dc3545',
      title: 'Security Alert', description: 'Suspicious activity detected'
    },
    'data_corruption': {
      priority: 1, category: 'critical', icon: '🗂️', color: '#dc3545',
      title: 'Data Issue', description: 'Database integrity problem'
    },

    // ⚠️ URGENT BUSINESS (Priority: 2)
    'capacity_warning': {
      priority: 2, category: 'urgent', icon: '⚠️', color: '#fd7e14',
      title: 'Capacity Alert', description: 'Approaching booking limits'
    },
    'vip_customer_issue': {
      priority: 2, category: 'urgent', icon: '⭐', color: '#fd7e14',
      title: 'VIP Customer', description: 'VIP customer needs attention'
    },
    'staff_shortage': {
      priority: 2, category: 'urgent', icon: '👥', color: '#fd7e14',
      title: 'Staffing Alert', description: 'Insufficient staff scheduled'
    },
    'large_party_cancellation': {
      priority: 2, category: 'urgent', icon: '👨‍👩‍👧‍👦', color: '#fd7e14',
      title: 'Large Party Cancelled', description: 'Significant revenue impact'
    },
    'equipment_failure': {
      priority: 2, category: 'urgent', icon: '🔧', color: '#fd7e14',
      title: 'Equipment Issue', description: 'Kitchen equipment malfunction'
    },
    'no_show_spike': {
      priority: 2, category: 'urgent', icon: '🚫', color: '#fd7e14',
      title: 'No-Show Alert', description: 'Unusual no-show pattern detected'
    },
    'health_inspection': {
      priority: 2, category: 'urgent', icon: '🏥', color: '#fd7e14',
      title: 'Health Inspector', description: 'Unexpected health department visit'
    },

    // 📊 OPERATIONAL (Priority: 3)
    'booking_trend': {
      priority: 3, category: 'operational', icon: '📈', color: '#0d6efd',
      title: 'Booking Trend', description: 'Booking pattern analysis'
    },
    'revenue_milestone': {
      priority: 3, category: 'operational', icon: '💰', color: '#198754',
      title: 'Revenue Milestone', description: 'Financial target achieved'
    },
    'customer_feedback': {
      priority: 3, category: 'operational', icon: '💬', color: '#0d6efd',
      title: 'Customer Feedback', description: 'New review or complaint'
    },
    'schedule_conflict': {
      priority: 3, category: 'operational', icon: '📅', color: '#ffc107',
      title: 'Schedule Conflict', description: 'Overlapping bookings detected'
    },
    'inventory_low': {
      priority: 3, category: 'operational', icon: '📦', color: '#ffc107',
      title: 'Inventory Alert', description: 'Low stock levels detected'
    },
    'wait_time_high': {
      priority: 3, category: 'operational', icon: '⏰', color: '#ffc107',
      title: 'Long Wait Times', description: 'Customers experiencing delays'
    },
    'chef_performance': {
      priority: 3, category: 'operational', icon: '👨‍🍳', color: '#0d6efd',
      title: 'Chef Performance', description: 'Outstanding chef recognition'
    },

    // 💡 INSIGHTS (Priority: 4)
    'revenue_opportunity': {
      priority: 4, category: 'insights', icon: '💡', color: '#20c997',
      title: 'Revenue Opportunity', description: 'Optimization suggestion'
    },
    'customer_behavior': {
      priority: 4, category: 'insights', icon: '🧠', color: '#20c997',
      title: 'Customer Insight', description: 'Behavioral pattern detected'
    },
    'performance_tip': {
      priority: 4, category: 'insights', icon: '🎯', color: '#20c997',
      title: 'Performance Tip', description: 'Efficiency improvement'
    },
    'marketing_opportunity': {
      priority: 4, category: 'insights', icon: '📢', color: '#20c997',
      title: 'Marketing Opportunity', description: 'Promotional suggestion'
    },
    'seasonal_trend': {
      priority: 4, category: 'insights', icon: '🌸', color: '#20c997',
      title: 'Seasonal Trend', description: 'Seasonal booking pattern'
    },
    'menu_optimization': {
      priority: 4, category: 'insights', icon: '🍽️', color: '#20c997',
      title: 'Menu Optimization', description: 'Menu performance insight'
    },

    // 🔄 SYSTEM (Priority: 5)
    'system_update': {
      priority: 5, category: 'system', icon: '🔄', color: '#6c757d',
      title: 'System Update', description: 'Software update available'
    },
    'backup_complete': {
      priority: 5, category: 'system', icon: '💾', color: '#6c757d',
      title: 'Backup Complete', description: 'Data backup successful'
    },
    'maintenance_scheduled': {
      priority: 5, category: 'system', icon: '🛠️', color: '#6c757d',
      title: 'Maintenance Scheduled', description: 'Upcoming system maintenance'
    },
    'report_ready': {
      priority: 5, category: 'system', icon: '📊', color: '#6c757d',
      title: 'Report Ready', description: 'Monthly report generated'
    }
  }), []);

  const _markAllAsRead = useCallback(async () => {
    try {
      await fetch('/api/admin/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  }, []);

  const _getPriorityColor = useCallback((priority) => {
    const _colors = {
      'high': 'danger',
      'medium': 'warning', 
      'low': 'info'
    };
    return colors[priority] || 'secondary';
  }, []);

  const _getPriorityIcon = useCallback((priority) => {
    const _icons = {
      'high': '🚨',
      'medium': '⚠️',
      'low': 'ℹ️'
    };
    return icons[priority] || '📋';
  }, []);

  const _getNotificationIcon = useCallback((type) => {
    const _icons = {
      'new_booking': '📅',
      'cancellation': '❌',
      'payment_issue': '💳',
      'system_alert': '⚙️',
      'review_alert': '⭐',
      'waitlist_update': '⏳'
    };
    return icons[type] || '📬';
  }, []);

  const _handleNotificationClick = useCallback((notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    
    if (!notification.read) {
      markAsRead(notification.id);
    }
  }, [markAsRead]);

  return (
    <>
      <Card className="smart-notification-system">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <span className="emoji-visible">🔔</span>
            Smart Notifications
            {unreadCount > 0 && (
              <Badge bg="danger" className="ms-2">
                {unreadCount}
              </Badge>
            )}
          </h5>
          {unreadCount > 0 && (
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={markAllAsRead}
            >
              Mark All Read
            </Button>
          )}
        </Card.Header>
        <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Alert variant="info" className="text-center">
              <span className="emoji-visible">📭</span>
              No notifications at this time
            </Alert>
          ) : (
            <ListGroup variant="flush">
              {notifications.slice(0, 10).map((notification) => (
                <ListGroup.Item 
                  key={notification.id}
                  className={`notification-item cursor-pointer ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="d-flex align-items-start">
                    <div className="notification-icon me-3">
                      <span className="emoji-visible">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="notification-content flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="notification-title mb-1">
                          {notification.title}
                          {!notification.read && (
                            <Badge bg="primary" className="ms-2 small">NEW</Badge>
                          )}
                        </h6>
                        <div className="notification-priority">
                          <Badge bg={getPriorityColor(notification.priority)}>
                            {getPriorityIcon(notification.priority)} {notification.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <p className="notification-message text-muted mb-1">
                        {notification.message}
                      </p>
                      <small className="notification-time text-muted">
                        {new Date(notification.created_at).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Notification Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedNotification && (
              <>
                <span className="emoji-visible me-2">
                  {getNotificationIcon(selectedNotification.type)}
                </span>
                {selectedNotification.title}
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotification && (
            <div>
              <div className="mb-3">
                <Badge bg={getPriorityColor(selectedNotification.priority)} className="me-2">
                  {getPriorityIcon(selectedNotification.priority)} {selectedNotification.priority.toUpperCase()}
                </Badge>
                <small className="text-muted">
                  {new Date(selectedNotification.created_at).toLocaleString()}
                </small>
              </div>
              <p>{selectedNotification.message}</p>
              {selectedNotification.details && (
                <div className="notification-details">
                  <h6>Details:</h6>
                  <pre className="bg-light p-3 rounded">
                    {JSON.stringify(selectedNotification.details, null, 2)}
                  </pre>
                </div>
              )}
              {selectedNotification.actions && (
                <div className="notification-actions mt-3">
                  <h6>Available Actions:</h6>
                  <div className="d-flex gap-2">
                    {selectedNotification.actions.map((action, index) => (
                      <Button 
                        key={index}
                        variant={action.variant || 'primary'}
                        size="sm"
                        onClick={() => {
                          // Handle action
                          console.log('Action clicked:', action);
                          setShowModal(false);
                        }}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

_SmartNotificationSystem.displayName = 'SmartNotificationSystem';

// Properly assign and export the component
const SmartNotificationSystem = _SmartNotificationSystem;
export default SmartNotificationSystem;

