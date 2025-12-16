import express, { Router } from "express";
import {
  deleteStore,
  getStores,
  getStoresById,
  getStoresByName,
  getStoresInfo,
  updateStore,
} from "../controllers/store.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router: Router = express.Router();

/**
 * Store
 * @typedef {object} Store
 * @property {string} id - Store ID
 * @property {string} businessName - Store/business name
 * @property {string} description - Store description
 * @property {string} logo - Store logo URL
 * @property {string} vendorId - Vendor/owner ID
 * @property {boolean} isApproved - Admin approval status
 */

/**
 * GET /api/v1/store
 * @summary Get all stores
 * @tags 🏬 Stores
 * @description 🔓 **Public** - Browse all approved vendor stores
 * @return {array<Store>} 200 - List of stores
 */
router.get("/", getStores);

/**
 * GET /api/v1/store/storeInfo/{storeId}
 * @summary Get store detailed info
 * @tags 🏬 Stores
 * @description 🔓 **Public** - Get comprehensive store information
 * @param {string} storeId.path.required - Store ID
 * @return {Store} 200 - Store details with products
 * @return {object} 404 - Store not found
 */
router.get("/storeInfo/:storeId", getStoresInfo);

/**
 * GET /api/v1/store/storeName/{businessName}
 * @summary Search store by name
 * @tags 🏬 Stores
 * @description 🔓 **Public** - Find store by business name
 * @param {string} businessName.path.required - Business name to search
 * @return {array<Store>} 200 - Matching stores
 */
router.get("/storeName/:businessName", getStoresByName);

/**
 * GET /api/v1/store/{storeId}
 * @summary Get store by ID
 * @tags 🏬 Stores
 * @description 🔓 **Public** - Get store basic information
 * @param {string} storeId.path.required - Store ID
 * @return {Store} 200 - Store details
 * @return {object} 404 - Store not found
 */
router.get("/:storeId", getStoresById);

/**
 * PUT /api/v1/store/{storeId}
 * @summary Update store information
 * @tags 🏬 Stores
 * @description 👤 **Vendor Ownership** - Update your store details
 * @security BearerAuth
 * @param {string} storeId.path.required - Store ID
 * @param {object} request.body - Store updates
 * @param {string} businessName.body - Business name
 * @param {string} description.body - Store description
 * @param {string} logo.body - Logo URL
 * @return {Store} 200 - Store updated
 * @return {object} 403 - Not your store
 */
router.put("/:storeId", protect, updateStore);

/**
 * DELETE /api/v1/store/{storeId}
 * @summary Delete store
 * @tags 🏬 Stores
 * @description 🛡️ **ADMIN/Owner** - Delete store permanently
 * @security BearerAuth
 * @param {string} storeId.path.required - Store ID
 * @return {object} 200 - Store deleted
 * @return {object} 403 - Not authorized
 */
router.delete("/:storeId", protect, deleteStore);

export default router;
