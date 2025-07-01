import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Simple test component to check if React can render at all
function TestApp() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      color: 'black',
      fontSize: '20px',
      border: '2px solid red'
    }}>
      <h1>🧪 REACT TEST - If you see this, React is working!</h1>
      <p>This is a minimal React component to test if the app can render.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

// Try to mount the test app
try {
  const root = document.getElementById('root');
  console.log('Root element found:', root);
  
  createRoot(root).render(
    <StrictMode>
      <TestApp />
    </StrictMode>
  );
  
  console.log('React test app rendered successfully!');
} catch (error) {
  console.error('Error rendering React app:', error);
  
  // Fallback: show error in the DOM
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; background: red; color: white; font-size: 20px;">
      <h1>❌ REACT ERROR</h1>
      <p>Error: ${error.message}</p>
      <p>Check console for details</p>
    </div>
  `;
}
