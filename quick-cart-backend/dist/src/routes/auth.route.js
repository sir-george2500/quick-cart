import express from "express";
import { createSeller, login, loginAdmin, logoutUser, registerUser, createAdmin, } from "../controllers/auth.controller.js";
import { isSuperAdmin } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rate-limit.js";
const router = express.Router();
/**
 * A User
 * @typedef {object} User
 * @property {string} id - User ID
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {string} role - User role (SUPER_ADMIN, VENDOR, CUSTOMER, SUPPORT)
 * @property {string} avatar - Profile picture URL
 * @property {boolean} isApproved - Vendor approval status
 */
/**
 * Register Request
 * @typedef {object} RegisterRequest
 * @property {string} name.required - Full name - example: John Doe
 * @property {string} email.required - Email address - example: john@example.com
 * @property {string} password.required - Password (min 8 characters) - example: SecurePass123!
 * @property {string} role.required - User role (CUSTOMER or VENDOR) - enum:CUSTOMER,VENDOR - example: CUSTOMER
 */
/**
 * Login Request
 * @typedef {object} LoginRequest
 * @property {string} email.required - Email address - example: john@example.com
 * @property {string} password.required - Password - example: SecurePass123!
 */
/**
 * POST /api/v1/auth/register
 * @summary Register a new user
 * @tags 🔐 Authentication
 * @description 🔓 **Public Endpoint** - Register as customer or vendor. Vendors require admin approval.
 * @param {RegisterRequest} request.body.required - Registration info
 * @return {object} 201 - Success response
 * @return {object} 400 - Bad request / User exists
 * @example request - Customer Registration
 * {
 *   "name": "Jane Smith",
 *   "email": "jane@example.com",
 *   "password": "MyPassword123",
 *   "role": "CUSTOMER"
 * }
 * @example request - Vendor Registration
 * {
 *   "name": "Tech Store Owner",
 *   "email": "vendor@techstore.com",
 *   "password": "VendorPass123",
 *   "role": "VENDOR",
 *   "businessName": "Tech Store",
 *   "phoneNumber": "+1234567890"
 * }
 * @example response - 201 - Customer registered
 * {
 *   "message": "Customer account created successfully"
 * }
 * @example response - 400 - User exists
 * {
 *   "success": false,
 *   "message": "User already exists"
 * }
 */
router.post("/register", registerUser);
/**
 * POST /api/v1/auth/login
 * @summary User login
 * @tags 🔐 Authentication
 * @description 🔓 **Public Endpoint** - Login to get JWT token. Copy the token and click "Authorize" to test protected endpoints!
 * @param {LoginRequest} request.body.required - Login credentials
 * @return {User} 200 - Login successful with user data
 * @return {object} 401 - Invalid credentials
 * @example request - Login Example
 * {
 *   "email": "john@example.com",
 *   "password": "SecurePass123!"
 * }
 * @example response - 200 - Success
 * {
 *   "id": "507f1f77bcf86cd799439011",
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "role": "CUSTOMER",
 *   "avatar": null
 * }
 * @example response - 401 - Invalid credentials
 * {
 *   "message": "Invalid Credentials!"
 * }
 */
router.post("/login", authLimiter, login);
/**
 * POST /api/v1/auth/login/admin
 * @summary Admin/Super Admin login
 * @tags 🔐 Authentication
 * @description 🔓 **Public Endpoint** - Special login for admin users only
 * @param {LoginRequest} request.body.required - Admin credentials
 * @return {User} 200 - Admin login successful
 * @return {object} 401 - Not an admin or invalid credentials
 */
router.post("/login/admin", authLimiter, loginAdmin);
/**
 * POST /api/v1/auth/logout
 * @summary User logout
 * @tags 🔐 Authentication
 * @description 🔒 **Protected** - Clears authentication cookie
 * @security BearerAuth
 * @return {object} 200 - Logout successful
 * @example response - 200
 * {
 *   "message": "Logout Successful"
 * }
 */
router.post("/logout", logoutUser);
/**
 * POST /api/v1/auth/seller
 * @summary Register as vendor/seller
 * @tags 🔐 Authentication
 * @description 🔓 **Public Endpoint** - Register as vendor. Requires admin approval before selling.
 * @param {object} request.body.required - Vendor registration info
 * @return {object} 201 - Vendor registered, pending approval
 * @return {object} 400 - Bad request / User exists
 */
router.post("/seller", createSeller);
/**
 * POST /api/v1/auth/admin/create
 * @summary Create admin user
 * @tags 🔐 Authentication
 * @description 🛡️ **SUPER_ADMIN only** - Create new admin account
 * @security BearerAuth
 * @param {object} request.body.required - Admin user info
 * @return {object} 201 - Admin created successfully
 * @return {object} 403 - Insufficient permissions
 */
router.post("/admin/create", isSuperAdmin, createAdmin);
export default router;
//# sourceMappingURL=auth.route.js.map