// src/api/axiosInstance.js
import axios from "axios";
import { signOut } from "../../store/actions/Auth_Sign_Out";
import store from "../../store/store";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// ------------------- REQUEST -------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers._token = JSON.parse(token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------- RESPONSE -------------------
axiosInstance.interceptors.response.use(
  (response) => {
    

    const code = Number(response?.data?.responseCode);
    const message = (response?.data?.errorMessage || "").toLowerCase().trim();

    

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
    

    const code = Number(error?.response?.data?.responseCode);
    const message = (error?.response?.data?.errorMessage || "")
      .toLowerCase()
      .trim();

    

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
