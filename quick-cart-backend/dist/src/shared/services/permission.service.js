import { Permission, UserRole, RolePermissions } from "../enums/permissions.js";
export class PermissionService {
    /**
     * Check if user has a specific permission
     */
    hasPermission(user, requiredPermission) {
        // Super admin has all permissions
        if (user.role === UserRole.SUPER_ADMIN) {
            return true;
        }
        // Check direct user permissions (overrides)
        if (user.permissions && user.permissions.includes(requiredPermission)) {
            return true;
        }
        // Check role-based permissions
        const rolePermissions = RolePermissions[user.role] || [];
        return rolePermissions.includes(requiredPermission);
    }
    /**
     * Check if user has any of the required permissions
     */
    hasAnyPermission(user, requiredPermissions) {
        return requiredPermissions.some((permission) => this.hasPermission(user, permission));
    }
    /**
     * Check if user has all required permissions
     */
    hasAllPermissions(user, requiredPermissions) {
        return requiredPermissions.every((permission) => this.hasPermission(user, permission));
    }
    /**
     * Check if user owns a resource (vendor can only access their own resources)
     */
    checkOwnership(userId, resource) {
        return (resource.vendorId === userId ||
            resource.userId === userId ||
            resource.ownerId === userId);
    }
    /**
     * Get all permissions for a user
     */
    getUserPermissions(user) {
        if (user.role === UserRole.SUPER_ADMIN) {
            return Object.values(Permission);
        }
        const rolePermissions = RolePermissions[user.role] || [];
        const directPermissions = user.permissions || [];
        // Combine and deduplicate
        return [...new Set([...rolePermissions, ...directPermissions])];
    }
}
//# sourceMappingURL=permission.service.js.map