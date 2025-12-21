/**
 * Authentication Service
 * Clean, testable service with proper error handling
 */

import { apiClient, ApiException } from "@/lib/api";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  LogoutResponse,
  ForgotPasswordRequest,
  PasswordResetResponse,
  User,
} from "./types";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  FORGOT_PASSWORD: "/auth/forgot-password",
  PROFILE: "/user/profile",
} as const;

/**
 * Debug logger for auth service
 */
const log = (method: string, ...args: unknown[]) => {
  console.log(`[AuthService.${method}]`, ...args);
};

/**
 * Authentication service for user management
 */
export const authService = {
  /**
   * Login with email and password
   * @throws {ApiException} On validation or auth errors
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    log("login", "Attempting login for:", credentials.email);
    try {
      const response = await apiClient.post<AuthResponse>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );
      log("login", "Success! User:", response.user?.email);
      return response;
    } catch (error) {
      log("login", "Failed:", error);
      throw error;
    }
  },

  /**
   * Register a new customer account
   * @throws {ApiException} If email already exists or validation fails
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const payload: RegisterRequest = {
      ...data,
      role: data.role ?? "CUSTOMER",
    };
    log("register", "Attempting registration:", {
      email: payload.email,
      name: payload.name,
      role: payload.role,
    });
    try {
      const response = await apiClient.post<AuthResponse>(
        AUTH_ENDPOINTS.REGISTER,
        payload
      );
      log("register", "Success! User registered:", response.user?.email);
      log("register", "Token received:", response.token ? "Yes" : "No");
      return response;
    } catch (error) {
      log("register", "Failed:", error);
      throw error;
    }
  },

  /**
   * Logout current user
   */
  async logout(): Promise<LogoutResponse> {
    log("logout", "Logging out...");
    try {
      const response = await apiClient.post<LogoutResponse>(
        AUTH_ENDPOINTS.LOGOUT
      );
      log("logout", "Success");
      return response;
    } catch (error) {
      log("logout", "Failed:", error);
      throw error;
    }
  },

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<PasswordResetResponse> {
    log("forgotPassword", "Requesting reset for:", email);
    const payload: ForgotPasswordRequest = { email };
    try {
      const response = await apiClient.post<PasswordResetResponse>(
        AUTH_ENDPOINTS.FORGOT_PASSWORD,
        payload
      );
      log("forgotPassword", "Success");
      return response;
    } catch (error) {
      log("forgotPassword", "Failed:", error);
      throw error;
    }
  },

  /**
   * Fetch current user profile
   * @throws {ApiException} If not authenticated
   */
  async getCurrentUser(): Promise<User> {
    log("getCurrentUser", "Fetching profile...");
    try {
      const response = await apiClient.get<{ user: User }>(
        AUTH_ENDPOINTS.PROFILE
      );
      log("getCurrentUser", "Success:", response.user?.email);
      return response.user;
    } catch (error) {
      log("getCurrentUser", "Failed:", error);
      throw error;
    }
  },
};
