import { PermissionService, User } from "../services/permission.service";
import { Permission, UserRole } from "../enums/permissions";

describe("PermissionService", () => {
  let service: PermissionService;

  beforeEach(() => {
    service = new PermissionService();
  });

  describe("hasPermission", () => {
    it("should return true when user has direct permission", () => {
      const user: User = {
        id: "1",
        role: UserRole.CUSTOMER,
        permissions: [Permission.PRODUCT_CREATE],
      };

      expect(service.hasPermission(user, Permission.PRODUCT_CREATE)).toBe(true);
    });

    it("should return true when user role has permission", () => {
      const user: User = {
        id: "1",
        role: UserRole.VENDOR,
      };

      expect(service.hasPermission(user, Permission.PRODUCT_CREATE)).toBe(true);
    });

    it("should return false when user lacks permission", () => {
      const user: User = {
        id: "1",
        role: UserRole.CUSTOMER,
      };

      expect(service.hasPermission(user, Permission.VENDOR_APPROVE)).toBe(
        false
      );
    });

    it("should return true for super admin regardless of permission", () => {
      const user: User = {
        id: "1",
        role: UserRole.SUPER_ADMIN,
      };

      expect(service.hasPermission(user, Permission.VENDOR_APPROVE)).toBe(true);
      expect(service.hasPermission(user, Permission.COMMISSION_CONFIGURE)).toBe(
        true
      );
    });

    it("should prioritize direct permissions over role permissions", () => {
      const user: User = {
        id: "1",
        role: UserRole.CUSTOMER,
        permissions: [Permission.VENDOR_READ],
      };

      expect(service.hasPermission(user, Permission.VENDOR_READ)).toBe(true);
    });
  });

  describe("hasAnyPermission", () => {
    it("should return true if user has at least one permission", () => {
      const user: User = {
        id: "1",
        role: UserRole.VENDOR,
      };

      const result = service.hasAnyPermission(user, [
        Permission.PRODUCT_CREATE,
        Permission.VENDOR_APPROVE,
      ]);

      expect(result).toBe(true);
    });

    it("should return false if user has none of the permissions", () => {
      const user: User = {
        id: "1",
        role: UserRole.CUSTOMER,
      };

      const result = service.hasAnyPermission(user, [
        Permission.VENDOR_APPROVE,
        Permission.COMMISSION_CONFIGURE,
      ]);

      expect(result).toBe(false);
    });
  });

  describe("hasAllPermissions", () => {
    it("should return true if user has all permissions", () => {
      const user: User = {
        id: "1",
        role: UserRole.VENDOR,
      };

      const result = service.hasAllPermissions(user, [
        Permission.PRODUCT_CREATE,
        Permission.PRODUCT_READ,
      ]);

      expect(result).toBe(true);
    });

    it("should return false if user is missing any permission", () => {
      const user: User = {
        id: "1",
        role: UserRole.VENDOR,
      };

      const result = service.hasAllPermissions(user, [
        Permission.PRODUCT_CREATE,
        Permission.VENDOR_APPROVE,
      ]);

      expect(result).toBe(false);
    });
  });

  describe("checkOwnership", () => {
    it("should allow vendor to access own resources via vendorId", () => {
      const vendorId = "vendor-123";
      const resource = { vendorId: "vendor-123" };

      expect(service.checkOwnership(vendorId, resource)).toBe(true);
    });

    it("should allow user to access own resources via userId", () => {
      const userId = "user-123";
      const resource = { userId: "user-123" };

      expect(service.checkOwnership(userId, resource)).toBe(true);
    });

    it("should allow user to access own resources via ownerId", () => {
      const userId = "user-123";
      const resource = { ownerId: "user-123" };

      expect(service.checkOwnership(userId, resource)).toBe(true);
    });

    it("should deny vendor access to other vendor resources", () => {
      const vendorId = "vendor-123";
      const resource = { vendorId: "vendor-456" };

      expect(service.checkOwnership(vendorId, resource)).toBe(false);
    });
  });

  describe("getUserPermissions", () => {
    it("should return all permissions for super admin", () => {
      const user: User = {
        id: "1",
        role: UserRole.SUPER_ADMIN,
      };

      const permissions = service.getUserPermissions(user);

      expect(permissions.length).toBeGreaterThan(0);
      expect(permissions).toContain(Permission.VENDOR_APPROVE);
      expect(permissions).toContain(Permission.COMMISSION_CONFIGURE);
    });

    it("should return role permissions for regular users", () => {
      const user: User = {
        id: "1",
        role: UserRole.VENDOR,
      };

      const permissions = service.getUserPermissions(user);

      expect(permissions).toContain(Permission.PRODUCT_CREATE);
      expect(permissions).not.toContain(Permission.VENDOR_APPROVE);
    });

    it("should combine role and direct permissions", () => {
      const user: User = {
        id: "1",
        role: UserRole.CUSTOMER,
        permissions: [Permission.VENDOR_READ],
      };

      const permissions = service.getUserPermissions(user);

      expect(permissions).toContain(Permission.PRODUCT_READ); // From role
      expect(permissions).toContain(Permission.VENDOR_READ); // Direct permission
    });

    it("should not duplicate permissions", () => {
      const user: User = {
        id: "1",
        role: UserRole.VENDOR,
        permissions: [Permission.PRODUCT_CREATE], // Already in role
      };

      const permissions = service.getUserPermissions(user);
      const productCreateCount = permissions.filter(
        (p) => p === Permission.PRODUCT_CREATE
      ).length;

      expect(productCreateCount).toBe(1);
    });
  });
});
