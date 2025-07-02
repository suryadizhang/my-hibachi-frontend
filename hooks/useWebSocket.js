// hooks/useWebSocket.js
import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

export const useWebSocket = (bookingId = null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000;

  const connect = useCallback(() => {
    try {
      const wsUrl = bookingId ? `${WS_URL}/${bookingId}` : WS_URL;
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        
        // Send authentication or initial message if needed
        if (bookingId) {
          wsRef.current.send(JSON.stringify({
            type: 'subscribe',
            bookingId: bookingId
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          setLastMessage({ type: 'error', message: 'Invalid message format' });
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError('Failed to reconnect after multiple attempts');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error occurred');
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Failed to create connection');
    }
  }, [bookingId]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    } else {
      console.warn('WebSocket not connected, cannot send message');
      return false;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    reconnect: connect,
    disconnect
  };
};

// Custom hook for booking-specific WebSocket operations
export const useBookingWebSocket = (bookingId) => {
  const { isConnected, lastMessage, error, sendMessage, reconnect, disconnect } = useWebSocket(bookingId);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'booking_status_update':
          setBookingStatus(lastMessage.data);
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'info',
            message: `Booking status updated: ${lastMessage.data.status}`,
            timestamp: new Date()
          }]);
          break;
        
        case 'slot_availability_update':
          setAvailableSlots(lastMessage.data.slots || []);
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'info',
            message: 'Available time slots updated',
            timestamp: new Date()
          }]);
          break;
        
        case 'booking_confirmed':
          setBookingStatus(lastMessage.data);
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'success',
            message: 'Your booking has been confirmed!',
            timestamp: new Date()
          }]);
          break;
        
        case 'booking_cancelled':
          setBookingStatus(lastMessage.data);
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'warning',
            message: 'Booking has been cancelled',
            timestamp: new Date()
          }]);
          break;
        
        case 'error':
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'error',
            message: lastMessage.message || 'An error occurred',
            timestamp: new Date()
          }]);
          break;
        
        default:
          console.log('Unknown message type:', lastMessage.type);
      }
    }
  }, [lastMessage]);

  const subscribeToBooking = useCallback((id) => {
    return sendMessage({
      type: 'subscribe_booking',
      bookingId: id
    });
  }, [sendMessage]);

  const unsubscribeFromBooking = useCallback((id) => {
    return sendMessage({
      type: 'unsubscribe_booking',
      bookingId: id
    });
  }, [sendMessage]);

  const requestSlotUpdate = useCallback((date) => {
    return sendMessage({
      type: 'request_slot_update',
      date: date
    });
  }, [sendMessage]);

  const clearNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    isConnected,
    error,
    bookingStatus,
    availableSlots,
    notifications,
    subscribeToBooking,
    unsubscribeFromBooking,
    requestSlotUpdate,
    clearNotification,
    clearAllNotifications,
    reconnect,
    disconnect
  };
};
