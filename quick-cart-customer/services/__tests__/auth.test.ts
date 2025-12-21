import { authService } from "../auth";
import api from "../api";

// Mock the api module
jest.mock("../api", () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

const mockApi = api as jest.Mocked<typeof api>;

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

      mockApi.post = jest.fn().mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: "john@example.com",
        password: "password123",
      });

      expect(mockApi.post).toHaveBeenCalledWith("/auth/login", {
        email: "john@example.com",
        password: "password123",
      });

      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error on invalid credentials", async () => {
      const error = {
        response: {
          status: 401,
          data: { message: "Invalid credentials" },
        },
      };
      mockApi.post = jest.fn().mockRejectedValue(error);

      await expect(
        authService.login({
          email: "wrong@example.com",
          password: "wrongpass",
        })
      ).rejects.toEqual(error);
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

      mockApi.post = jest.fn().mockResolvedValue(mockResponse);

      const result = await authService.register({
        name: "Jane Smith",
        email: "jane@example.com",
        password: "SecurePass123",
        role: "CUSTOMER",
      });

      expect(mockApi.post).toHaveBeenCalledWith("/auth/register", {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "SecurePass123",
        role: "CUSTOMER",
      });

      expect(result).toEqual(mockResponse.data);
    });

    it("should handle registration error for existing user", async () => {
      const error = {
        response: {
          status: 400,
          data: { message: "User already exists" },
        },
      };
      mockApi.post = jest.fn().mockRejectedValue(error);

      await expect(
        authService.register({
          name: "Existing User",
          email: "existing@example.com",
          password: "Password123",
          role: "CUSTOMER",
        })
      ).rejects.toEqual(error);
    });
  });

  describe("logout", () => {
    it("should successfully logout", async () => {
      mockApi.post = jest
        .fn()
        .mockResolvedValue({ data: { message: "Logout successful" } });

      await authService.logout();

      expect(mockApi.post).toHaveBeenCalledWith("/auth/logout");
    });
  });

  describe("forgotPassword", () => {
    it("should send password reset email", async () => {
      mockApi.post = jest.fn().mockResolvedValue({
        data: { message: "Reset email sent" },
      });

      await authService.forgotPassword("user@example.com");

      expect(mockApi.post).toHaveBeenCalledWith("/auth/forgot-password", {
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

      mockApi.get = jest.fn().mockResolvedValue({
        data: { user: mockUser },
      });

      const result = await authService.getCurrentUser();

      expect(mockApi.get).toHaveBeenCalledWith("/user/profile");
      expect(result).toEqual(mockUser);
    });
  });
});
