import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container } from "react-bootstrap";
import { API_BASE } from '../config/api-simple';

// Debugging version of AdminPanel - minimal imports to isolate the issue
function AdminPanel() {
  console.log("🔧 AdminPanel component starting to render...");
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  console.log("🔧 AdminPanel basic state initialized", { loading, token: !!token });

  try {
    console.log("🔧 AdminPanel rendering JSX...");
    return (
      <div style={{
        padding: '20px',
        backgroundColor: 'lightgreen',
        border: '2px solid green',
        margin: '20px'
      }}>
        <h2>🔧 ADMIN PANEL - DEBUGGING VERSION</h2>
        <p>✅ Basic AdminPanel rendering with minimal imports</p>
        <p>Token exists: {token ? 'Yes' : 'No'}</p>
        <p>API_BASE: {API_BASE}</p>
        <p>Loading state: {loading ? 'True' : 'False'}</p>
        <hr />
        <p><strong>Next steps:</strong></p>
        <ul>
          <li>If you see this, basic AdminPanel structure works</li>
          <li>Issue is likely in complex imports or useEffect hooks</li>
          <li>Will gradually add back functionality</li>
        </ul>
      </div>
    );
  } catch (error) {
    console.error("🔧 AdminPanel render error:", error);
    return (
      <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
        <h2>❌ AdminPanel Render Error</h2>
        <p>Error: {error.message}</p>
      </div>
    );
  }
}

export default AdminPanel;
