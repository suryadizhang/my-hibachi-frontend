import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container } from "react-bootstrap";
import { API_BASE } from '../config/api-simple';

// Test AdminPanel: Step 3 - Add API config import
function AdminPanel() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightyellow',
      border: '2px solid orange',
      margin: '20px'
    }}>
      <h2>🔧 STEP 3: API Config Import Added</h2>
      <p>Testing API_BASE from api-simple.js</p>
      <p>API_BASE: {API_BASE}</p>
      <Button variant="primary">Test Button</Button>
    </div>
  );
}

export default AdminPanel;
