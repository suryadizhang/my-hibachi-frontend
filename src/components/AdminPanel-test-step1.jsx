import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Test AdminPanel: Step 1 - Core React imports only
function AdminPanel() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightblue',
      border: '2px solid blue',
      margin: '20px'
    }}>
      <h2>🔧 STEP 1: Core React Imports Only</h2>
      <p>React, axios, useNavigate - testing if these work</p>
    </div>
  );
}

export default AdminPanel;
