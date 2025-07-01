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

// Testing with FIXED useEffect dependencies
function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // Fix: Define fetchCurrentUser BEFORE using it in useEffect
  const fetchCurrentUser = useCallback(async () => {
    console.log('Fetching current user...');
    // Simplified fetchCurrentUser logic for testing
    try {
      // Just a simple test - we'll add full logic later
      console.log('Current user fetch completed');
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, []);

  // Fix: Now useEffect can safely use fetchCurrentUser
  useEffect(() => {
    console.log('AdminPanel: Checking authentication...', { hasToken: !!token });
    if (!token) {
      console.log('AdminPanel: No token found, redirecting to login');
      navigate("/admin-login");
    } else {
      console.log('AdminPanel: Token found, fetching current user');
      fetchCurrentUser();
    }
  }, [token, navigate, fetchCurrentUser]);

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightgreen',
      border: '2px solid green',
      margin: '20px'
    }}>
      <h2>🔧 TESTING: Fixed useEffect Dependencies</h2>
      <p>✅ All imports loaded</p>
      <p>✅ fetchCurrentUser defined before useEffect</p>
      <p>✅ useEffect dependencies properly ordered</p>
      <p>Token exists: {token ? 'Yes' : 'No'}</p>
      <p>API_BASE: {API_BASE}</p>
      <p><strong>If you see this, the useEffect dependency issue is fixed!</strong></p>
    </div>
  );
}

export default AdminPanel;
