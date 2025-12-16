import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, LoginCredentials, RegisterData } from "@/types/auth";
import { authService } from "@/services/auth";
import { Config } from "@/constants/Config";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await authService.login(credentials);

      // Save token securely
      await SecureStore.setItemAsync(Config.tokenKey, token);
      // Save user data
      await AsyncStorage.setItem(Config.userKey, JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Login failed",
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await authService.register(userData);

      // Save token securely
      await SecureStore.setItemAsync(Config.tokenKey, token);
      // Save user data
      await AsyncStorage.setItem(Config.userKey, JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Registration failed",
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Continue with local logout even if API fails
    } finally {
      // Clear stored data
      await SecureStore.deleteItemAsync(Config.tokenKey);
      await AsyncStorage.removeItem(Config.userKey);

      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await authService.forgotPassword(email);
      set({ loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to send reset email",
      });
      throw error;
    }
  },

  loadUser: async () => {
    try {
      const token = await SecureStore.getItemAsync(Config.tokenKey);
      const userData = await AsyncStorage.getItem(Config.userKey);

      if (token && userData) {
        const user = JSON.parse(userData);
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      // Failed to load user, clear everything
      await SecureStore.deleteItemAsync(Config.tokenKey);
      await AsyncStorage.removeItem(Config.userKey);
    }
  },

  clearError: () => set({ error: null }),
}));
