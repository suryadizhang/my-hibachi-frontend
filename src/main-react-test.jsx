import React from 'react'
import { createRoot } from 'react-dom/client'

console.log("🔥 REACT TEST LOADING...");
console.log("React:", React);
console.log("createRoot:", createRoot);

// Simple function component
function TestApp() {
  console.log("🎯 TestApp component rendering...");
  
  return React.createElement('div', {
    style: {
      padding: '50px',
      backgroundColor: '#ff0000',
      color: 'white',
      fontSize: '30px',
      textAlign: 'center',
      fontFamily: 'Arial'
    }
  }, [
    React.createElement('h1', {key: 'title'}, '🎉 REACT IS WORKING!'),
    React.createElement('p', {key: 'time'}, `Time: ${new Date().toLocaleString()}`),
    React.createElement('button', {
      key: 'button',
      onClick: () => alert('React button clicked!')
    }, 'Test React Button')
  ]);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM READY - Starting React");
  
  const rootElement = document.getElementById('root');
  console.log("📍 Root element:", rootElement);
  
  if (rootElement) {
    console.log("🚀 Creating React root...");
    
    try {
      const root = createRoot(rootElement);
      console.log("✅ React root created:", root);
      
      console.log("🎨 Rendering TestApp...");
      root.render(React.createElement(TestApp));
      console.log("✅ React render called!");
      
    } catch (error) {
      console.error("❌ React error:", error);
      rootElement.innerHTML = `<div style="color: red; padding: 20px;">React Error: ${error.message}</div>`;
    }
    
  } else {
    console.error("❌ Root element not found!");
  }
});

console.log("🔥 REACT TEST SCRIPT LOADED");
