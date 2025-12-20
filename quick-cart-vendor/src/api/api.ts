import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import {
  User,
  LoginRequest,
  LoginResponse,
  VendorRegistrationRequest,
  VendorRegistrationResponse,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ApiError,
} from "../types";

/**
 * API Configuration
 * Uses environment variable for base URL, with fallback
 */
const getApiBaseUrl = (): string => {
  try {
    return (
      import.meta.env?.VITE_API_BASE_URL ||
      "https://messier-ricarda-genotypically.ngrok-free.dev/api/v1"
    );
  } catch {
    return "https://messier-ricarda-genotypically.ngrok-free.dev/api/v1";
  }
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * - Adds ngrok-skip-browser-warning header for ngrok URLs
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add header to skip ngrok browser warning
    if (API_BASE_URL.includes("ngrok")) {
      config.headers["ngrok-skip-browser-warning"] = "true";
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handles token refresh on 401 errors (future implementation)
 * - Standardizes error responses
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    // TODO: Implement token refresh logic when backend supports it
    // const originalRequest = error.config;
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     await authApiRequests.refreshToken();
    //     return apiClient(originalRequest);
    //   } catch (refreshError) {
    //     // Redirect to login
    //   }
    // }
    return Promise.reject(error);
  }
);

// ============================================================================
// API Route Definitions
// ============================================================================

const authRoutes = {
  login: "/auth/login",
  logout: "/auth/logout",
  createVendor: "/auth/seller",
  register: "/auth/register",
} as const;

const userRoutes = {
  getUsers: "/user/get-users",
  getUserById: "/user/:userId",
  updateUserByEmail: "/user/:email",
  forgotPassword: "/user/forgot-password",
  verifyOtpAndResetPassword: "/user/verify-otp-reset-password",
  resendSecurityCode: "/user/resend-security-code",
} as const;

const productRoutes = {
  getProducts: "/products",
  createProduct: "/products",
  deleteProduct: "/products/:id",
  updateProduct: "/products/:id",
} as const;

const orderRoutes = {
  getOrders: "/orders/get-orders",
  createOrder: "/orders/place-order",
  updateOrder: "/orders/update-order/:orderId",
  cancelOrder: "/orders/cancel-order/:orderId",
  getUserOrders: "/orders/user-orders",
  getOrdersForStore: "/orders/store-orders",
  placeVirtualOrder: "/orders/place-virtual-order",
} as const;

const categoryRoutes = {
  getCategories: "/categories",
} as const;

// ============================================================================
// Authentication API Requests
// ============================================================================

export const authApiRequests = {
  /**
   * Login vendor with email and password
   * @param email - Vendor email
   * @param password - Vendor password
   * @returns User data on success (tokens set via httpOnly cookies)
   */
  loginVendor: async (
    email: string,
    password: string
  ): Promise<AxiosResponse<LoginResponse>> => {
    const payload: LoginRequest = { email, password };
    return apiClient.post<LoginResponse>(authRoutes.login, payload);
  },

  /**
   * Register a new vendor account
   * @param vendorData - Vendor registration data
   * @returns Success message (account pending approval)
   */
  createVendor: async (
    vendorData: VendorRegistrationRequest
  ): Promise<AxiosResponse<VendorRegistrationResponse>> => {
    return apiClient.post<VendorRegistrationResponse>(
      authRoutes.createVendor,
      vendorData
    );
  },

  /**
   * Logout the current user
   * Clears authentication cookies
   */
  logout: async (): Promise<AxiosResponse<{ message: string }>> => {
    return apiClient.post(authRoutes.logout);
  },
};

// ============================================================================
// User API Requests
// ============================================================================

