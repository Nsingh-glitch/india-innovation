const rawApiUrl = import.meta.env.VITE_API_URL;

const API_URL = rawApiUrl
  ? rawApiUrl.replace(/\/+$/, "")
  : (import.meta.env.DEV ? "http://localhost:8000" : "");

if (!API_URL) {
  throw new Error("VITE_API_URL is not set");
}

export { API_URL };