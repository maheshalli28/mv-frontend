import axios from "axios";
import { getToken } from "../utils/auth";

// Use relative base for CRA proxy in dev, env var in prod
const baseURL = process.env.NODE_ENV === "production"
  ? process.env.REACT_APP_API_URL
  : "/api";

const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize network errors
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        originalError: error,
      });
    }
    return Promise.reject(error);
  }
);

export default API;


