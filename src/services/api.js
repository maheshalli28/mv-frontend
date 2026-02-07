import axios from "axios";
import { getToken } from "../utils/auth";

const baseURL = "https://mv-backend-apz8.onrender.com";

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


