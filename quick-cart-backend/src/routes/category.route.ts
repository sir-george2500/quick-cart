import express, { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../controllers/category.controller.js";
import upload from "../middleware/upload.js";
import { isSuperAdmin } from "../middleware/authMiddleware.js";

const router: Router = express.Router();

/**
 * A Category
 * @typedef {object} Category
 * @property {string} id - Category ID
 * @property {string} title - Category title
 * @property {string} subTitle - Category subtitle/description
 * @property {string} imageUrl - Category image URL
 */

/**
 * GET /api/v1/category
 * @summary Get all categories
 * @tags 📂 Categories
 * @description 🔓 **Public Endpoint** - Browse all product categories
 * @return {array<Category>} 200 - List of categories
 * @example response - 200
 * [
 *   {
 *     "id": "123",
 *     "title": "Electronics",
 *     "subTitle": "Latest tech gadgets",
 *     "imageUrl": "https://example.com/electronics.jpg"
 *   }
 * ]
 */
router.get("/", getCategories);

/**
 * POST /api/v1/category/create
 * @summary Create category
 * @tags 📂 Categories
 * @description 🛡️ **ADMIN only** - Create new product category
 * @security BearerAuth
 * @param {object} request.body.required - Category info - multipart/form-data
 * @param {string} title.form.required - Category title
 * @param {string} subTitle.form - Category subtitle
 * @param {file} file.form.required - Category image
 * @return {Category} 201 - Category created
 * @return {object} 403 - Insufficient permissions
 */
router.post("/create", isSuperAdmin, upload.single("file"), createCategory);

/**
 * DELETE /api/v1/category/{id}
 * @summary Delete category
 * @tags 📂 Categories
 * @description 🛡️ **ADMIN only** - Remove category from platform
 * @security BearerAuth
 * @param {string} id.path.required - Category ID
 * @return {object} 200 - Category deleted
 * @return {object} 403 - Insufficient permissions
 */
router.delete("/:id", isSuperAdmin, deleteCategory);

export default router;
