// Simple WebSocket Test Page
import React from 'react';
import { useSimpleWebSocketTest } from '../components/hooks/useSimpleWebSocketTest';

export default function WebSocketTestPage() {
  const { isConnected, messages } = useSimpleWebSocketTest();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>WebSocket Connection Test</h1>
      
      <div style={{ 
        padding: '10px', 
        margin: '10px 0', 
        backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
        border: `1px solid ${isConnected ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '4px'
      }}>
        <strong>Connection Status:</strong> 
        <span style={{ color: isConnected ? 'green' : 'red' }}>
          {isConnected ? ' Connected ✅' : ' Disconnected ❌'}
        </span>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Messages Received ({messages.length})</h3>
        <div style={{ 
          border: '1px solid #ccc', 
          padding: '10px', 
          maxHeight: '300px', 
          overflow: 'auto',
          backgroundColor: '#f8f9fa'
        }}>
          {messages.length === 0 ? (
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No messages received yet...</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '5px', backgroundColor: 'white', borderRadius: '3px' }}>
                <pre style={{ margin: 0, fontSize: '12px' }}>
                  {JSON.stringify(msg, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#6c757d' }}>
        <p>This test connects to: ws://localhost:8000/ws/booking-updates</p>
        <p>Check the browser console for detailed logs.</p>
      </div>
    </div>
  );
}
