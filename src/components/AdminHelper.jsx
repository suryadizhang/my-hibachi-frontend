import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, InputGroup, FormControl, Badge } from 'react-bootstrap';
import { FaQuestionCircle, FaTimes, FaMinus, FaExpand, FaPaperPlane, FaRobot } from 'react-icons/fa';
import './AdminHelper.css';

const AdminHelper = ({ currentTab, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation based on current tab
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        type: 'bot',
        text: `🛠️ Hi! I'm your Admin Helper. I'm here to guide you through all the admin functions. ${userRole === 'superadmin' ? 'As a SuperAdmin, you have access to all features including user management.' : 'As an Admin, you can manage bookings, newsletters, and view activity logs.'}`,
        timestamp: new Date(),
        options: getTabSpecificOptions(currentTab, userRole)
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentTab, userRole]);

  const getTabSpecificOptions = (tab, role) => {
    const baseOptions = ['General Help', 'System Overview'];
    
    switch (tab) {
      case 'bookings':
        return [...baseOptions, 'Booking Management', 'Status Updates', 'Search & Filter'];
      case 'newsletter':
        return [...baseOptions, 'Newsletter Features', 'Mass Send', 'Customer Management'];
      case 'logs':
        return [...baseOptions, 'Activity Logs', 'Monitoring', 'Troubleshooting'];
      case 'super-admin':
        return role === 'superadmin' ? 
          [...baseOptions, 'User Management', 'Admin Accounts', 'Security Features'] : 
          baseOptions;
      default:
        return [...baseOptions, 'Navigation Help', 'Quick Start'];
    }
  };

  const generateResponse = (userMessage, context = {}) => {
    const message = userMessage.toLowerCase().trim();
    
    // Greeting responses
    if (message.match(/^(hi|hello|hey|help|start)/)) {
      return {
        text: "Hello! I'm here to help you navigate the admin panel. What would you like to know about?",
        options: getTabSpecificOptions(currentTab, userRole)
      };
    }

    // Booking Management Help
    if (message.includes('booking') || message.includes('reservation')) {
      if (message.includes('status') || message.includes('update') || message.includes('change')) {
        return {
          text: "📅 **Booking Status Management:**\n\n• **Update Status**: Click the status dropdown on any booking to change it\n• **Available Statuses**: Confirmed, Pending, Cancelled, Completed\n• **Automatic Emails**: Status changes trigger notification emails\n• **Cancellation**: Use 'Cancel Booking' button for cancellations with reasons\n• **Modifications**: Edit booking details directly from the booking row",
          options: ['Search Bookings', 'Booking Actions', 'Email Notifications']
        };
      } else if (message.includes('search') || message.includes('filter') || message.includes('find')) {
        return {
          text: "🔍 **Search & Filter Bookings:**\n\n• **Search Bar**: Enter customer name, email, or phone number\n• **Date Filters**: Use weekly/monthly view toggles\n• **Status Filter**: Filter by booking status\n• **Pagination**: Navigate through pages with arrow buttons\n• **Real-time Search**: Results update as you type\n• **Export**: Download filtered results as needed",
          options: ['Booking Status', 'Date Management', 'Customer Details']
        };
      } else {
        return {
          text: "📋 **Booking Management Overview:**\n\n• **View Bookings**: Switch between weekly/monthly views\n• **Booking Details**: Click any booking to see full information\n• **Update Status**: Change booking status with automatic notifications\n• **Customer Info**: Access complete customer details and history\n• **Action Buttons**: Quick access to common booking actions\n• **Activity Tracking**: All changes are logged automatically",
          options: ['Status Updates', 'Search & Filter', 'Customer Management']
        };
      }
    }

    // Newsletter Management Help
    if (message.includes('newsletter') || message.includes('email') || message.includes('customer')) {
      if (message.includes('mass') || message.includes('send') || message.includes('bulk')) {
        return {
          text: "📧 **Mass Email & Newsletter Features:**\n\n• **Compose Newsletter**: Use the rich text editor to create emails\n• **Customer Filters**: Send to specific groups (by city, name, etc.)\n• **Preview**: Always preview before sending\n• **Mass Send**: Send to all customers or filtered groups\n• **Delivery Tracking**: Monitor send status and delivery\n• **Templates**: Save common newsletter formats",
          options: ['Customer Filters', 'Email Templates', 'Delivery Status']
        };
      } else if (message.includes('filter') || message.includes('search') || message.includes('group')) {
        return {
          text: "🎯 **Customer Filtering & Management:**\n\n• **Filter by City**: Send targeted local newsletters\n• **Filter by Name**: Search for specific customers\n• **Combined Filters**: Use multiple criteria together\n• **Geographic Regions**: Target by geographic areas\n• **Booking History**: Filter by customer activity\n• **Contact Preferences**: Respect customer communication preferences",
          options: ['Mass Send', 'Customer Database', 'Geographic Targeting']
        };
      } else {
        return {
          text: "📮 **Newsletter System Overview:**\n\n• **Customer Database**: 221+ customers with complete contact info\n• **Rich Editor**: Create professional newsletters with formatting\n• **Smart Filtering**: Target specific customer groups\n• **Mass Distribution**: Send to all or filtered customers\n• **Delivery Tracking**: Monitor email delivery and engagement\n• **Template Management**: Save and reuse newsletter templates",
          options: ['Mass Send', 'Customer Filters', 'Email Templates']
        };
      }
    }

    // Activity Logs Help
    if (message.includes('log') || message.includes('activity') || message.includes('monitor')) {
      return {
        text: "📊 **Activity Logs & Monitoring:**\n\n• **Real-time Logs**: See all admin actions as they happen\n• **User Tracking**: Monitor which admin performed what actions\n• **Booking Events**: Track all booking-related activities\n• **System Events**: Monitor system operations and errors\n• **Time Stamps**: Precise timing of all activities\n• **Filtering**: Search logs by date, user, or action type",
        options: ['Log Filtering', 'User Activity', 'System Monitoring']
      };
    }

    // Super Admin Features
    if ((message.includes('super') || message.includes('user') || message.includes('admin')) && userRole === 'superadmin') {
      if (message.includes('create') || message.includes('add') || message.includes('new')) {
        return {
          text: "👥 **Admin Account Creation:**\n\n• **Create New Admin**: Use the 'Create New Admin' button\n• **Username Rules**: Must be unique, 3+ characters\n• **Password Policy**: Strong passwords required\n• **Role Assignment**: Set as 'admin' or 'superadmin'\n• **Initial Setup**: New admins receive welcome emails\n• **Account Activation**: Accounts are active immediately",
          options: ['Password Management', 'Account Security', 'User Roles']
        };
      } else if (message.includes('password') || message.includes('reset') || message.includes('security')) {
        return {
          text: "🔐 **Password & Security Management:**\n\n• **Password Reset**: Reset any admin's password\n• **Security Requirements**: Enforce strong password policies\n• **Account Lockout**: Handle locked accounts\n• **Session Management**: Monitor active admin sessions\n• **Security Logs**: Track login attempts and security events\n• **Two-Factor**: Additional security measures available",
          options: ['Account Creation', 'User Management', 'Security Policies']
        };
      } else {
        return {
          text: "⚡ **Super Admin Features:**\n\n• **User Management**: Create, edit, delete admin accounts\n• **Security Control**: Password resets and account management\n• **System Administration**: Full system access and control\n• **Audit Capabilities**: Monitor all admin activities\n• **Production Ready**: Manage production admin accounts\n• **Role Management**: Assign admin vs superadmin privileges",
          options: ['Create Admin', 'Password Management', 'Security Features']
        };
      }
    }

    // System Overview
    if (message.includes('system') || message.includes('overview') || message.includes('how')) {
      return {
        text: "🏗️ **System Overview:**\n\n• **Multi-tab Interface**: Bookings, Newsletter, Logs, Super Admin\n• **Role-based Access**: Different features for admin vs superadmin\n• **Real-time Updates**: Live data refresh and notifications\n• **Automated Workflows**: Email notifications and status updates\n• **Data Security**: Secure admin authentication and data protection\n• **Production Ready**: Fully deployed and scalable system",
        options: ['Tab Navigation', 'User Roles', 'Security Features']
      };
    }

    // Navigation Help
    if (message.includes('navigation') || message.includes('tab') || message.includes('navigate')) {
      return {
        text: "🧭 **Navigation Guide:**\n\n• **Bookings Tab**: Manage all reservations and customer bookings\n• **Newsletter Tab**: Send emails and manage customer communications\n• **Activity Logs**: Monitor system activity and admin actions\n• **Super Admin**: User management (superadmin only)\n• **Settings**: Account settings and password changes\n• **Logout**: Secure logout when finished",
        options: ['Bookings Help', 'Newsletter Help', 'Logs Help']
      };
    }

    // Quick Start Guide
    if (message.includes('quick') || message.includes('start') || message.includes('begin')) {
      return {
        text: "🚀 **Quick Start Guide:**\n\n1. **Check Bookings**: Review today's and upcoming reservations\n2. **Update Status**: Confirm or update booking statuses\n3. **Send Newsletter**: Communicate with customers via email\n4. **Monitor Logs**: Check recent system activity\n5. **Manage Users**: (SuperAdmin) Handle admin accounts\n6. **Need Help**: Use this helper anytime!",
        options: ['Bookings First Steps', 'Newsletter Basics', 'System Monitoring']
      };
    }

    // Fallback response
    return {
      text: "I'd be happy to help! I can assist with:\n\n• Booking management and status updates\n• Newsletter and customer communication\n• Activity logs and system monitoring\n• Admin account management (SuperAdmin)\n• General navigation and features\n\nWhat specific area would you like help with?",
      options: getTabSpecificOptions(currentTab, userRole)
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(inputValue, { currentTab, userRole });
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.text,
        timestamp: new Date(),
        options: response.options || []
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleOptionClick = (option) => {
    handleSendMessage_option(option);
  };

  const handleSendMessage_option = (message) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(message, { currentTab, userRole });
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.text,
        timestamp: new Date(),
        options: response.options || []
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="admin-helper-trigger">
        <Button
          variant="primary"
          className="helper-toggle-btn"
          onClick={() => setIsOpen(true)}
          title="Open Admin Helper"
        >
          <FaQuestionCircle className="me-2" />
          Admin Helper
        </Button>
      </div>
    );
  }

  return (
    <div className={`admin-helper-container ${isMinimized ? 'minimized' : ''}`}>
      <Card className="admin-helper-card">
        <Card.Header className="admin-helper-header">
          <div className="helper-header-content">
            <div className="helper-title">
              <FaRobot className="me-2" />
              Admin Helper
              <Badge bg="info" className="ms-2">{userRole}</Badge>
            </div>
            <div className="helper-controls">
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <FaExpand /> : <FaMinus />}
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <FaTimes />
              </Button>
            </div>
          </div>
        </Card.Header>

        {!isMinimized && (
          <>
            <Card.Body className="admin-helper-body">
              <div className="messages-container">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.type}`}>
                    <div className="message-content">
                      <div className="message-text">{message.text}</div>
                      {message.options && message.options.length > 0 && (
                        <div className="message-options">
                          {message.options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline-primary"
                              size="sm"
                              className="option-btn"
                              onClick={() => handleOptionClick(option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="message-timestamp">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="message bot">
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </Card.Body>

            <Card.Footer className="admin-helper-footer">
              <InputGroup>
                <FormControl
                  placeholder="Ask me about admin functions..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                />
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                >
                  <FaPaperPlane />
                </Button>
              </InputGroup>
            </Card.Footer>
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminHelper;
