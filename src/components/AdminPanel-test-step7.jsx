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

// Testing original AdminPanel logic step by step
function AdminPanel() {
  // STEP 7: Add basic state (no useEffect)
  const [activeTab, setActiveTab] = useState("bookings");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightcoral',
      border: '2px solid darkred',
      margin: '20px'
    }}>
      <h2>🔧 STEP 7 - Testing Basic State (No useEffect)</h2>
      <p>Basic state variables added, no useEffect hooks yet</p>
      <p>Active Tab: {activeTab}</p>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <p>Token exists: {token ? 'Yes' : 'No'}</p>
      <p>Error: {error || 'None'}</p>
    </div>
  );
}

export default AdminPanel;