export const userApiRequest = {
  /**
   * Get all users (admin only)
   */
  getUsers: async (
    params?: Record<string, unknown>
  ): Promise<AxiosResponse<{ success: boolean; data: User[] }>> => {
    return apiClient.get(userRoutes.getUsers, { params });
  },

  /**
   * Get user by ID
   */
  getUserById: async (
    userId: string
  ): Promise<AxiosResponse<{ success: boolean; data: User }>> => {
    return apiClient.get(userRoutes.getUserById.replace(":userId", userId));
  },

  /**
   * Update user by email
   */
  updateUserByEmail: async (
    email: string,
    updatedUserData: Partial<User>
  ): Promise<
    AxiosResponse<{ success: boolean; message: string; data: User }>
  > => {
    return apiClient.put(
      userRoutes.updateUserByEmail.replace(":email", email),
      updatedUserData
    );
  },

  /**
   * Request password reset - sends security code to email
   */
  forgotPassword: async (
    email: string
  ): Promise<AxiosResponse<ForgotPasswordResponse>> => {
    return apiClient.post(userRoutes.forgotPassword, { email });
  },

  /**
   * Verify OTP and reset password
   */
  verifyOtpAndResetPassword: async (
    email: string,
    securityCode: string,
    newPassword: string
  ): Promise<AxiosResponse<ResetPasswordResponse>> => {
    const payload: ResetPasswordRequest = { email, securityCode, newPassword };
    return apiClient.post(userRoutes.verifyOtpAndResetPassword, payload);
  },

  /**
   * Resend security code for password reset
   */
  resendSecurityCode: async (
    email: string
  ): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    return apiClient.post(userRoutes.resendSecurityCode, { email });
  },
};

// ============================================================================
// Product API Requests
// ============================================================================

export const productApiRequests = {
  /**
   * Get all products
   */
  getProducts: async (): Promise<AxiosResponse<unknown>> => {
    return apiClient.get(productRoutes.getProducts);
  },

  /**
   * Create a new product
   */
  createProduct: async (
    productData: FormData
  ): Promise<AxiosResponse<unknown>> => {
    return apiClient.post(productRoutes.createProduct, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Delete a product by ID
   */
  deleteProduct: async (productId: string): Promise<AxiosResponse<unknown>> => {
    return apiClient.delete(
      productRoutes.deleteProduct.replace(":id", productId)
    );
  },

  /**
   * Update a product by ID
   */
  updateProduct: async (
    productId: string,
    updatedProductData: unknown
  ): Promise<AxiosResponse<unknown>> => {
    return apiClient.put(
      productRoutes.updateProduct.replace(":id", productId),
      updatedProductData
    );
  },
};

// ============================================================================
// Category API Requests
// ============================================================================

export const categoryApiRequests = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<AxiosResponse<unknown>> => {
    return apiClient.get(categoryRoutes.getCategories);
  },
};

// ============================================================================
// Order API Requests
// ============================================================================

export const ordersApiRequests = {
  /**
   * Get all orders
   */
  getOrders: async (): Promise<AxiosResponse<unknown>> => {
    return apiClient.get(orderRoutes.getOrders);
  },

  /**
   * Create a new order
   */
  createOrder: async (orderData: unknown): Promise<AxiosResponse<unknown>> => {
    return apiClient.post(orderRoutes.createOrder, orderData);
  },

  /**
   * Update an order
   */
  updateOrder: async (
    orderId: string,
    updatedOrderData: unknown
  ): Promise<AxiosResponse<unknown>> => {
    return apiClient.put(
      orderRoutes.updateOrder.replace(":orderId", orderId),
      updatedOrderData
    );
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (orderId: string): Promise<AxiosResponse<unknown>> => {
    return apiClient.delete(
      orderRoutes.cancelOrder.replace(":orderId", orderId)
    );
  },

  /**
   * Get orders for the current user
   */
  getUserOrders: async (): Promise<AxiosResponse<unknown>> => {
    return apiClient.get(orderRoutes.getUserOrders);
  },

  /**
   * Get orders for a store
   */
  getOrdersForStore: async (): Promise<AxiosResponse<unknown>> => {
    return apiClient.get(orderRoutes.getOrdersForStore);
  },
};

// Export the api client for direct use if needed
export { apiClient };
