import express, { Router } from "express";
import {
  addDeliveryAddress,
  forgotPassword,
  getAllUsers,
  getUserById,
  removeAddressById,
  resendSecurityCode,
  updateAddressById,
  updateUserByEmail,
  verifyOtpAndResetPassword,
  deleteUserById,
} from "../controllers/user.controller.js";
import { isSuperAdmin, protect } from "../middleware/authMiddleware.js";

const router: Router = express.Router();

/**
 * Address
 * @typedef {object} Address
 * @property {string} id - Address ID
 * @property {string} street - Street address
 * @property {string} city - City
 * @property {string} state - State/Province
 * @property {string} zipCode - Postal code
 * @property {string} country - Country
 * @property {boolean} isDefault - Is default address
 */

/**
 * GET /api/v1/user/get-users
 * @summary Get all users
 * @tags 👥 Users
 * @description 🛡️ **ADMIN only** - Retrieve all users in system
 * @security BearerAuth
 * @return {array<object>} 200 - List of users
 * @return {object} 403 - Insufficient permissions
 */
router.get("/get-users", isSuperAdmin, getAllUsers);

/**
 * GET /api/v1/user/{userId}
 * @summary Get user by ID
 * @tags 👥 Users
 * @description 🔒 **Protected** - Get user profile details
 * @security BearerAuth
 * @param {string} userId.path.required - User ID
 * @return {object} 200 - User details
 * @return {object} 404 - User not found
 */
router.get("/:userId", protect, getUserById);

/**
 * PUT /api/v1/user/{email}
 * @summary Update user profile
 * @tags 👥 Users
 * @description 👤 **Ownership Required** - Update your profile information
 * @security BearerAuth
 * @param {string} email.path.required - User email
 * @param {object} request.body - Profile updates
 * @param {string} name.body - Full name
 * @param {string} phoneNumber.body - Phone number
 * @param {string} avatar.body - Avatar URL
 * @return {object} 200 - Profile updated
 * @example request - Update profile
 * {
 *   "name": "John Updated",
 *   "phoneNumber": "+1234567890"
 * }
 */
router.put("/:email", protect, updateUserByEmail);

/**
 * POST /api/v1/user/{email}/delivery-address
 * @summary Add delivery address
 * @tags 👥 Users
 * @description 🔒 **Protected** - Add new delivery address to profile
 * @security BearerAuth
 * @param {string} email.path.required - User email
 * @param {Address} request.body.required - Address details
 * @return {Address} 201 - Address added
 */
router.post("/:email/delivery-address", protect, addDeliveryAddress);

/**
 * PUT /api/v1/user/address/{addressId}
 * @summary Update delivery address
 * @tags 👥 Users
 * @description 🔒 **Protected** - Update existing delivery address
 * @security BearerAuth
 * @param {string} addressId.path.required - Address ID
 * @param {Address} request.body - Updated address
 * @return {Address} 200 - Address updated
 */
router.put("/address/:addressId", protect, updateAddressById);

/**
 * DELETE /api/v1/user/delete-address/{addressId}
 * @summary Delete delivery address
 * @tags 👥 Users
 * @description 🔒 **Protected** - Remove delivery address
 * @security BearerAuth
 * @param {string} addressId.path.required - Address ID
 * @return {object} 200 - Address deleted
 */
router.delete("/delete-address/:addressId", protect, removeAddressById);

/**
 * POST /api/v1/user/forgot-password
 * @summary Request password reset
 * @tags 👥 Users
 * @description 🔓 **Public** - Request security code for password reset
 * @param {object} request.body.required - Email
 * @param {string} email.body.required - User email
 * @return {object} 200 - Security code sent to email
 * @example request - Forgot password
 * {
 *   "email": "john@example.com"
 * }
 */
router.post("/forgot-password", forgotPassword);

/**
 * POST /api/v1/user/verify-otp-reset-password
 * @summary Reset password with OTP
 * @tags 👥 Users
 * @description 🔓 **Public** - Verify OTP and set new password
 * @param {object} request.body.required - Reset info
 * @param {string} email.body.required - User email
 * @param {string} otp.body.required - Security code
 * @param {string} newPassword.body.required - New password
 * @return {object} 200 - Password reset successful
 * @example request - Reset password
 * {
 *   "email": "john@example.com",
 *   "otp": "123456",
 *   "newPassword": "NewSecurePass123!"
 * }
 */
router.post("/verify-otp-reset-password", verifyOtpAndResetPassword);

/**
 * POST /api/v1/user/resend-security-code
 * @summary Resend security code
 * @tags 👥 Users
 * @description 🔓 **Public** - Resend password reset OTP
 * @param {object} request.body.required - Email
 * @param {string} email.body.required - User email
 * @return {object} 200 - Code resent
 */
router.post("/resend-security-code", resendSecurityCode);

/**
 * DELETE /api/v1/user/delete-user/{userId}
 * @summary Delete user account
 * @tags 👥 Users
 * @description 🛡️ **ADMIN only** - Permanently delete user account
 * @security BearerAuth
 * @param {string} userId.path.required - User ID
 * @return {object} 200 - User deleted
 * @return {object} 403 - Insufficient permissions
 */
router.delete("/delete-user/:userId", isSuperAdmin, deleteUserById);

export default router;
