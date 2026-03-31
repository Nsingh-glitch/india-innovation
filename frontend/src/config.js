
const VITE_API_URL = import.meta.env.VITE_API_URL;
let API_URL;

// Use localhost fallback only in development mode
if (import.meta.env.DEV) {
  API_URL = VITE_API_URL || 'http://localhost:8000';
} else {
  if (!VITE_API_URL) {
    // In production, fail clearly if the variable is not set
    throw new Error("VITE_API_URL is not defined. Please set this environment variable in your deployment settings.");
  }
  API_URL = VITE_API_URL;
}

export { API_URL };