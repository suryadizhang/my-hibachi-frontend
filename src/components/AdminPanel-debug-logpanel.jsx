import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container } from "react-bootstrap";
import { API_BASE } from '../config/api-simple';
import AdminConfirmationModal from './AdminConfirmationModal';
import NewsletterManager from './NewsletterManager';
import LogPanel from './LogPanel';
import './AdminPanel.css';

// Testing AdminPanel with AdminConfirmationModal + NewsletterManager + LogPanel imports
function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightpink',
      border: '2px solid hotpink',
      margin: '20px'
    }}>
      <h2>🔧 ADMIN PANEL - Testing LogPanel Import</h2>
      <p>✅ Testing if LogPanel import causes issues</p>
      <p>Token exists: {token ? 'Yes' : 'No'}</p>
      <p>API_BASE: {API_BASE}</p>
      <p>AdminConfirmationModal imported: Yes</p>
      <p>NewsletterManager imported: Yes</p>
      <p>LogPanel imported: Yes</p>
    </div>
  );
}

export default AdminPanel;
