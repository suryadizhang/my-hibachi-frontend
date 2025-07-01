import React from "react";

// Minimal App component to test what's breaking
function App() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightblue',
      color: 'black',
      fontSize: '18px',
      border: '2px solid blue'
    }}>
      <h1>🔧 APP TEST - Basic App component is working!</h1>
      <p>If you see this, the App.jsx is rendering correctly.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default App;
