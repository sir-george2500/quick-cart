// Use process.env for development detection
const isDevelopment = process.env.NODE_ENV !== "production";

export const API_URL = isDevelopment
  ? "http://localhost:3000/api/v1"
  : "https://api.quickcart.com/api/v1";

export const Config = {
  apiUrl: API_URL,
  tokenKey: "auth_token",
  userKey: "user_data",
};
