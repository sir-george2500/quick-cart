import express from "express";
import upload from "../middleware/upload.js";
import { deleteBanner, getBannerById, getBanners, updateBanner, uploadBanner, } from "../controllers/banner.controller.js";
import { isSuperAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();
/**
 * A Banner
 * @typedef {object} Banner
 * @property {string} id - Banner ID
 * @property {string} imageUrl - Banner image URL
 * @property {string} title - Banner title
 * @property {string} description - Banner description
 * @property {boolean} active - Is banner active
 * @property {string} link - Click-through URL
 */
/**
 * POST /api/v1/banner
 * @summary Upload marketing banner
 * @tags 🎨 Banners
 * @description 🛡️ **ADMIN only** - Upload promotional banner image
 * @security BearerAuth
 * @param {object} request.body.required - Banner info - multipart/form-data
 * @param {file} file.form.required - Banner image
 * @param {string} title.form - Banner title
 * @param {string} description.form - Banner description
 * @param {string} link.form - Click-through URL
 * @return {Banner} 201 - Banner uploaded successfully
 * @return {object} 403 - Insufficient permissions
 */
router.post("/", isSuperAdmin, upload.single("file"), uploadBanner);
/**
 * GET /api/v1/banner
 * @summary Get all banners
 * @tags 🎨 Banners
 * @description 🔓 **Public Endpoint** - Get all active marketing banners
 * @return {array<Banner>} 200 - List of banners
 * @example response - 200
 * [
 *   {
 *     "id": "123",
 *     "title": "Summer Sale",
 *     "imageUrl": "https://example.com/banner.jpg",
 *     "active": true
 *   }
 * ]
 */
router.get("/", getBanners);
/**
 * GET /api/v1/banner/{id}
 * @summary Get banner by ID
 * @tags 🎨 Banners
 * @description 🔓 **Public Endpoint** - Get specific banner details
 * @param {string} id.path.required - Banner ID
 * @return {Banner} 200 - Banner details
 * @return {object} 404 - Banner not found
 */
router.get("/:id", getBannerById);
/**
 * PUT /api/v1/banner/{id}
 * @summary Update banner
 * @tags 🎨 Banners
 * @description 🛡️ **ADMIN only** - Update banner details or image
 * @security BearerAuth
 * @param {string} id.path.required - Banner ID
 * @param {object} request.body - Updated banner info - multipart/form-data
 * @param {file} file.form - New banner image
 * @param {string} title.form - Banner title
 * @param {boolean} active.form - Active status
 * @return {Banner} 200 - Banner updated
 * @return {object} 403 - Insufficient permissions
 */
router.put("/:id", isSuperAdmin, upload.single("file"), updateBanner);
/**
 * DELETE /api/v1/banner/{id}
 * @summary Delete banner
 * @tags 🎨 Banners
 * @description 🛡️ **ADMIN only** - Remove banner from platform
 * @security BearerAuth
 * @param {string} id.path.required - Banner ID
 * @return {object} 200 - Banner deleted successfully
 * @return {object} 403 - Insufficient permissions
 */
router.delete("/:id", isSuperAdmin, deleteBanner);
export default router;
//# sourceMappingURL=banner.route.js.map