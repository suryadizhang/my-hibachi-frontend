// ABSOLUTE MINIMAL TEST - Just React createElement
import React from 'react'
import { createRoot } from 'react-dom/client'

console.log('🔥 Script is loading...')

const rootElement = document.getElementById('root')
console.log('📍 Root element:', rootElement)

if (rootElement) {
  console.log('✅ Root element found, creating root...')
  const root = createRoot(rootElement)
  console.log('✅ Root created, rendering...')
  
  root.render(
    React.createElement('div', {
      style: {
        padding: '50px',
        backgroundColor: '#ff4444',
        color: 'white',
        fontSize: '24px',
        textAlign: 'center',
        fontFamily: 'Arial'
      }
    }, '🚨 EMERGENCY TEST: REACT IS ALIVE!')
  )
  
  console.log('✅ Render called!')
} else {
  console.error('❌ Root element not found!')
}
