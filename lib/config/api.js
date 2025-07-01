// API configuration that works in Next.js and Jest environments
let API_BASE;

// In Jest environment or server-side rendering
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  API_BASE = 'http://localhost:8000';
} else if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) {
  // Next.js environment variable
  API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
} else {
  // Fallback for client-side
  API_BASE = 'http://localhost:8000';
}

export { API_BASE };
