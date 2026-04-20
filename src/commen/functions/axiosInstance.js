/**
 * @file axiosInstance.js
 * @description Configures a shared Axios instance used by all API calls in the app.
 *
 * Responsibilities:
 *  - Attaches the JWT `_token` header automatically on every outgoing request.
 *  - Intercepts every response and forces a sign-out when the server returns a
 *    400 "Token is required" or 401 "tokens does not match / Invalid Agent" error,
 *    so stale/invalid sessions are always cleaned up globally without each action
 *    needing to handle it individually.
 */
// src/api/axiosInstance.js
import axios from "axios";
import { signOut } from "../../store/actions/Auth_Sign_Out";
import store from "../../store/store";

// Single Axios instance shared across the whole app — baseURL comes from .env
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// ─── Request interceptor ─────────────────────────────────────────────────────
// Reads the JWT from localStorage and injects it as the `_token` header so
// every request is authenticated without callers having to add it manually.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers._token = JSON.parse(token); // token stored as JSON string
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ────────────────────────────────────────────────────
// Checks every successful response AND every error response for auth-failure
// codes and forces a global sign-out so the user is redirected to login.
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("SUCCESS:", response.data);

    const code = Number(response?.data?.responseCode);
    const message = (response?.data?.errorMessage || "").toLowerCase().trim();

    console.log("SUCCESS →", code, message);

    if (
      code === 400 &&
      (message.toLowerCase() === "Token is required".toLowerCase() )
    ) {
      console.warn("Unauthorized - redirecting to login...");
      signOut("Session expired", store.dispatch);
      return;
    }

    if (
      code === 401 &&
      (message === "tokens does not match" || message === "Invalid Agent".toLowerCase())
    ) {
      console.warn("Unauthorized - redirecting to login...");
      signOut("Session expired", store.dispatch);
      return;
    }

    return response;
  },
  (error) => {
    console.log("ERROR:", error);

    const code = Number(error?.response?.data?.responseCode);
    const message = (error?.response?.data?.errorMessage || "")
      .toLowerCase()
      .trim();

    console.log("ERROR →", code, message);

    if (
      code === 400 &&
      (message.toLowerCase() === "Token is required".toLowerCase() )
    ) {
      console.warn("Unauthorized - redirecting to login...");
      signOut("Session expired", store.dispatch);
      return;
    }

    if (
      code === 401 &&
      (message === "tokens does not match" || message === "Invalid Agent".toLowerCase())
    ) {
      console.warn("Unauthorized - redirecting to login...");
      signOut("Session expired", store.dispatch);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
