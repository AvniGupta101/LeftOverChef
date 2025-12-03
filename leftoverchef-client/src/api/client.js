// src/api/client.js
import axios from "axios";

// Read build-time env var, remove trailing slash if present.
// Fallback to relative /api so the app works when served from same origin.
const RAW = import.meta.env.VITE_API_BASE || "/api";
const API_BASE = RAW.replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
