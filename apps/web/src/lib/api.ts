import axios from "axios";

const baseURL =
  (import.meta as any).env?.VITE_API_URL?.trim() ||
  "http://localhost:4000/api";

export const api = axios.create({
  baseURL,
  withCredentials: false
});

export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}
