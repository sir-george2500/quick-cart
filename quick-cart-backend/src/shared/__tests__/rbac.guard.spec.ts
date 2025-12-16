import { Response, NextFunction } from "express";
import { RBACGuard, AuthRequest } from "../guards/rbac.guard";
import { Permission, UserRole } from "../enums/permissions";
import { User } from "../services/permission.service";

describe("RBACGuard", () => {
  let guard: RBACGuard;
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    guard = new RBACGuard();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("requirePermission", () => {
    it("should allow access when user has permission", () => {
      const user: User = {
        id: "1",
        role: UserRole.VENDOR,
      };
      mockRequest.user = user;

      const middleware = guard.requirePermission(Permission.PRODUCT_CREATE);
      middleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should deny access when user lacks permission", () => {
      const user: User = {
        id: "1",
        role: UserRole.CUSTOMER,
      };
      mockRequest.user = user;

      const middleware = guard.requirePermission(Permission.VENDOR_APPROVE);
      middleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Insufficient permissions",
        required: Permission.VENDOR_APPROVE,
      });
    });

    it("should return 401 when user is not authenticated", () => {
      mockRequest.user = undefined;

      const middleware = guard.requirePermission(Permission.PRODUCT_CREATE);
      middleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Authentication required",
      });
    });
  });

  describe("requireAnyPermission", () => {
    it("should allow access when user has at least one permission", () => {
      const user: User = {
        id: "1",
        role: UserRole.VENDOR,
      };
      mockRequest.user = user;

      const middleware = guard.requireAnyPermission([
        Permission.PRODUCT_CREATE,
        Permission.VENDOR_APPROVE,
      ]);
      middleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("should deny access when user has none of the permissions", () => {
      const user: User = {
        id: "1",
        role: UserRole.CUSTOMER,
      };
      mockRequest.user = user;

      const middleware = guard.requireAnyPermission([
        Permission.VENDOR_APPROVE,
        Permission.COMMISSION_CONFIGURE,
      ]);
      middleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });

  describe("requireAllPermissions", () => {
    it("should allow access when user has all permissions", () => {
      const user: User = {
        id: "1",
        role: UserRole.VENDOR,
      };
      mockRequest.user = user;

      const middleware = guard.requireAllPermissions([
        Permission.PRODUCT_CREATE,
        Permission.PRODUCT_READ,
      ]);
      middleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("should deny access when user is missing any permission", () => {
      const user: User = {
        id: "1",
        role: UserRole.VENDOR,
      };
      mockRequest.user = user;

      const middleware = guard.requireAllPermissions([
        Permission.PRODUCT_CREATE,
        Permission.VENDOR_APPROVE,
      ]);
      middleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });

  describe("requireOwnership", () => {
    it("should allow access when user owns the resource", async () => {
      const user: User = {
        id: "vendor-123",
        role: UserRole.VENDOR,
      };
      mockRequest.user = user;

      const resourceGetter = jest
        .fn()
        .mockResolvedValue({ vendorId: "vendor-123" });
      const middleware = guard.requireOwnership(resourceGetter);

      await middleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("should deny access when user does not own the resource", async () => {
      const user: User = {
        id: "vendor-123",
        role: UserRole.VENDOR,
      };
      mockRequest.user = user;

      const resourceGetter = jest
        .fn()
        .mockResolvedValue({ vendorId: "vendor-456" });
      const middleware = guard.requireOwnership(resourceGetter);

      await middleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Access denied - resource ownership required",
      });
    });

    it("should return 404 when resource not found", async () => {
      const user: User = {
        id: "vendor-123",
        role: UserRole.VENDOR,
      };
      mockRequest.user = user;

      const resourceGetter = jest.fn().mockResolvedValue(null);
      const middleware = guard.requireOwnership(resourceGetter);

      await middleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 on resource getter error", async () => {
      const user: User = {
        id: "vendor-123",
        role: UserRole.VENDOR,
      };
      mockRequest.user = user;

      const resourceGetter = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));
      const middleware = guard.requireOwnership(resourceGetter);

      await middleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
