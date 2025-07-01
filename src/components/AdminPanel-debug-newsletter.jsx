import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container } from "react-bootstrap";
import { API_BASE } from '../config/api-simple';
import AdminConfirmationModal from './AdminConfirmationModal';
import NewsletterManager from './NewsletterManager';
import './AdminPanel.css';

// Testing AdminPanel with AdminConfirmationModal + NewsletterManager imports
function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightcyan',
      border: '2px solid teal',
      margin: '20px'
    }}>
      <h2>🔧 ADMIN PANEL - Testing NewsletterManager Import</h2>
      <p>✅ Testing if NewsletterManager import causes issues</p>
      <p>Token exists: {token ? 'Yes' : 'No'}</p>
      <p>API_BASE: {API_BASE}</p>
      <p>AdminConfirmationModal imported: Yes</p>
      <p>NewsletterManager imported: Yes</p>
    </div>
  );
}

export default AdminPanel;
