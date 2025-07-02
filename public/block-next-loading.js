// Simplified script to block Next.js loading indicators
(function() {
  'use strict';
  
  // Simple function to remove elements
  function removeNextElements() {
    if (typeof document === 'undefined') return;
    
    // Target specifically the stubborn data-next-mark-loading="false" case
    const falseLoadingElements = document.querySelectorAll('svg[data-next-mark-loading="false"]');
    falseLoadingElements.forEach(el => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    
    // Remove other Next.js loading elements
    const elements = document.querySelectorAll('svg[width="40"][height="40"], [data-next-mark-loading]');
    elements.forEach(el => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }
  
  // Remove on different events
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeNextElements);
  } else {
    removeNextElements();
  }
  
  // Continuous checking for the stubborn "false" state
  const interval = setInterval(() => {
    const loadingIndicator = document.querySelector('svg[data-next-mark-loading="false"]');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }, 100);
  
  // Stop checking after 10 seconds
  setTimeout(() => clearInterval(interval), 10000);
  
  // Remove again after short delays
  setTimeout(removeNextElements, 50);
  setTimeout(removeNextElements, 200);
  setTimeout(removeNextElements, 500);
})();
