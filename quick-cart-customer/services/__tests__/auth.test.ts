import axios from "axios";
import { authService } from "../auth";

// Mock axios
jest.mock("../api");
const mockAxios = axios as jest.Mocked<typeof axios>;

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should successfully login with valid credentials", async () => {
      const mockResponse = {
        data: {
          user: {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "CUSTOMER",
          },
          token: "mock-jwt-token",
        },
      };

      mockAxios.post = jest.fn().mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: "john@example.com",
        password: "password123",
      });

      expect(mockAxios.post).toHaveBeenCalledWith("/auth/login", {
        email: "john@example.com",
        password: "password123",
      });

      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error on invalid credentials", async () => {
      mockAxios.post = jest.fn().mockRejectedValue({
        response: {
          status: 401,
          data: { message: "Invalid credentials" },
        },
      });

      await expect(
        authService.login({
          email: "wrong@example.com",
          password: "wrongpass",
        })
      ).rejects.toThrow();
    });
  });

  describe("register", () => {
    it("should successfully register a new user", async () => {
      const mockResponse = {
        data: {
          user: {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "CUSTOMER",
          },
          token: "new-jwt-token",
        },
      };

      mockAxios.post = jest.fn().mockResolvedValue(mockResponse);

      const result = await authService.register({
        name: "Jane Smith",
        email: "jane@example.com",
        password: "SecurePass123",
        role: "CUSTOMER",
      });

      expect(mockAxios.post).toHaveBeenCalledWith("/auth/register", {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "SecurePass123",
        role: "CUSTOMER",
      });

      expect(result).toEqual(mockResponse.data);
    });

    it("should handle registration error for existing user", async () => {
      mockAxios.post = jest.fn().mockRejectedValue({
        response: {
          status: 400,
          data: { message: "User already exists" },
        },
      });

      await expect(
        authService.register({
          name: "Existing User",
          email: "existing@example.com",
          password: "Password123",
          role: "CUSTOMER",
        })
      ).rejects.toThrow();
    });
  });

  describe("logout", () => {
    it("should successfully logout", async () => {
      mockAxios.post = jest
        .fn()
        .mockResolvedValue({ data: { message: "Logout successful" } });

      await authService.logout();

      expect(mockAxios.post).toHaveBeenCalledWith("/auth/logout");
    });
  });

  describe("forgotPassword", () => {
    it("should send password reset email", async () => {
      mockAxios.post = jest.fn().mockResolvedValue({
        data: { message: "Reset email sent" },
      });

      await authService.forgotPassword("user@example.com");

      expect(mockAxios.post).toHaveBeenCalledWith("/auth/forgot-password", {
        email: "user@example.com",
      });
    });
  });

  describe("getCurrentUser", () => {
    it("should fetch current user profile", async () => {
      const mockUser = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "CUSTOMER",
      };

      mockAxios.get = jest.fn().mockResolvedValue({
        data: { user: mockUser },
      });

      const result = await authService.getCurrentUser();

      expect(mockAxios.get).toHaveBeenCalledWith("/user/profile");
      expect(result).toEqual(mockUser);
    });
  });
});
