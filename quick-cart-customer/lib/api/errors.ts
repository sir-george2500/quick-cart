/**
 * API Error types for proper error handling
 */

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export class ApiException extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiException";
  }

  static fromAxiosError(error: unknown): ApiException {
    if (error && typeof error === "object") {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string; code?: string };
        };
        message?: string;
      };

      const status = axiosError.response?.status ?? 500;
      const message =
        axiosError.response?.data?.message ??
        axiosError.message ??
        "An unexpected error occurred";
      const code = axiosError.response?.data?.code;

      return new ApiException(status, message, code);
    }

    if (error instanceof Error) {
      return new ApiException(500, error.message);
    }

    return new ApiException(500, "An unexpected error occurred");
  }

  get isAuthError(): boolean {
    return this.status === 401;
  }

  get isValidationError(): boolean {
    return this.status === 400;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}
