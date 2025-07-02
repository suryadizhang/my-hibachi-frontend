"use client";
// Simple WebSocket Test Hook
import { useState, useEffect, useRef } from 'react';

export const useSimpleWebSocketTest = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    console.log('Starting WebSocket test...');
    
    try {
      const wsUrl = 'ws://localhost:8003/ws/booking-updates';
      console.log('Attempting to connect to:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully!');
        setIsConnected(true);
        
        // Send a test message
        const testMessage = {
          type: 'subscribe',
          date: '2025-07-01'
        };
        ws.send(JSON.stringify(testMessage));
        console.log('📤 Sent test message:', testMessage);
      };

      ws.onmessage = (event) => {
        console.log('📨 Received message:', event.data);
        setMessages(prev => [...prev, { text: event.data, timestamp: new Date() }]);
      };

      ws.onclose = (event) => {
        console.log('❌ WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        console.error('🚨 WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('💥 Failed to create WebSocket:', error);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { isConnected, messages };
};
