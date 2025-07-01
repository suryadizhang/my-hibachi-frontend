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

// Testing the problematic useEffect
function AdminPanel() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("admin");
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // Define fetchCurrentUser first (before useEffect)
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/booking/admin/current-user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsername(response.data.username || "");
      setUserRole(response.data.user_type || "admin");
    } catch (error) {
      console.error("Error fetching current user:", error);
      setError("Failed to fetch user information");
    }
  }, [token]);

  // STEP 8: Add the fixed useEffect
  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    fetchCurrentUser();
  }, [token, navigate, fetchCurrentUser]);

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightblue',
      border: '2px solid blue',
      margin: '20px'
    }}>
      <h2>🔧 STEP 8 - Testing Fixed useEffect</h2>
      <p>Added useEffect with proper fetchCurrentUser ordering</p>
      <p>Username: {username || 'Not loaded'}</p>
      <p>User Role: {userRole}</p>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <p>Token exists: {token ? 'Yes' : 'No'}</p>
      <p>Error: {error || 'None'}</p>
    </div>
  );
}

export default AdminPanel;
