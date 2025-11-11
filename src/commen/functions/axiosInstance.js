// src/api/axiosInstance.js
import axios from "axios";
import { signOut } from "../../store/actions/Auth_Sign_Out";
import store from "../../store/store"; // 👈 import your store

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // optional if you use absolute URLs
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Automatically add token from localStorage or redux
    const token = localStorage.getItem("token");
    if (token) {
      config.headers._token = JSON.parse(token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized - redirecting to login...");
      
      signOut("Session expired", store.dispatch);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
