import { Request, Response, NextFunction } from "express";
import { User } from "../services/permission.service.js";
import { Permission } from "../enums/permissions.js";
export interface AuthRequest extends Request {
    user?: User;
}
export declare class RBACGuard {
    private permissionService;
    constructor();
    /**
     * Middleware factory to check if user has required permission
     */
    requirePermission(requiredPermission: Permission): (req: AuthRequest, res: Response, next: NextFunction) => void | Response;
    /**
     * Middleware factory to check if user has any of the required permissions
     */
    requireAnyPermission(requiredPermissions: Permission[]): (req: AuthRequest, res: Response, next: NextFunction) => void | Response;
    /**
     * Middleware factory to check if user has all required permissions
     */
    requireAllPermissions(requiredPermissions: Permission[]): (req: AuthRequest, res: Response, next: NextFunction) => void | Response;
    /**
     * Middleware to ensure user owns the resource
     */
    requireOwnership(resourceGetter: (req: AuthRequest) => {
        vendorId?: string;
        userId?: string;
        ownerId?: string;
    } | Promise<any>): (req: AuthRequest, res: Response, next: NextFunction) => Promise<void | Response>;
}
export declare const rbacGuard: RBACGuard;
//# sourceMappingURL=rbac.guard.d.ts.map