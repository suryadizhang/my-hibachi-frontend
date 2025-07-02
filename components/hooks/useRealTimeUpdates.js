// Real-time Updates Hook
// Implements WebSocket connection for real-time booking updates

import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE } from '../../lib/config/api';

export const useRealTimeUpdates = (selectedDate) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updateNotifications, setUpdateNotifications] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = useRef(1000);

  // Generate WebSocket URL
  const getWsUrl = useCallback(() => {
    // Use the working backend WebSocket endpoint
    return 'ws://localhost:8000/ws/booking-updates';
  }, []);

  // Show notification to user
  const showNotification = useCallback((message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    
    setUpdateNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setUpdateNotifications(prev => 
        prev.filter(n => n.id !== notification.id)
      );
    }, 5000);
  }, []);

  // Handle WebSocket messages
  const handleMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'availability_update':
          setLastUpdate({
            type: 'availability',
            date: data.date,
            timeSlot: data.timeSlot,
            newStatus: data.status,
            timestamp: data.timestamp
          });
          
          // Show notification if it affects current date
          if (selectedDate && data.date === selectedDate.toISOString().split('T')[0]) {
            const statusText = data.status === 'available' ? 'became available' : 
                              data.status === 'booked' ? 'was just booked' : 
                              'has limited availability';
            showNotification(
              `${data.timeSlot} on ${new Date(data.date).toLocaleDateString()} ${statusText}`,
              data.status === 'available' ? 'success' : 'warning'
            );
          }
          break;
          
        case 'booking_conflict':
          setLastUpdate({
            type: 'conflict',
            date: data.date,
            timeSlot: data.timeSlot,
            timestamp: data.timestamp
          });
          
          showNotification(
            `Someone else just booked ${data.timeSlot} on ${new Date(data.date).toLocaleDateString()}. Please select another time.`,
            'error'
          );
          break;
          
        case 'waitlist_update':
          setLastUpdate({
            type: 'waitlist',
            date: data.date,
            timeSlot: data.timeSlot,
            position: data.position,
            timestamp: data.timestamp
          });
          
          if (data.slotOpened) {
            showNotification(
              `A slot opened up for ${data.timeSlot} on ${new Date(data.date).toLocaleDateString()}!`,
              'success'
            );
          }
          break;
          
        case 'system_maintenance':
          showNotification(
            'System maintenance scheduled. Please complete your booking soon.',
            'warning'
          );
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }, [selectedDate, showNotification]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const wsUrl = getWsUrl();
      console.log('Attempting to connect to WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        reconnectAttempts.current = 0;
        reconnectDelay.current = 1000;
        
        // Subscribe to updates for current date if available
        if (selectedDate) {
          const subscribeMessage = {
            type: 'subscribe',
            date: selectedDate.toISOString().split('T')[0]
          };
          console.log('Sending subscription message:', subscribeMessage);
          ws.send(JSON.stringify(subscribeMessage));
        } else {
          console.log('WebSocket connected but no date selected yet');
        }
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;
        
        // Attempt to reconnect if not a clean close
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          reconnectDelay.current = Math.min(reconnectDelay.current * 2, 30000);
          
          console.log(`Attempting to reconnect in ${reconnectDelay.current}ms (attempt ${reconnectAttempts.current})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay.current);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.warn('Max reconnection attempts reached. WebSocket will not reconnect automatically.');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error occurred:', error);
        console.error('WebSocket URL was:', wsUrl);
        console.error('WebSocket readyState:', ws.readyState);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      console.error('Attempted URL:', getWsUrl());
      setIsConnected(false);
    }
  }, [getWsUrl, handleMessage]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Component unmounting');
      wsRef.current = null;
    }
    
    setIsConnected(false);
  }, []);

  // Subscribe to date updates
  const subscribeToDate = useCallback((date) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && date) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        date: date.toISOString().split('T')[0]
      }));
    }
  }, []);

  // Send heartbeat to keep connection alive
  const sendHeartbeat = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'ping' }));
    }
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    connect();
    
    // Set up heartbeat interval
    const heartbeatInterval = setInterval(sendHeartbeat, 30000);
    
    return () => {
      clearInterval(heartbeatInterval);
      disconnect();
    };
  }, [connect, disconnect, sendHeartbeat]);

  // Subscribe to new date when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      subscribeToDate(selectedDate);
    }
  }, [selectedDate, subscribeToDate]);

  // Clear old notifications
  const clearNotification = useCallback((id) => {
    setUpdateNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setUpdateNotifications([]);
  }, []);

  return {
    isConnected,
    lastUpdate,
    updateNotifications,
    clearNotification,
    clearAllNotifications,
    reconnect: connect,
    subscribeToDate
  };
};
