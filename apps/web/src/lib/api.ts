import axios from "axios";

const env = (import.meta as any).env || {};

// Priority:
// 1) VITE_API_BASE_URL (explicit)
// 2) VITE_API_URL (back-compat if you used it before)
// 3) local dev default
const baseURL =
  (env.VITE_API_BASE_URL?.trim() ||
    env.VITE_API_URL?.trim() ||
    "http://localhost:4000/api");

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}
