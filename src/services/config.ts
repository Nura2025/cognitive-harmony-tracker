
export const API_BASE = "http://127.0.0.1:8000";

import axios from "axios";

// Configure axios to include auth token in all requests
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('neurocog_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Call this when your app initializes
setupAxiosInterceptors();
