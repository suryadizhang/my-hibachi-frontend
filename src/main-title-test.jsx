// TITLE TEST - This should change the page title if JS is working
console.log("🔥 TITLE TEST LOADING...");

// Change title immediately 
document.title = "🚨 JAVASCRIPT IS WORKING!";

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM READY");
  
  const root = document.getElementById("root");
  console.log("📍 Root element:", root);
  
  if (root) {
    root.innerHTML = `
      <div style="
        padding: 50px; 
        background-color: #00ff00; 
        color: black; 
        font-size: 40px; 
        text-align: center;
        font-family: Arial;
        border: 5px solid red;
      ">
        🎉 JAVASCRIPT IS EXECUTING!
        <br>
        Time: ${new Date().toLocaleString()}
        <br>
        <button onclick="alert('Button clicked!')">Test Button</button>
      </div>
    `;
    console.log("✅ CONTENT RENDERED!");
    
    // Also change the body background as additional visual confirmation
    document.body.style.backgroundColor = "#ffff00";
    
  } else {
    console.error("❌ ROOT NOT FOUND!");
    // If root not found, at least change the body
    document.body.innerHTML = "<h1 style='color: red;'>ROOT ELEMENT NOT FOUND!</h1>";
  }
});

console.log("🔥 TITLE TEST LOADED");
