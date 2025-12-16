import { Permission, UserRole } from "../enums/permissions.js";
export interface User {
    id: string;
    role: UserRole;
    permissions?: Permission[];
}
export declare class PermissionService {
    /**
     * Check if user has a specific permission
     */
    hasPermission(user: User, requiredPermission: Permission): boolean;
    /**
     * Check if user has any of the required permissions
     */
    hasAnyPermission(user: User, requiredPermissions: Permission[]): boolean;
    /**
     * Check if user has all required permissions
     */
    hasAllPermissions(user: User, requiredPermissions: Permission[]): boolean;
    /**
     * Check if user owns a resource (vendor can only access their own resources)
     */
    checkOwnership(userId: string, resource: {
        vendorId?: string;
        userId?: string;
        ownerId?: string;
    }): boolean;
    /**
     * Get all permissions for a user
     */
    getUserPermissions(user: User): Permission[];
}
//# sourceMappingURL=permission.service.d.ts.map