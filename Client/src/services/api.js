import axios from "axios";

export const TOKEN_KEY = "aura_token";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const readApiError = (error, fallbackMessage = "Something went wrong.") =>
  error?.response?.data?.message ||
  (error?.code === "ERR_NETWORK"
    ? "Cannot connect to API server. Start backend on http://127.0.0.1:5000 and try again."
    : error?.message) ||
  fallbackMessage;
