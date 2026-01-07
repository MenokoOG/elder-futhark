import axios from "axios";

function normalizeApiBase(raw: string): string {
  const v = raw.trim().replace(/\/+$/, "");
  // Allow either:
  // - https://host            (we'll append /api)
  // - https://host/api        (we keep)
  return v.endsWith("/api") ? v : `${v}/api`;
}

const envAny = (import.meta as any).env || {};
const rawBase =
  (envAny.VITE_API_URL as string | undefined) ||
  (envAny.VITE_API_BASE_URL as string | undefined) ||
  "http://localhost:4000";

export const api = axios.create({
  baseURL: normalizeApiBase(rawBase),
  withCredentials: false
});

export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}