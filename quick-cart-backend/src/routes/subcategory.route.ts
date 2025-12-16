import express, { Router } from "express";
import {
  createSubcategory,
  deleteSubcategory,
  getSubcategories,
} from "../controllers/subcategory.controller.js";
import upload from "../middleware/upload.js";
import { isSuperAdmin } from "../middleware/authMiddleware.js";

const router: Router = express.Router();

/**
 * Subcategory
 * @typedef {object} Subcategory
 * @property {string} id - Subcategory ID
 * @property {string} title - Subcategory title
 * @property {string} categoryId - Parent category ID
 * @property {string} imageUrl - Subcategory image URL
 */

/**
 * GET /api/v1/subcategory
 * @summary Get all subcategories
 * @tags 📂 Categories
 * @description 🔓 **Public** - Browse all product subcategories
 * @return {array<Subcategory>} 200 - List of subcategories
 */
router.get("/", getSubcategories);

/**
 * POST /api/v1/subcategory/create
 * @summary Create subcategory
 * @tags 📂 Categories
 * @description 🛡️ **ADMIN only** - Create new product subcategory
 * @security BearerAuth
 * @param {object} request.body.required - Subcategory info - multipart/form-data
 * @param {string} title.form.required - Subcategory title
 * @param {string} categoryId.form.required - Parent category ID
 * @param {file} file.form - Subcategory image
 * @return {Subcategory} 201 - Subcategory created
 * @return {object} 403 - Insufficient permissions
 */
router.post("/create", isSuperAdmin, upload.single("file"), createSubcategory);

/**
 * DELETE /api/v1/subcategory/{id}
 * @summary Delete subcategory
 * @tags 📂 Categories
 * @description 🛡️ **ADMIN only** - Remove subcategory
 * @security BearerAuth
 * @param {string} id.path.required - Subcategory ID
 * @return {object} 200 - Subcategory deleted
 * @return {object} 403 - Insufficient permissions
 */
router.delete("/:id", isSuperAdmin, deleteSubcategory);

export default router;
