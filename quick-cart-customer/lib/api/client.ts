/**
 * API Client - Centralized HTTP client with proper error handling
 * Follows clean architecture principles
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";
import { Config } from "@/constants/Config";
import { ApiException } from "./errors";

class ApiClient {
  private readonly client: AxiosInstance;
  private static instance: ApiClient | null = null;

  private constructor() {
    this.client = axios.create({
      baseURL: Config.apiUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        // Required for ngrok free tier
        "ngrok-skip-browser-warning": "true",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Singleton pattern for consistent client instance
   */
  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Configure request/response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - attach auth token and log
    this.client.interceptors.request.use(
      async (config) => {
        console.log(
          `[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
        );
        if (config.data) {
          console.log("[API] Request body:", JSON.stringify(config.data));
        }
        try {
          const token = await SecureStore.getItemAsync(Config.tokenKey);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("[API] Auth token attached");
          }
        } catch {
          // Silently fail if secure store is unavailable
        }
        return config;
      },
      (error) => {
        console.error("[API] Request error:", error);
        return Promise.reject(ApiException.fromAxiosError(error));
      }
    );

    // Response interceptor - handle errors uniformly
    this.client.interceptors.response.use(
      (response) => {
        console.log(
          `[API] Response ${response.status}:`,
          JSON.stringify(response.data).slice(0, 200)
        );
        return response;
      },
      async (error) => {
        console.error("[API] Response error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        const apiError = ApiException.fromAxiosError(error);

        // Handle auth errors
        if (apiError.isAuthError) {
          console.log("[API] Auth error detected, clearing token");
          try {
            await SecureStore.deleteItemAsync(Config.tokenKey);
          } catch {
            // Silently fail
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(
      url,
      data,
      config
    );
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(
      url,
      data,
      config
    );
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();
export { ApiClient };
