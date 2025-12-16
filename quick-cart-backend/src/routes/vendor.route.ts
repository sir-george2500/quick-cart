import express, { Router } from "express";
import {
  createVendor,
  getVendorProfile,
  updateVendorProfile,
  getVendorStats,
  verifyVendor,
  suspendVendor,
  getAllVendors,
} from "../modules/vendor/controllers/vendor.controller.js";
import { protect, isSuperAdmin } from "../middleware/authMiddleware.js";
import { createLimiter } from "../middleware/rate-limit.js";

const router: Router = express.Router();

/**
 * Vendor Model
 * @typedef {object} Vendor
 * @property {string} id - Vendor ID
 * @property {string} userId - User ID
 * @property {string} businessName - Business/store name
 * @property {string} phoneNumber - Contact phone
 * @property {boolean} isVerified - Has verified badge
 * @property {number} totalSales - Total sales amount
 * @property {number} totalOrders - Number of orders
 * @property {number} rating - Average rating
 */

/**
 * POST /api/v1/vendor/register
 * @summary Become a vendor (instant activation!)
 * @tags 🏪 Vendor
 * @description 🔒 **Protected** - Create vendor profile and start selling immediately
 * @security BearerAuth
 * @param {object} request.body.required - Vendor info
 * @param {string} businessName.body.required - Your business/store name - example: Joe's Electronics
 * @param {string} phoneNumber.body.required - Contact number - example: +1234567890
 * @return {object} 201 - Vendor created! You can start selling now
 * @return {object} 400 - User already has vendor profile
 * @example request - Register as vendor
 * {
 *   "businessName": "My Awesome Store",
 *   "phoneNumber": "+1234567890"
 * }
 * @example response - 201 - Success
 * {
 *   "success": true,
 *   "message": "Vendor profile created successfully!",
 *   "vendor": {
 *     "id": "vendor-123",
 *     "businessName": "My Awesome Store",
 *     "isVerified": false,
 *     "totalSales": 0
 *   }
 * }
 */
router.post("/register", protect, createLimiter, createVendor);

/**
 * GET /api/v1/vendor/profile
 * @summary Get my vendor profile
 * @tags 🏪 Vendor
 * @description 🔒 **Vendor Only** - View your vendor profile and stats
 * @security BearerAuth
 * @return {Vendor} 200 - Your vendor profile
 * @return {object} 404 - No vendor profile found
 */
router.get("/profile", protect, getVendorProfile);

/**
 * PUT /api/v1/vendor/profile
 * @summary Update my vendor profile
 * @tags 🏪 Vendor
 * @description 🔒 **Vendor Only** - Update business name or phone
 * @security BearerAuth
 * @param {object} request.body - Updated info
 * @param {string} businessName.body - New business name
 * @param {string} phoneNumber.body - New phone number
 * @return {Vendor} 200 - Updated profile
 * @example request - Update profile
 * {
 *   "businessName": "Updated Store Name"
 * }
 */
router.put("/profile", protect, updateVendorProfile);

/**
 * GET /api/v1/vendor/stats
 * @summary Get my sales statistics
 * @tags 🏪 Vendor
 * @description 🔒 **Vendor Only** - View sales, orders, rating
 * @security BearerAuth
 * @return {object} 200 - Statistics
 * @example response - 200 - Success
 * {
 *   "success": true,
 *   "stats": {
 *     "totalSales": 5000.00,
 *     "totalOrders": 25,
 *     "rating": 4.8,
 *     "reviewCount": 12
 *   }
 * }
 */
router.get("/stats", protect, getVendorStats);

/**
 * GET /api/v1/vendor/admin/all
 * @summary Get all vendors
 * @tags 🛡️ Admin - Vendor Management
 * @description 🛡️ **ADMIN only** - View all vendors on platform
 * @security BearerAuth
 * @return {array<Vendor>} 200 - List of vendors
 * @return {object} 403 - Insufficient permissions
 */
router.get("/admin/all", protect, isSuperAdmin, getAllVendors);

/**
 * PATCH /api/v1/vendor/admin/:vendorId/verify
 * @summary Verify vendor (give badge)
 * @tags 🛡️ Admin - Vendor Management
 * @description 🛡️ **ADMIN only** - Mark vendor as verified for benefits
 * @security BearerAuth
 * @param {string} vendorId.path.required - Vendor ID
 * @return {Vendor} 200 - Vendor verified
 * @return {object} 403 - Insufficient permissions
 */
router.patch("/admin/:vendorId/verify", protect, isSuperAdmin, verifyVendor);

/**
 * PATCH /api/v1/vendor/admin/:vendorId/suspend
 * @summary Suspend vendor
 * @tags 🛡️ Admin - Vendor Management
 * @description 🛡️ **ADMIN only** - Suspend bad vendor (prevents login)
 * @security BearerAuth
 * @param {string} vendorId.path.required - Vendor ID
 * @return {object} 200 - Vendor suspended
 * @return {object} 403 - Insufficient permissions
 */
router.patch("/admin/:vendorId/suspend", protect, isSuperAdmin, suspendVendor);

export default router;
