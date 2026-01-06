import axios from "axios";

const baseURL = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:4000";


export const api = axios.create({
  baseURL,
  withCredentials: false
});

/**
 * Central auth token setter so the app can:
 * - set it once after login/signup
 * - clear it on logout
 * - keep axios headers correct
 */
export function setAuthToken(token?: string | null) {
  if (token && String(token).trim()) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("efa_token", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("efa_token");
  }
}

// Auto-load token on startup (so refresh keeps you logged in)
const bootToken = localStorage.getItem("efa_token");
if (bootToken) setAuthToken(bootToken);

// Optional: normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);