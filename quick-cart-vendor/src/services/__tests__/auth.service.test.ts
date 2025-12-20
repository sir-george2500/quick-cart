import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { authService } from "../auth.service";

// Define mock functions before mocking the module
const mockLoginVendor = jest.fn();
const mockCreateVendor = jest.fn();
const mockLogout = jest.fn();
const mockForgotPassword = jest.fn();
const mockVerifyOtpAndResetPassword = jest.fn();
const mockResendSecurityCode = jest.fn();
const mockUpdateUserByEmail = jest.fn();

// Mock the API modules
jest.mock("../../api/api", () => ({
  authApiRequests: {
    loginVendor: mockLoginVendor,
    createVendor: mockCreateVendor,
    logout: mockLogout,
  },
  userApiRequest: {
    forgotPassword: mockForgotPassword,
    verifyOtpAndResetPassword: mockVerifyOtpAndResetPassword,
    resendSecurityCode: mockResendSecurityCode,
    updateUserByEmail: mockUpdateUserByEmail,
  },
}));

/**
 * Mock user data for testing
 */
const mockUser = {
  id: "test-user-id",
  name: "Test Vendor",
  email: "vendor@test.com",
  role: "seller",
  avatar: null,
  isApproved: true,
  businessName: "Test Business",
  phoneNumber: "+1234567890",
  address: "123 Test St",
  city: "Test City",
  state: "Test State",
  storeId: "test-store-id",
};

const mockUnapprovedUser = {
  ...mockUser,
  id: "unapproved-user-id",
  email: "unapproved@test.com",
  isApproved: false,
};

const mockCustomerUser = {
  ...mockUser,
  id: "customer-user-id",
  email: "customer@test.com",
  role: "customer",
};

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      mockLoginVendor.mockResolvedValue({ data: mockUser });

      const user = await authService.login("vendor@test.com", "password123");

      expect(mockLoginVendor).toHaveBeenCalledWith(
        "vendor@test.com",
        "password123"
      );
      expect(user).toEqual(mockUser);
      expect(user.role).toBe("seller");
      expect(user.isApproved).toBe(true);
    });

    it("should throw error on invalid credentials", async () => {
      mockLoginVendor.mockRejectedValue({
        response: { data: { message: "Invalid Credentials!" }, status: 401 },
      });

      await expect(
        authService.login("vendor@test.com", "wrongpassword")
      ).rejects.toThrow("Invalid Credentials!");
    });

    it("should return unapproved user (validation done by caller)", async () => {
      mockLoginVendor.mockResolvedValue({ data: mockUnapprovedUser });

      const user = await authService.login(
        "unapproved@test.com",
        "password123"
      );

      expect(user).toEqual(mockUnapprovedUser);
      expect(user.isApproved).toBe(false);
    });

    it("should return customer user (role validation done by caller)", async () => {
      mockLoginVendor.mockResolvedValue({ data: mockCustomerUser });

      const user = await authService.login("customer@test.com", "password123");

      expect(user).toEqual(mockCustomerUser);
      expect(user.role).toBe("customer");
    });
  });

  describe("registerVendor", () => {
    it("should register vendor successfully", async () => {
      mockCreateVendor.mockResolvedValue({
        data: {
          message: "Seller account created successfully, pending approval.",
        },
      });

      const message = await authService.registerVendor({
        name: "New Vendor",
        email: "new@test.com",
        password: "password123",
        businessName: "New Business",
        phoneNumber: "+1234567890",
        address: "123 New St",
        city: "New City",
        state: "New State",
      });

      expect(message).toBe(
        "Seller account created successfully, pending approval."
      );
    });

    it("should throw error when user already exists", async () => {
      mockCreateVendor.mockRejectedValue({
        response: { data: { message: "User already exists" }, status: 400 },
      });

      await expect(
        authService.registerVendor({
          name: "Existing Vendor",
          email: "existing@test.com",
          password: "password123",
          businessName: "Existing Business",
          phoneNumber: "+1234567890",
          address: "123 Existing St",
          city: "Existing City",
          state: "Existing State",
        })
      ).rejects.toThrow("User already exists");
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      mockLogout.mockResolvedValue({ data: { message: "Logout Successful" } });

      await expect(authService.logout()).resolves.not.toThrow();
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe("forgotPassword", () => {
    it("should send security code successfully", async () => {
      mockForgotPassword.mockResolvedValue({
        data: { success: true, message: "Security code sent" },
      });

      await expect(
        authService.forgotPassword("vendor@test.com")
      ).resolves.not.toThrow();
      expect(mockForgotPassword).toHaveBeenCalledWith("vendor@test.com");
    });

    it("should throw error when user not found", async () => {
      mockForgotPassword.mockRejectedValue({
        response: { data: { message: "User not found" }, status: 404 },
      });

      await expect(
        authService.forgotPassword("notfound@test.com")
      ).rejects.toThrow("User not found");
    });
  });

  describe("resetPassword", () => {
    it("should reset password successfully", async () => {
      mockVerifyOtpAndResetPassword.mockResolvedValue({
        data: { success: true, message: "Password reset successfully" },
      });

      await expect(
        authService.resetPassword({
          email: "vendor@test.com",
          securityCode: "123456",
          newPassword: "newpassword123",
        })
      ).resolves.not.toThrow();
    });

    it("should throw error on invalid security code", async () => {
      mockVerifyOtpAndResetPassword.mockRejectedValue({
        response: {
          data: { message: "Invalid or expired security code" },
          status: 400,
        },
      });

      await expect(
        authService.resetPassword({
          email: "vendor@test.com",
          securityCode: "000000",
          newPassword: "newpassword123",
        })
      ).rejects.toThrow("Invalid or expired security code");
    });
  });

  describe("resendSecurityCode", () => {
    it("should resend security code successfully", async () => {
      mockResendSecurityCode.mockResolvedValue({
        data: { success: true, message: "New security code sent" },
      });

      await expect(
        authService.resendSecurityCode("vendor@test.com")
      ).resolves.not.toThrow();
    });

    it("should throw error if code already sent", async () => {
      mockResendSecurityCode.mockRejectedValue({
        response: {
          data: { message: "A security code has already been sent" },
          status: 400,
        },
      });

      await expect(
        authService.resendSecurityCode("code-sent@test.com")
      ).rejects.toThrow("A security code has already been sent");
    });
  });

  describe("isVendor", () => {
    it("should return true for seller role", () => {
      expect(authService.isVendor(mockUser)).toBe(true);
    });

    it("should return false for customer role", () => {
      expect(authService.isVendor(mockCustomerUser)).toBe(false);
    });
  });

  describe("isApproved", () => {
    it("should return true for approved user", () => {
      expect(authService.isApproved(mockUser)).toBe(true);
    });

    it("should return false for unapproved user", () => {
      expect(authService.isApproved(mockUnapprovedUser)).toBe(false);
    });
  });
});
