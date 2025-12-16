import express, { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  searchProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import upload from "../middleware/upload.js";
import { createLimiter } from "../middleware/rate-limit.js";

const router: Router = express.Router();

/**
 * A Product
 * @typedef {object} Product
 * @property {string} id - Product ID
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {number} price - Product price
 * @property {number} discountPrice - Discounted price
 * @property {array<string>} images - Product images URLs
 * @property {number} stock - Available stock quantity
 * @property {boolean} featured - Is the product featured
 * @property {string} brand - Product brand
 * @property {string} condition - Product condition (New, Used, etc.)
 */

/**
 * GET /api/v1/product
 * @summary Get all products
 * @tags 📦 Products
 * @description 🔓 **Public Endpoint** - Browse all products with optional filters
 * @param {string} category.query - Filter by category ID
 * @param {string} brand.query - Filter by brand name
 * @param {boolean} featured.query - Show only featured products
 * @return {array<Product>} 200 - List of products
 * @example response - 200
 * [
 *   {
 *     "id": "123",
 *     "name": "iPhone 15 Pro",
 *     "price": 999.99,
 *     "stock": 50,
 *     "featured": true
 *   }
 * ]
 */
router.get("/", getProducts);

/**
 * GET /api/v1/product/search
 * @summary Search products
 * @tags 📦 Products
 * @description 🔓 **Public Endpoint** - Search products by name, description, or brand
 * @param {string} q.query.required - Search query - example: iPhone
 * @return {array<Product>} 200 - Search results
 */
router.get("/search", searchProducts);

/**
 * POST /api/v1/product
 * @summary Create new product
 * @tags 📦 Products
 * @description 🛡️ **VENDOR only** - Create product listing for your store
 * @security BearerAuth
 * @param {object} request.body.required - Product info - multipart/form-data
 * @param {string} name.form.required - Product name
 * @param {string} description.form.required - Product description
 * @param {number} price.form.required - Price
 * @param {number} stock.form.required - Stock quantity
 * @param {array<file>} images.form - Product images (max 10)
 * @return {Product} 201 - Product created
 * @return {object} 403 - Insufficient permissions
 */
router.post("/", createLimiter, upload.array("images", 10), createProduct);

/**
 * PUT /api/v1/product/{id}
 * @summary Update product
 * @tags 📦 Products
 * @description 👤 **Ownership Required** - Update your own product
 * @security BearerAuth
 * @param {string} id.path.required - Product ID
 * @param {object} request.body - Updated product info - multipart/form-data
 * @return {Product} 200 - Product updated
 * @return {object} 403 - Not your product
 */
router.put("/:id", upload.array("images", 10), updateProduct);

/**
 * DELETE /api/v1/product/{id}
 * @summary Delete product
 * @tags 📦 Products
 * @description 👤 **Ownership Required** - Delete your own product
 * @security BearerAuth
 * @param {string} id.path.required - Product ID
 * @return {object} 200 - Product deleted
 * @return {object} 403 - Not your product
 */
router.delete("/:id", deleteProduct);

export default router;
