import { PermissionService } from "../services/permission.service.js";
export class RBACGuard {
    permissionService;
    constructor() {
        this.permissionService = new PermissionService();
    }
    /**
     * Middleware factory to check if user has required permission
     */
    requirePermission(requiredPermission) {
        return (req, res, next) => {
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
    requireAnyPermission(requiredPermissions) {
        return (req, res, next) => {
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
    requireAllPermissions(requiredPermissions) {
        return (req, res, next) => {
            const user = req.user;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }
            if (!this.permissionService.hasAllPermissions(user, requiredPermissions)) {
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
    requireOwnership(resourceGetter) {
        return async (req, res, next) => {
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
            }
            catch (error) {
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
//# sourceMappingURL=rbac.guard.js.map