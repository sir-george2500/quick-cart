import express, { Router } from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router: Router = express.Router();

/**
 * Message
 * @typedef {object} Message
 * @property {string} id - Message ID
 * @property {string} senderId - Sender user ID
 * @property {string} receiverId - Receiver user ID
 * @property {string} content - Message content
 * @property {string} timestamp - Message timestamp
 * @property {boolean} read - Read status
 */

/**
 * POST /api/v1/message/send
 * @summary Send message
 * @tags 💬 Messages
 * @description 🔒 **Protected** - Send message to another user/vendor
 * @security BearerAuth
 * @param {object} request.body.required - Message details
 * @param {string} receiverId.body.required - Recipient user ID
 * @param {string} content.body.required - Message content
 * @return {Message} 201 - Message sent
 * @example request - Send message
 * {
 *   "receiverId": "507f1f77bcf86cd799439011",
 *   "content": "Hello, is this product available?"
 * }
 */
router.post("/send", protect, sendMessage);

/**
 * GET /api/v1/message/messages
 * @summary Get my messages
 * @tags 💬 Messages
 * @description 🔒 **Protected** - Retrieve your message inbox
 * @security BearerAuth
 * @return {array<Message>} 200 - Your messages
 */
router.get("/messages", protect, getMessages);

export default router;
