import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Config } from "@/constants/Config";

const api = axios.create({
  baseURL: Config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(Config.tokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired
      await SecureStore.deleteItemAsync(Config.tokenKey);
      // You can trigger logout here
    }
    return Promise.reject(error);
  }
);

export default api;
