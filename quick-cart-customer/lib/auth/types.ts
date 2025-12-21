/**
 * Authentication types
 * Clean, well-documented type definitions
 */

// User types matching backend schema
export type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt?: string;
}

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// Response types
export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface LogoutResponse {
  message: string;
}

// Password reset
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface PasswordResetResponse {
  message: string;
}
