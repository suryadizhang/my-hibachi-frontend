console.log('🔥 SCRIPT LOADING...')

// Test if the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM READY')
  
  const root = document.getElementById('root')
  console.log('📍 Root element:', root)
  
  if (root) {
    root.innerHTML = `
      <div style="
        padding: 50px; 
        background-color: red; 
        color: white; 
        font-size: 30px; 
        text-align: center;
        font-family: Arial;
      ">
        🚨 VANILLA JS TEST - NO REACT!
        <br>
        Time: ${new Date().toLocaleString()}
      </div>
    `
    console.log('✅ VANILLA JS RENDERED!')
  } else {
    console.error('❌ ROOT NOT FOUND!')
  }
})

console.log('🔥 SCRIPT LOADED')
