/**
 * API Error Tests
 */

import { ApiException } from "../errors";

describe("ApiException", () => {
  describe("constructor", () => {
    it("should create exception with required fields", () => {
      const exception = new ApiException(400, "Bad request");

      expect(exception.status).toBe(400);
      expect(exception.message).toBe("Bad request");
      expect(exception.name).toBe("ApiException");
      expect(exception.code).toBeUndefined();
    });

    it("should create exception with optional fields", () => {
      const exception = new ApiException(
        422,
        "Validation failed",
        "VALIDATION_ERROR",
        {
          field: "email",
        }
      );

      expect(exception.status).toBe(422);
      expect(exception.code).toBe("VALIDATION_ERROR");
      expect(exception.details).toEqual({ field: "email" });
    });
  });

  describe("fromAxiosError", () => {
    it("should extract error from axios response", () => {
      const axiosError = {
        response: {
          status: 401,
          data: { message: "Invalid credentials", code: "AUTH_FAILED" },
        },
      };

      const exception = ApiException.fromAxiosError(axiosError);

      expect(exception.status).toBe(401);
      expect(exception.message).toBe("Invalid credentials");
      expect(exception.code).toBe("AUTH_FAILED");
    });

    it("should handle missing response data", () => {
      const axiosError = {
        message: "Network Error",
      };

      const exception = ApiException.fromAxiosError(axiosError);

      expect(exception.status).toBe(500);
      expect(exception.message).toBe("Network Error");
    });

    it("should handle non-object errors", () => {
      const exception = ApiException.fromAxiosError("some error");

      expect(exception.status).toBe(500);
      expect(exception.message).toBe("An unexpected error occurred");
    });

    it("should handle Error instances", () => {
      const error = new Error("Something went wrong");
      const exception = ApiException.fromAxiosError(error);

      expect(exception.status).toBe(500);
      expect(exception.message).toBe("Something went wrong");
    });
  });

  describe("error type helpers", () => {
    it("should identify auth errors", () => {
      const exception = new ApiException(401, "Unauthorized");
      expect(exception.isAuthError).toBe(true);
      expect(exception.isValidationError).toBe(false);
    });

    it("should identify validation errors", () => {
      const exception = new ApiException(400, "Bad request");
      expect(exception.isValidationError).toBe(true);
      expect(exception.isAuthError).toBe(false);
    });

    it("should identify not found errors", () => {
      const exception = new ApiException(404, "Not found");
      expect(exception.isNotFound).toBe(true);
    });

    it("should identify server errors", () => {
      const exception = new ApiException(500, "Internal error");
      expect(exception.isServerError).toBe(true);

      const exception503 = new ApiException(503, "Service unavailable");
      expect(exception503.isServerError).toBe(true);
    });
  });
});
