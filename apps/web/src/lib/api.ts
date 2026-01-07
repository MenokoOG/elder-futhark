import axios from "axios";

const env = (import.meta as any).env || {};
const baseURL =
  (env.VITE_API_URL?.trim() ||
    env.VITE_API_BASE_URL?.trim() || // backward-compat
    "http://localhost:4000/api");

export const api = axios.create({
  baseURL,
  withCredentials: false,
});

export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}
