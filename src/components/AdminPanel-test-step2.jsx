import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Container } from "react-bootstrap";

// Test AdminPanel: Step 2 - Add react-bootstrap imports
function AdminPanel() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightgreen',
      border: '2px solid green',
      margin: '20px'
    }}>
      <h2>🔧 STEP 2: React-Bootstrap Imports Added</h2>
      <p>Testing Spinner, Button, Container from react-bootstrap</p>
      <Button variant="primary">Test Button</Button>
      <Spinner animation="border" size="sm" className="ms-2" />
    </div>
  );
}

export default AdminPanel;
