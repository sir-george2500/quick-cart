import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useAuthStore } from "../authStore";
import { authService } from "@/lib/auth";
import { ApiException } from "@/lib/api";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock the auth service
jest.mock("@/lib/auth", () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));
jest.mock("expo-secure-store");
jest.mock("@react-native-async-storage/async-storage");

describe("useAuthStore", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset the store state
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  });

  describe("login", () => {
    it("should successfully login a user", async () => {
      const mockUser = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "CUSTOMER" as const,
      };
      const mockToken = "mock-jwt-token";

      (authService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login({
          email: "john@example.com",
          password: "password123",
        });
      });

      // Verify API was called
      expect(authService.login).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "password123",
      });

      // Verify token was stored
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "auth_token",
        mockToken
      );

      // Verify user was stored
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "user_data",
        JSON.stringify(mockUser)
      );

      // Verify store state
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should handle login failure with ApiException", async () => {
      const apiError = new ApiException(401, "Invalid credentials");

      (authService.login as jest.Mock).mockRejectedValue(apiError);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.login({
            email: "wrong@example.com",
            password: "wrongpass",
          });
        } catch (error) {
          // Expected to throw
        }
      });

      // Verify error state
      expect(result.current.error).toBe("Invalid credentials");
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.loading).toBe(false);
    });
  });

  describe("register", () => {
    it("should successfully register a new user", async () => {
      const mockUser = {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "CUSTOMER" as const,
      };
      const mockToken = "new-jwt-token";

      (authService.register as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.register({
          name: "Jane Smith",
          email: "jane@example.com",
          password: "SecurePass123",
          role: "CUSTOMER",
        });
      });

      // Verify API was called
      expect(authService.register).toHaveBeenCalledWith({
        name: "Jane Smith",
        email: "jane@example.com",
        password: "SecurePass123",
        role: "CUSTOMER",
      });

      // Verify token and user were stored
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "auth_token",
        mockToken
      );
      expect(AsyncStorage.setItem).toHaveBeenCalled();

      // Verify store state
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should handle registration failure with ApiException", async () => {
      const apiError = new ApiException(400, "User already exists");

      (authService.register as jest.Mock).mockRejectedValue(apiError);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.register({
            name: "Existing User",
            email: "existing@example.com",
            password: "Password123",
            role: "CUSTOMER",
          });
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe("User already exists");
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("logout", () => {
    it("should successfully logout a user", async () => {
      // Set initial authenticated state
      useAuthStore.setState({
        user: {
          id: "1",
          name: "John",
          email: "john@example.com",
          role: "CUSTOMER",
        },
        isAuthenticated: true,
      });

      (authService.logout as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.logout();
      });

      // Verify storage was cleared
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("user_data");

      // Verify store state was cleared
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should clear local state even if API call fails", async () => {
      useAuthStore.setState({
        user: {
          id: "1",
          name: "John",
          email: "john@example.com",
          role: "CUSTOMER",
        },
        isAuthenticated: true,
      });

      (authService.logout as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.logout();
      });

      // Should still clear local state
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("loadUser", () => {
    it("should load user from storage on app start", async () => {
      const mockUser = {
        id: "1",
        name: "Stored User",
        email: "stored@example.com",
        role: "CUSTOMER" as const,
      };
      const mockToken = "stored-token";

      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockUser)
      );

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loadUser();
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should handle missing stored data", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loadUser();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("clearError", () => {
    it("should clear error state", () => {
      useAuthStore.setState({ error: "Some error" });

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
