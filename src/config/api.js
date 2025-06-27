// API configuration that works in both Vite and Jest environments
let API_BASE;

// In Jest environment, import.meta is not available
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  API_BASE = 'http://localhost:8000';
} else {
  // This will be undefined in Jest, but that's OK since we handle it above
  const metaEnv = typeof window !== 'undefined' && window.import?.meta?.env || {};
  API_BASE = metaEnv.VITE_API_BASE_URL || 'http://localhost:8000';
}

export { API_BASE };
