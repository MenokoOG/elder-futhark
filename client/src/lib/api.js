import axios from "axios";

// Base URL used by the browser client.
// Examples:
//   - local:   http://localhost:4000/api
//   - render:  https://<your-api-service>.onrender.com/api
//
// NOTE: Some earlier iterations accidentally had spaces in the URL.
// The replace below makes that mistake harmless.
const baseURL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api").replace(/\s+/g, "");

// Primary axios instance.
export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Backwards/alternate name (some files used apiClient).
export const apiClient = api;

// Set/unset the Authorization header for future requests.
export function setAuthToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}
