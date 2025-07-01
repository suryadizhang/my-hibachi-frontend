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

// Testing AdminPanel with ALL component imports
function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightgoldenrodyellow',
      border: '2px solid gold',
      margin: '20px'
    }}>
      <h2>🔧 ADMIN PANEL - Testing ALL Imports</h2>
      <p>✅ Testing if ALL component imports work together</p>
      <p>Token exists: {token ? 'Yes' : 'No'}</p>
      <p>API_BASE: {API_BASE}</p>
      <p>AdminConfirmationModal imported: Yes</p>
      <p>NewsletterManager imported: Yes</p>
      <p>LogPanel imported: Yes</p>
      <p>SuperAdminManager imported: Yes</p>
      <hr />
      <p><strong>If you see this, ALL IMPORTS work fine!</strong></p>
      <p><strong>The issue is likely in the component logic/hooks, not imports.</strong></p>
    </div>
  );
}

export default AdminPanel;
