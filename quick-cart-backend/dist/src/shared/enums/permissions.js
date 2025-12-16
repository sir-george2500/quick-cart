// Permission and Role enums
export var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["VENDOR"] = "VENDOR";
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["SUPPORT"] = "SUPPORT";
})(UserRole || (UserRole = {}));
export var Permission;
(function (Permission) {
    // User permissions
    Permission["USER_READ"] = "USER_READ";
    Permission["USER_CREATE"] = "USER_CREATE";
    Permission["USER_UPDATE"] = "USER_UPDATE";
    Permission["USER_DELETE"] = "USER_DELETE";
    // Vendor permissions
    Permission["VENDOR_READ"] = "VENDOR_READ";
    Permission["VENDOR_CREATE"] = "VENDOR_CREATE";
    Permission["VENDOR_UPDATE"] = "VENDOR_UPDATE";
    Permission["VENDOR_APPROVE"] = "VENDOR_APPROVE";
    Permission["VENDOR_SUSPEND"] = "VENDOR_SUSPEND";
    Permission["VENDOR_DELETE"] = "VENDOR_DELETE";
    // Product permissions
    Permission["PRODUCT_READ"] = "PRODUCT_READ";
    Permission["PRODUCT_CREATE"] = "PRODUCT_CREATE";
    Permission["PRODUCT_UPDATE"] = "PRODUCT_UPDATE";
    Permission["PRODUCT_DELETE"] = "PRODUCT_DELETE";
    Permission["PRODUCT_MODERATE"] = "PRODUCT_MODERATE";
    // Order permissions
    Permission["ORDER_READ"] = "ORDER_READ";
    Permission["ORDER_CREATE"] = "ORDER_CREATE";
    Permission["ORDER_UPDATE"] = "ORDER_UPDATE";
    Permission["ORDER_CANCEL"] = "ORDER_CANCEL";
    Permission["ORDER_REFUND"] = "ORDER_REFUND";
    // Commission permissions
    Permission["COMMISSION_READ"] = "COMMISSION_READ";
    Permission["COMMISSION_CONFIGURE"] = "COMMISSION_CONFIGURE";
    // Platform permissions
    Permission["PLATFORM_SETTINGS"] = "PLATFORM_SETTINGS";
    Permission["ANALYTICS_VIEW"] = "ANALYTICS_VIEW";
})(Permission || (Permission = {}));
// Permission matrix - defines what each role can do
export const RolePermissions = {
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
//# sourceMappingURL=permissions.js.map