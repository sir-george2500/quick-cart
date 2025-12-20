/**
 * Authentication Types for Quick-Cart Vendor Dashboard
 *
 * These types define the data structures used for authentication
 * with the Quick-Cart backend API.
 */

/**
 * User object returned from the API after successful authentication
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  isApproved: boolean;
  businessName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  storeId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Request payload for user login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Response from successful login - returns User data
 * Tokens are set via httpOnly cookies
 */
export interface LoginResponse extends User {}

/**
 * Request payload for vendor registration
 */
export interface VendorRegistrationRequest {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
}

/**
 * Response from successful vendor registration
 */
export interface VendorRegistrationResponse {
  message: string;
}

/**
 * Request payload for forgot password
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Response from forgot password request
 */
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Request payload for password reset
 */
export interface ResetPasswordRequest {
  email: string;
  securityCode: string;
  newPassword: string;
}

/**
 * Response from password reset
 */
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Request payload for resending security code
 */
export interface ResendCodeRequest {
  email: string;
}

/**
 * Generic API error response
 */
export interface ApiError {
  success?: boolean;
  message: string;
}

/**
 * Auth context state
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

/**
 * Auth context actions
 */
export interface AuthActions {
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  setUserAvatar: (avatarUrl: string) => void;
}

/**
 * Complete auth context type
 */
export interface AuthContextType extends AuthState, AuthActions {}
