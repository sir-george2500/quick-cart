/**
 * Auth Service Tests
 */

import { authService } from "../service";
import { apiClient } from "@/lib/api";
import { AuthResponse, User } from "../types";

// Mock the API client
jest.mock("@/lib/api", () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    const mockUser: User = {
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      role: "CUSTOMER",
    };

    const mockAuthResponse: AuthResponse = {
      user: mockUser,
      token: "jwt-token-123",
    };

    it("should login successfully with valid credentials", async () => {
      mockApiClient.post.mockResolvedValue(mockAuthResponse);

      const result = await authService.login({
        email: "john@example.com",
        password: "password123",
      });

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/login", {
        email: "john@example.com",
        password: "password123",
      });
      expect(result).toEqual(mockAuthResponse);
    });

    it("should propagate errors from API client", async () => {
      const error = new Error("Invalid credentials");
      mockApiClient.post.mockRejectedValue(error);

      await expect(
        authService.login({ email: "wrong@example.com", password: "wrong" })
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("register", () => {
    const mockAuthResponse: AuthResponse = {
      user: {
        id: "new-user-123",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "CUSTOMER",
      },
      token: "new-jwt-token",
      message: "Account created successfully",
    };

    it("should register a new customer", async () => {
      mockApiClient.post.mockResolvedValue(mockAuthResponse);

      const result = await authService.register({
        name: "Jane Smith",
        email: "jane@example.com",
        password: "SecurePass123",
      });

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/register", {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "SecurePass123",
        role: "CUSTOMER",
      });
      expect(result).toEqual(mockAuthResponse);
    });

    it("should use provided role if specified", async () => {
      mockApiClient.post.mockResolvedValue(mockAuthResponse);

      await authService.register({
        name: "Vendor User",
        email: "vendor@example.com",
        password: "VendorPass123",
        role: "VENDOR",
      });

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/register", {
        name: "Vendor User",
        email: "vendor@example.com",
        password: "VendorPass123",
        role: "VENDOR",
      });
    });
  });

  describe("logout", () => {
    it("should call logout endpoint", async () => {
      mockApiClient.post.mockResolvedValue({ message: "Logout successful" });

      const result = await authService.logout();

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/logout");
      expect(result).toEqual({ message: "Logout successful" });
    });
  });

  describe("forgotPassword", () => {
    it("should send password reset request", async () => {
      mockApiClient.post.mockResolvedValue({ message: "Reset email sent" });

      const result = await authService.forgotPassword("user@example.com");

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/forgot-password", {
        email: "user@example.com",
      });
      expect(result).toEqual({ message: "Reset email sent" });
    });
  });

  describe("getCurrentUser", () => {
    const mockUser: User = {
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      role: "CUSTOMER",
    };

    it("should fetch current user profile", async () => {
      mockApiClient.get.mockResolvedValue({ user: mockUser });

      const result = await authService.getCurrentUser();

      expect(mockApiClient.get).toHaveBeenCalledWith("/user/profile");
      expect(result).toEqual(mockUser);
    });
  });
});
