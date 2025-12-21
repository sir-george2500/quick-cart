/**
 * Authentication Store
 * Zustand store for managing authentication state
 * Uses clean architecture with proper error handling
 */

import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService, User, LoginRequest, RegisterRequest } from "@/lib/auth";
import { ApiException } from "@/lib/api";
import { Config } from "@/constants/Config";

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

/**
 * Extract user-friendly error message from ApiException
 * Also logs the error for debugging
 */
const getErrorMessage = (error: unknown, fallback: string): string => {
  // Log the full error for debugging
  console.error("[AuthStore] Error:", error);

  if (error instanceof ApiException) {
    console.error("[AuthStore] ApiException:", {
      status: error.status,
      message: error.message,
      code: error.code,
    });
    return error.message;
  }
  if (error instanceof Error) {
    console.error("[AuthStore] Error message:", error.message);
    return error.message;
  }
  return fallback;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      console.log("[AuthStore] Calling login...");
      const response = await authService.login(credentials);
      console.log(
        "[AuthStore] Login response:",
        JSON.stringify(response).slice(0, 200)
      );

      const { user, token } = response;

      // Validate response
      if (!token || typeof token !== "string") {
        throw new Error("Invalid response: missing or invalid token");
      }
      if (!user || !user.id) {
        throw new Error("Invalid response: missing user data");
      }

      // Persist authentication data
      console.log("[AuthStore] Saving token to SecureStore...");
      await SecureStore.setItemAsync(Config.tokenKey, token);
      console.log("[AuthStore] Saving user to AsyncStorage...");
      await AsyncStorage.setItem(Config.userKey, JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      console.log("[AuthStore] Login complete!");
    } catch (error) {
      const message = getErrorMessage(error, "Login failed. Please try again.");
      set({ loading: false, error: message });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      console.log("[AuthStore] Calling register...");
      const response = await authService.register(userData);
      console.log(
        "[AuthStore] Register response:",
        JSON.stringify(response).slice(0, 200)
      );

      const { user, token } = response;

      // Validate response
      if (!token || typeof token !== "string") {
        throw new Error("Invalid response: missing or invalid token");
      }
      if (!user || !user.id) {
        throw new Error("Invalid response: missing user data");
      }

      // Persist authentication data
      console.log("[AuthStore] Saving token to SecureStore...");
      await SecureStore.setItemAsync(Config.tokenKey, token);
      console.log("[AuthStore] Saving user to AsyncStorage...");
      await AsyncStorage.setItem(Config.userKey, JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      console.log("[AuthStore] Registration complete!");
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Registration failed. Please try again."
      );
      set({ loading: false, error: message });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
    } catch {
      // Continue with local logout even if API fails
    } finally {
      // Clear persisted data
      await SecureStore.deleteItemAsync(Config.tokenKey);
      await AsyncStorage.removeItem(Config.userKey);

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await authService.forgotPassword(email);
      set({ loading: false });
    } catch (error) {
      const message = getErrorMessage(error, "Failed to send reset email.");
      set({ loading: false, error: message });
      throw error;
    }
  },

  loadUser: async () => {
    try {
      const token = await SecureStore.getItemAsync(Config.tokenKey);
      const userData = await AsyncStorage.getItem(Config.userKey);

      if (token && userData) {
        const user: User = JSON.parse(userData);
        set({ user, isAuthenticated: true });
      }
    } catch {
      // Failed to load user - clear corrupted data
      await SecureStore.deleteItemAsync(Config.tokenKey);
      await AsyncStorage.removeItem(Config.userKey);
    }
  },

  clearError: () => set({ error: null }),
}));
