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
  (error) => Promise.reject(error),
);

// ------------------- RESPONSE -------------------
axiosInstance.interceptors.response.use(
  (response) => {
    let data = response.data;

    // Handle ArrayBuffer case (optional)
    if (data instanceof ArrayBuffer) {
      try {
        data = JSON.parse(new TextDecoder().decode(new Uint8Array(data)));
      } catch (error) {
        console.error(error);
      }
    }
    const code = Number(data?.responseCode);
    const message = (data?.errorMessage || "").toLowerCase().trim();

    if (
      code === 400 &&
      message.toLowerCase() === "Token is required".toLowerCase()
    ) {
      signOut("Session expired", store.dispatch);
      return;
    }

    if (
      code === 401 &&
      (message === "tokens does not match" ||
        message === "Invalid Agent".toLowerCase())
    ) {
      signOut("Session expired", store.dispatch);
      return;
    }

    return response;
  },
  (error) => {
    let data = error.response.data;

    // Handle ArrayBuffer case (optional)
    if (data instanceof ArrayBuffer) {
      try {
        data = JSON.parse(new TextDecoder().decode(new Uint8Array(data)));
      } catch (error) {
        console.error(error);
      }
    }
    const code = Number(data?.responseCode);
    const message = (data?.errorMessage || "").toLowerCase().trim();

    if (
      code === 400 &&
      message.toLowerCase() === "Token is required".toLowerCase()
    ) {
      signOut("Session expired", store.dispatch);
      return;
    }

    if (
      code === 401 &&
      (message === "tokens does not match" ||
        message === "Invalid Agent".toLowerCase())
    ) {
      signOut("Session expired", store.dispatch);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
