'use client';

import React from 'react';
import { useRealTimeUpdates } from '../../components/hooks/useRealTimeUpdates';

export default function RealTimeTestPage() {
  const { 
    isConnected, 
    lastUpdate, 
    updateNotifications, 
    clearNotification, 
    clearAllNotifications 
  } = useRealTimeUpdates(new Date('2025-07-01'));

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Real-time Updates Test</h1>
      
      <div style={{ 
        padding: '10px', 
        margin: '10px 0', 
        backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
        border: `1px solid ${isConnected ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '4px'
      }}>
        <strong>WebSocket Status:</strong> 
        <span style={{ color: isConnected ? 'green' : 'red' }}>
          {isConnected ? ' Connected ✅' : ' Disconnected ❌'}
        </span>
      </div>

      {lastUpdate && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0', 
          backgroundColor: '#e2e3e5',
          border: '1px solid #d6d8db',
          borderRadius: '4px'
        }}>
          <h3>Last Update:</h3>
          <pre>{JSON.stringify(lastUpdate, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Notifications ({updateNotifications.length})</h3>
        {updateNotifications.length > 0 && (
          <button onClick={clearAllNotifications} style={{ marginBottom: '10px' }}>
            Clear All
          </button>
        )}
        <div style={{ 
          border: '1px solid #ccc', 
          padding: '10px', 
          maxHeight: '300px', 
          overflow: 'auto',
          backgroundColor: '#f8f9fa'
        }}>
          {updateNotifications.length === 0 ? (
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No notifications...</p>
          ) : (
            updateNotifications.map((notification) => (
              <div key={notification.id} style={{ 
                marginBottom: '10px', 
                padding: '8px', 
                backgroundColor: 'white', 
                borderRadius: '3px',
                border: `1px solid ${
                  notification.type === 'error' ? '#dc3545' :
                  notification.type === 'warning' ? '#ffc107' :
                  notification.type === 'success' ? '#28a745' : '#17a2b8'
                }`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <strong style={{ color: 
                      notification.type === 'error' ? '#dc3545' :
                      notification.type === 'warning' ? '#856404' :
                      notification.type === 'success' ? '#155724' : '#0c5460'
                    }}>
                      {notification.type.toUpperCase()}
                    </strong>
                    <p style={{ margin: '5px 0' }}>{notification.message}</p>
                    <small style={{ color: '#6c757d' }}>
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                  <button 
                    onClick={() => clearNotification(notification.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '16px', 
                      cursor: 'pointer' 
                    }}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#6c757d' }}>
        <p>This test connects to: ws://localhost:8000/ws/booking-updates</p>
        <p>Subscribed to date: 2025-07-01</p>
        <p>Check the browser console for detailed logs.</p>
      </div>
    </div>
  );
}
