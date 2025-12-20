import { AxiosError } from "axios";
import { authApiRequests, userApiRequest } from "../api/api";
import {
  User,
  VendorRegistrationRequest,
  ResetPasswordRequest,
  ApiError,
} from "../types";

/**
 * Authentication Service
 *
 * Provides a clean interface for authentication operations,
 * handling API calls and error processing.
 */
class AuthService {
  /**
   * Login a vendor with email and password
   *
   * @param email - Vendor's email address
   * @param password - Vendor's password
   * @returns User object on success
   * @throws Error with message from API or generic message
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await authApiRequests.loginVendor(email, password);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Register a new vendor
   *
   * @param data - Vendor registration data
   * @returns Success message
   * @throws Error with message from API
   */
  async registerVendor(data: VendorRegistrationRequest): Promise<string> {
    try {
      const response = await authApiRequests.createVendor(data);
      return response.data.message;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout the current user
   * Clears authentication cookies on the server
   *
   * @throws Error if logout fails
   */
  async logout(): Promise<void> {
    try {
      await authApiRequests.logout();
    } catch (error) {
      // Even if the API call fails, we should clear local state
      console.error("Logout API call failed:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Request a password reset
   * Sends a security code to the user's email
   *
   * @param email - User's email address
   * @throws Error if request fails
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await userApiRequest.forgotPassword(email);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reset password with security code
   *
   * @param data - Reset password data including email, security code, and new password
   * @throws Error if reset fails
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      await userApiRequest.verifyOtpAndResetPassword(
        data.email,
        data.securityCode,
        data.newPassword
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Resend security code for password reset
   *
   * @param email - User's email address
   * @throws Error if resend fails
   */
  async resendSecurityCode(email: string): Promise<void> {
    try {
      await userApiRequest.resendSecurityCode(email);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   *
   * @param email - User's email
   * @param data - Partial user data to update
   * @returns Updated user data
   */
  async updateProfile(email: string, data: Partial<User>): Promise<User> {
    try {
      const response = await userApiRequest.updateUserByEmail(email, data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors and extract meaningful messages
   *
   * @param error - Error from API call
   * @returns Error with user-friendly message
   */
  private handleError(error: unknown): Error {
    // Check for AxiosError instance
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiError | undefined;

      // Return API error message if available
      if (apiError?.message) {
        return new Error(apiError.message);
      }

      // Handle specific HTTP status codes
      switch (error.response?.status) {
        case 400:
          return new Error("Invalid request. Please check your input.");
        case 401:
          return new Error("Invalid credentials. Please try again.");
        case 403:
          return new Error("You are not authorized to perform this action.");
        case 404:
          return new Error("Resource not found.");
        case 500:
          return new Error("Server error. Please try again later.");
        default:
          return new Error("An unexpected error occurred. Please try again.");
      }
    }

    // Check for error-like objects with response property (e.g., from mocks or edge cases)
    const errorWithResponse = error as {
      response?: { data?: ApiError; status?: number };
    };
    if (errorWithResponse?.response) {
      const apiError = errorWithResponse.response.data;

      if (apiError?.message) {
        return new Error(apiError.message);
      }

      switch (errorWithResponse.response.status) {
        case 400:
          return new Error("Invalid request. Please check your input.");
        case 401:
          return new Error("Invalid credentials. Please try again.");
        case 403:
          return new Error("You are not authorized to perform this action.");
        case 404:
          return new Error("Resource not found.");
        case 500:
          return new Error("Server error. Please try again later.");
        default:
          return new Error("An unexpected error occurred. Please try again.");
      }
    }

    // Return the error if it's already an Error instance
    if (error instanceof Error) {
      return error;
    }

    // Fallback for unknown error types
    return new Error("An unexpected error occurred.");
  }

  /**
   * Validate if user has vendor role
   *
   * @param user - User object to validate
   * @returns true if user is a seller/vendor
   */
  isVendor(user: User): boolean {
    return user.role === "seller";
  }

  /**
   * Check if vendor account is approved
   *
   * @param user - User object to check
   * @returns true if account is approved
   */
  isApproved(user: User): boolean {
    return user.isApproved === true;
  }
}

// Export a singleton instance
export const authService = new AuthService();

// Also export the class for testing purposes
export { AuthService };
