import React from "react";

// Minimal AdminPanel to test if the route works
function AdminPanel() {
  return (
    <div style={{
      padding: '40px',
      backgroundColor: 'lightblue',
      border: '3px solid blue',
      margin: '20px',
      borderRadius: '10px'
    }}>
      <h1>🔧 ADMIN PANEL TEST</h1>
      <h2>✅ If you see this, the /admin route is working!</h2>
      <p>The issue is likely in the complex AdminPanel component logic.</p>
      <hr />
      <p><strong>Next steps:</strong></p>
      <ul>
        <li>This minimal version proves the route works</li>
        <li>The issue is in the full AdminPanel component</li>
        <li>Need to debug the original AdminPanel.jsx</li>
      </ul>
    </div>
  );
}

export default AdminPanel;
