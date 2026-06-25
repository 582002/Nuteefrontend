import axios from "axios";

// Using the Render URL as the absolute fallback
const baseURL = process.env.REACT_APP_API_BASE || "nutee-eggxarhvdbgsgzbs.southindia-01.azurewebsites.net";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ⭐ JWT INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;