// ERROR CATCHING VERSION - Show any errors in the DOM
try {
  console.log("🔥 ERROR TEST STARTING...");
  
  // Test 1: Basic DOM manipulation
  document.title = "🔥 ERROR TEST";
  
  document.addEventListener("DOMContentLoaded", () => {
    try {
      console.log("✅ DOM READY");
      
      const root = document.getElementById("root");
      if (!root) {
        throw new Error("Root element not found!");
      }
      
      // Test 2: Basic React import
      console.log("📦 Testing React import...");
      import('react').then(React => {
        console.log("✅ React imported successfully:", React);
        
        // Test 3: React DOM import  
        import('react-dom/client').then(ReactDOM => {
          console.log("✅ ReactDOM imported successfully:", ReactDOM);
          
          // Test 4: Create root and render
          const reactRoot = ReactDOM.createRoot(root);
          const element = React.createElement('div', {
            style: {
              padding: '50px',
              backgroundColor: '#00ff00',
              color: 'black',
              fontSize: '30px',
              textAlign: 'center'
            }
          }, '🎉 REACT IS WORKING!');
          
          reactRoot.render(element);
          console.log("✅ React rendered successfully!");
          
        }).catch(err => {
          console.error("❌ ReactDOM import error:", err);
          root.innerHTML = `<div style="color: red; padding: 20px;">ReactDOM Import Error: ${err.message}</div>`;
        });
        
      }).catch(err => {
        console.error("❌ React import error:", err);
        root.innerHTML = `<div style="color: red; padding: 20px;">React Import Error: ${err.message}</div>`;
      });
      
    } catch (err) {
      console.error("❌ DOM Error:", err);
      document.body.innerHTML = `<div style="color: red; padding: 20px;">DOM Error: ${err.message}</div>`;
    }
  });
  
} catch (err) {
  console.error("❌ Global Error:", err);
  // Fallback error display
  setTimeout(() => {
    if (document.body) {
      document.body.innerHTML = `<div style="color: red; padding: 20px;">Global Error: ${err.message}</div>`;
    }
  }, 100);
}
