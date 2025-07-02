// Simple WebSocket Test Component
import React from 'react';
import { useSimpleWebSocketTest } from './hooks/useSimpleWebSocketTest';

const WebSocketTest = () => {
  const { isConnected, messages } = useSimpleWebSocketTest();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>WebSocket Test</h3>
      <div>
        <strong>Status:</strong> 
        <span style={{ color: isConnected ? 'green' : 'red' }}>
          {isConnected ? ' Connected ✅' : ' Disconnected ❌'}
        </span>
      </div>
      <div>
        <strong>Messages received:</strong> {messages.length}
      </div>
      <div style={{ marginTop: '10px' }}>
        <h4>Message Log:</h4>
        <pre style={{ background: '#f5f5f5', padding: '10px', maxHeight: '200px', overflow: 'auto' }}>
          {messages.map((msg, index) => (
            <div key={index}>{JSON.stringify(msg, null, 2)}</div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default WebSocketTest;
