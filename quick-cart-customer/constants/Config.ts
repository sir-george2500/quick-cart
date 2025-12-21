/**
 * Application configuration
 * In React Native, process.env is not reliable during runtime
 * Use __DEV__ global for development detection
 */

export const Config = {
  // API Configuration
  apiUrl: __DEV__
    ? "https://messier-ricarda-genotypically.ngrok-free.dev/api/v1"
    : "https://api.quickcart.com/api/v1",

  // Storage Keys
  tokenKey: "auth_token",
  userKey: "user_data",

  // App Info
  appName: "Quick-Cart",
  version: "1.0.0",
} as const;

export type ConfigType = typeof Config;
