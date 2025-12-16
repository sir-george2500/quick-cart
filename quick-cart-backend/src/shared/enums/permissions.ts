// Permission and Role enums
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  VENDOR = "VENDOR",
  CUSTOMER = "CUSTOMER",
  SUPPORT = "SUPPORT",
}

export enum Permission {
  // User permissions
  USER_READ = "USER_READ",
  USER_CREATE = "USER_CREATE",
  USER_UPDATE = "USER_UPDATE",
  USER_DELETE = "USER_DELETE",

  // Vendor permissions
  VENDOR_READ = "VENDOR_READ",
  VENDOR_CREATE = "VENDOR_CREATE",
  VENDOR_UPDATE = "VENDOR_UPDATE",
  VENDOR_APPROVE = "VENDOR_APPROVE",
  VENDOR_SUSPEND = "VENDOR_SUSPEND",
  VENDOR_DELETE = "VENDOR_DELETE",

  // Product permissions
  PRODUCT_READ = "PRODUCT_READ",
  PRODUCT_CREATE = "PRODUCT_CREATE",
  PRODUCT_UPDATE = "PRODUCT_UPDATE",
  PRODUCT_DELETE = "PRODUCT_DELETE",
  PRODUCT_MODERATE = "PRODUCT_MODERATE",

  // Order permissions
  ORDER_READ = "ORDER_READ",
  ORDER_CREATE = "ORDER_CREATE",
  ORDER_UPDATE = "ORDER_UPDATE",
  ORDER_CANCEL = "ORDER_CANCEL",
  ORDER_REFUND = "ORDER_REFUND",

  // Commission permissions
  COMMISSION_READ = "COMMISSION_READ",
  COMMISSION_CONFIGURE = "COMMISSION_CONFIGURE",

  // Platform permissions
  PLATFORM_SETTINGS = "PLATFORM_SETTINGS",
  ANALYTICS_VIEW = "ANALYTICS_VIEW",
}

// Permission matrix - defines what each role can do
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission), // All permissions

  [UserRole.VENDOR]: [
    Permission.PRODUCT_READ,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_UPDATE,
    Permission.PRODUCT_DELETE,
    Permission.ORDER_READ,
    Permission.ORDER_UPDATE,
    Permission.COMMISSION_READ,
  ],

  [UserRole.CUSTOMER]: [
    Permission.PRODUCT_READ,
    Permission.ORDER_READ,
    Permission.ORDER_CREATE,
    Permission.ORDER_CANCEL,
  ],

  [UserRole.SUPPORT]: [
    Permission.USER_READ,
    Permission.VENDOR_READ,
    Permission.PRODUCT_READ,
    Permission.ORDER_READ,
    Permission.ORDER_UPDATE,
  ],
};
