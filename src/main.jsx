// PURE VANILLA TEST - NO IMPORTS, NO MODULES
console.log("🔥 PURE VANILLA TEST STARTING...");

// Test if we can modify the document at all
document.title = "🔥 PURE VANILLA TEST";

// Wait for DOM to be ready
function domReady() {
  console.log("✅ DOM READY");
  
  const root = document.getElementById("root");
  console.log("📍 Root element:", root);
  
  if (root) {
    root.innerHTML = `
      <div style="
        padding: 50px; 
        background-color: red; 
        color: white; 
        font-size: 40px; 
        text-align: center;
        font-family: Arial;
        border: 5px solid yellow;
      ">
        🎯 PURE VANILLA JAVASCRIPT WORKING!
        <br>
        No React, No Imports, No Modules
        <br>
        Time: ${new Date().toLocaleString()}
        <br>
        <button onclick="alert('Button works!')">Test Button</button>
      </div>
    `;
    
    // Change body background as visual confirmation
    document.body.style.backgroundColor = "#00ff00";
    document.body.style.margin = "0";
    
    console.log("✅ VANILLA CONTENT RENDERED!");
  } else {
    console.error("❌ ROOT NOT FOUND!");
    document.body.innerHTML = `
      <div style="color: red; font-size: 30px; padding: 20px;">
        ROOT ELEMENT NOT FOUND!
      </div>
    `;
  }
}

// Try multiple ways to ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', domReady);
} else {
  domReady();
}

// Also try after a delay
setTimeout(domReady, 100);

console.log("🔥 PURE VANILLA TEST LOADED");
