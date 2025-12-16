import express from "express";
import { createCartItem, deleteCartItem, deleteCartItems, getCartItems, } from "../controllers/cart.controller.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
/**
 * A Cart Item
 * @typedef {object} CartItem
 * @property {string} id - Cart item ID
 * @property {string} productId - Product ID
 * @property {string} userId - User ID
 * @property {number} quantity - Item quantity
 * @property {number} price - Price at time of adding
 */
/**
 * GET /api/v1/cart/user/{userId}
 * @summary Get user cart
 * @tags 🛒 Cart
 * @description 🔒 **Protected** - Get all items in user's shopping cart
 * @security BearerAuth
 * @param {string} userId.path.required - User ID
 * @return {array<CartItem>} 200 - Cart items
 * @return {object} 404 - Cart not found
 */
router.get("/user/:userId", protect, getCartItems);
/**
 * POST /api/v1/cart
 * @summary Add item to cart
 * @tags 🛒 Cart
 * @description 🔒 **Protected** - Add product to shopping cart
 * @security BearerAuth
 * @param {object} request.body.required - Cart item info
 * @param {string} productId.body.required - Product ID
 * @param {number} quantity.body.required - Quantity - example: 1
 * @return {CartItem} 201 - Item added to cart
 * @example request - Add to cart
 * {
 *   "productId": "507f1f77bcf86cd799439011",
 *   "quantity": 2
 * }
 */
router.post("/", protect, createCartItem);
/**
 * DELETE /api/v1/cart/{id}
 * @summary Remove item from cart
 * @tags 🛒 Cart
 * @description 🔒 **Protected** - Remove single item from cart
 * @security BearerAuth
 * @param {string} id.path.required - Cart item ID
 * @return {object} 200 - Item removed
 */
router.delete("/:id", protect, deleteCartItem);
/**
 * DELETE /api/v1/cart/user/{userId}/deleteMultiple
 * @summary Clear cart
 * @tags 🛒 Cart
 * @description 🔒 **Protected** - Remove all items from user's cart
 * @security BearerAuth
 * @param {string} userId.path.required - User ID
 * @return {object} 200 - Cart cleared
 */
router.delete("/user/:userId/deleteMultiple", protect, deleteCartItems);
export default router;
//# sourceMappingURL=cart.route.js.map