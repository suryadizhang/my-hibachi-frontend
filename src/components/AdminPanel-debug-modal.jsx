import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container } from "react-bootstrap";
import { API_BASE } from '../config/api-simple';
import AdminConfirmationModal from './AdminConfirmationModal';
// import NewsletterManager from './NewsletterManager';
// import LogPanel from './LogPanel';
// import SuperAdminManager from './SuperAdminManager';
import './AdminPanel.css';

// Testing AdminPanel with AdminConfirmationModal import
function AdminPanel() {
  console.log("🔧 AdminPanel with AdminConfirmationModal import...");
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  try {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: 'lightyellow',
        border: '2px solid orange',
        margin: '20px'
      }}>
        <h2>🔧 ADMIN PANEL - Testing AdminConfirmationModal Import</h2>
        <p>✅ Testing if AdminConfirmationModal import causes issues</p>
        <p>Token exists: {token ? 'Yes' : 'No'}</p>
        <p>API_BASE: {API_BASE}</p>
        <p>AdminConfirmationModal imported: {AdminConfirmationModal ? 'Yes' : 'No'}</p>
      </div>
    );
  } catch (error) {
    console.error("🔧 AdminPanel error with AdminConfirmationModal:", error);
    return (
      <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
        <h2>❌ AdminConfirmationModal Import Error</h2>
        <p>Error: {error.message}</p>
      </div>
    );
  }
}

export default AdminPanel;
