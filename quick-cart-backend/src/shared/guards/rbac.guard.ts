import { Request, Response, NextFunction } from "express";
import { PermissionService, User } from "../services/permission.service.js";
import { Permission } from "../enums/permissions.js";

export interface AuthRequest extends Request {
  user?: User;
}

export class RBACGuard {
  private permissionService: PermissionService;

  constructor() {
    this.permissionService = new PermissionService();
  }

  /**
   * Middleware factory to check if user has required permission
   */
  requirePermission(requiredPermission: Permission) {
    return (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): void | Response => {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (!this.permissionService.hasPermission(user, requiredPermission)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
          required: requiredPermission,
        });
      }

      next();
    };
  }

  /**
   * Middleware factory to check if user has any of the required permissions
   */
  requireAnyPermission(requiredPermissions: Permission[]) {
    return (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): void | Response => {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (!this.permissionService.hasAnyPermission(user, requiredPermissions)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
          required: requiredPermissions,
        });
      }

      next();
    };
  }

  /**
   * Middleware factory to check if user has all required permissions
   */
  requireAllPermissions(requiredPermissions: Permission[]) {
    return (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): void | Response => {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (
        !this.permissionService.hasAllPermissions(user, requiredPermissions)
      ) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
          required: requiredPermissions,
        });
      }

      next();
    };
  }

  /**
   * Middleware to ensure user owns the resource
   */
  requireOwnership(
    resourceGetter: (
      req: AuthRequest
    ) => { vendorId?: string; userId?: string; ownerId?: string } | Promise<any>
  ) {
    return async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ): Promise<void | Response> => {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      try {
        const resource = await resourceGetter(req);

        if (!resource) {
          return res.status(404).json({
            success: false,
            message: "Resource not found",
          });
        }

        if (!this.permissionService.checkOwnership(user.id, resource)) {
          return res.status(403).json({
            success: false,
            message: "Access denied - resource ownership required",
          });
        }

        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error checking resource ownership",
        });
      }
    };
  }
}

// Export singleton instance
export const rbacGuard = new RBACGuard();
