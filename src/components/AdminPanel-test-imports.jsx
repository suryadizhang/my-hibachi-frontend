import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container } from "react-bootstrap";
import { API_BASE } from '../config/api';
import AdminConfirmationModal from './AdminConfirmationModal';
import NewsletterManager from './NewsletterManager';
import LogPanel from './LogPanel';
import SuperAdminManager from './SuperAdminManager';
import './AdminPanel.css';

// Test AdminPanel with just imports and minimal logic
function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightblue',
      border: '2px solid blue',
      margin: '20px'
    }}>
      <h2>🔧 ADMIN PANEL - Testing Imports</h2>
      <p>All imports loaded successfully!</p>
      <p>Token exists: {token ? 'Yes' : 'No'}</p>
      <p>Loading state: {loading ? 'True' : 'False'}</p>
    </div>
  );
}

export default AdminPanel;
