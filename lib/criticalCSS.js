// Critical CSS for above-the-fold content
const criticalCSS = `
/* Critical styles for immediate rendering */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  background-color: #ffffff;
  color: #333333;
  transform: translateZ(0); /* Hardware acceleration */
}

/* Critical navbar styles */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1030;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  will-change: transform;
}

/* Critical hero section */
.hero-section {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  contain: layout style paint;
}

/* Critical loading states */
.loading-spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid rgba(0,0,0,0.1);
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Critical button styles */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  will-change: background-color, transform;
}

.btn-primary {
  background-color: #007bff;
  color: #ffffff;
}

.btn:hover {
  transform: translateY(-1px);
}

/* Critical layout */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Critical responsive grid */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.75rem;
}

.col {
  flex: 1;
  padding: 0 0.75rem;
}

/* Critical mobile styles */
@media (max-width: 768px) {
  .col {
    flex: 100%;
    max-width: 100%;
  }
  
  .hero-section {
    min-height: 50vh;
    padding: 2rem 0;
  }
}
`;

// Function to inject critical CSS
export const injectCriticalCSS = () => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
  }
};

export default criticalCSS;
