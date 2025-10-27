// src/api/client.js
import axios from "axios";

// Use environment variable if defined, else default to mock API
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Optional: attach token if login implemented
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
