import express from "express";
import { cancelOrder, getOrders, getOrdersForStore, getUserOrders, placeOrder, placeVirtualOrder, updateOrder, } from "../controllers/order.controller.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
/**
 * An Order
 * @typedef {object} Order
 * @property {string} id - Order ID
 * @property {string} userId - Customer ID
 * @property {number} totalAmount - Total order amount
 * @property {string} status - Order status (Pending, Confirmed, Shipped, Delivered, Cancelled)
 * @property {string} orderDate - Order creation date
 * @property {array<object>} items - Order items
 */
/**
 * POST /api/v1/order/place-order
 * @summary Place new order
 * @tags 📋 Orders
 * @description 🔒 **Protected** - Create order from cart. Auto-splits by vendor.
 * @security BearerAuth
 * @param {object} request.body.required - Order details
 * @param {string} cartId.body - Cart ID to checkout
 * @param {string} paymentMethod.body.required - Payment method (card, cash, wallet)
 * @param {object} shippingAddress.body.required - Delivery address
 * @return {Order} 201 - Order created successfully
 * @return {object} 400 - Invalid cart or payment method
 */
router.post("/place-order", protect, placeOrder);
/**
 * GET /api/v1/order/get-orders
 * @summary Get all orders
 * @tags 📋 Orders
 * @description 🛡️ **ADMIN only** - Retrieve all platform orders
 * @security BearerAuth
 * @return {array<Order>} 200 - List of orders
 * @return {object} 403 - Insufficient permissions
 */
router.get("/get-orders", protect, getOrders);
/**
 * PUT /api/v1/order/update-order/{orderId}
 * @summary Update order status
 * @tags 📋 Orders
 * @description 🛡️ **VENDOR/ADMIN** - Update order status (vendor for own orders)
 * @security BearerAuth
 * @param {string} orderId.path.required - Order ID
 * @param {object} request.body.required - Status update
 * @param {string} status.body.required - New status - enum:Pending,Confirmed,Shipped,Delivered,Cancelled
 * @return {Order} 200 - Order updated
 * @return {object} 403 - Not authorized
 */
router.put("/update-order/:orderId", protect, updateOrder);
/**
 * DELETE /api/v1/order/cancel-order/{orderId}
 * @summary Cancel order
 * @tags 📋 Orders
 * @description 👤 **Customer/Admin** - Cancel order before shipping
 * @security BearerAuth
 * @param {string} orderId.path.required - Order ID
 * @return {object} 200 - Order cancelled
 * @return {object} 400 - Cannot cancel shipped order
 */
router.delete("/cancel-order/:orderId", protect, cancelOrder);
/**
 * GET /api/v1/order/user-orders
 * @summary Get my orders
 * @tags 📋 Orders
 * @description 🔒 **Protected** - Get your order history
 * @security BearerAuth
 * @return {array<Order>} 200 - Your orders
 */
router.get("/user-orders", protect, getUserOrders);
/**
 * GET /api/v1/order/store-orders
 * @summary Get store orders
 * @tags 📋 Orders
 * @description 🛡️ **VENDOR only** - Get orders for your store
 * @security BearerAuth
 * @return {array<Order>} 200 - Store orders
 */
router.get("/store-orders", protect, getOrdersForStore);
/**
 * POST /api/v1/order/place-virtual-order
 * @summary Place virtual order
 * @tags 📋 Orders
 * @description 🔒 **Protected** - For testing/demo purposes
 * @security BearerAuth
 * @param {object} request.body.required - Virtual order data
 * @return {Order} 201 - Virtual order created
 */
router.post("/place-virtual-order", protect, placeVirtualOrder);
export default router;
//# sourceMappingURL=order.route.js.map