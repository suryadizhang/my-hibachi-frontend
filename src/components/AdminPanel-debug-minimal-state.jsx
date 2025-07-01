import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container } from "react-bootstrap";
import { API_BASE } from '../config/api-simple';
import AdminConfirmationModal from './AdminConfirmationModal';
import NewsletterManager from './NewsletterManager';
import LogPanel from './LogPanel';
import SuperAdminManager from './SuperAdminManager';
import './AdminPanel.css';

// Testing original AdminPanel structure with minimal state (no useEffect hooks)
function AdminPanel() {
  // Minimal state only
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // NO useEffect hooks yet - just basic render
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightpink',
      border: '2px solid purple',
      margin: '20px'
    }}>
      <h2>🔍 TESTING: Original AdminPanel Structure (No useEffect)</h2>
      <p>✅ All imports loaded successfully</p>
      <p>✅ Basic state initialized</p>
      <p>Token exists: {token ? 'Yes' : 'No'}</p>
      <p>API_BASE: {API_BASE}</p>
      <p>Loading state: {loading ? 'True' : 'False'}</p>
      <p><strong>If you see this, the problem is in useEffect hooks!</strong></p>
    </div>
  );
}

export default AdminPanel;
