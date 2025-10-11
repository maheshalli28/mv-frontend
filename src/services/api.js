import axios from "axios";
import { getToken } from "../utils/auth";

// Prefer environment variable in production; fallback to known Render URL for safety
const RENDER_BACKEND = "https://mv-backend-apz8.onrender.com";

const baseURL = process.env.NODE_ENV === "production"
  ? (process.env.REACT_APP_API_URL || RENDER_BACKEND || "http://localhost:5001")
  : "/api"; // dev proxy (CRA)

const API = axios.create({ baseURL });

// Basic debug logging — safe to remove in production if noisy
/* eslint-disable no-console */
console.info("API baseURL:", API.defaults.baseURL);

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.debug("[API request]", config.method?.toUpperCase(), (config.baseURL || "") + config.url);
  return config;
});

API.interceptors.response.use(
  (response) => {
    console.debug("[API response]", response.status, response.config.url);
    return response;
  },
  (error) => {
    // Normalize network errors
    if (!error.response) {
      console.error("[API network error]", error.message);
      return Promise.reject({
        message: "Network error. Please check your connection.",
        originalError: error,
      });
    }
    console.error("[API error]", error.response.status, error.response.config?.url || "");
    return Promise.reject(error);
  }
);

/* eslint-enable no-console */

export default API;


