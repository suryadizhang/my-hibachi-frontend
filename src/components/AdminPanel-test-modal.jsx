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

// Test AdminPanel with AdminConfirmationModal import
function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightgreen',
      border: '2px solid green',
      margin: '20px'
    }}>
      <h2>🔧 ADMIN PANEL - Adding AdminConfirmationModal</h2>
      <p>Testing if AdminConfirmationModal import causes issues</p>
      <p>Token exists: {token ? 'Yes' : 'No'}</p>
      <p>API_BASE: {API_BASE}</p>
    </div>
  );
}

export default AdminPanel;
