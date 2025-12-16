import express, { Router } from "express";
import {
  createWallet,
  getTransactionHistory,
  getWalletBalance,
  updateWalletBalance,
} from "../controllers/wallet.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router: Router = express.Router();

/**
 * Wallet
 * @typedef {object} Wallet
 * @property {string} id - Wallet ID
 * @property {string} userId - User ID
 * @property {number} balance - Current balance
 * @property {string} currency - Currency code
 */

/**
 * Wallet Transaction
 * @typedef {object} WalletTransaction
 * @property {string} id - Transaction ID
 * @property {string}  type - Transaction type (credit, debit)
 * @property {number} amount - Transaction amount
 * @property {string} description - Transaction description
 * @property {string} date - Transaction date
 */

/**
 * POST /api/v1/wallet/create-wallet
 * @summary Create user wallet
 * @tags 💰 Wallet
 * @description 🔒 **Protected** - Initialize wallet for user/vendor
 * @security BearerAuth
 * @param {object} request.body.required - Wallet info
 * @param {string} userId.body.required - User ID
 * @return {Wallet} 201 - Wallet created
 */
router.post("/create-wallet", protect, createWallet);

/**
 * GET /api/v1/wallet/balance/{userId}
 * @summary Get wallet balance
 * @tags 💰 Wallet
 * @description 👤 **Ownership Required** - Check your wallet balance
 * @security BearerAuth
 * @param {string} userId.path.required - User ID
 * @return {Wallet} 200 - Wallet balance
 * @return {object} 404 - Wallet not found
 */
router.get("/balance/:userId", protect, getWalletBalance);

/**
 * POST /api/v1/wallet/update-balance/{userId}
 * @summary Update wallet balance
 * @tags 💰 Wallet
 * @description 🛡️ **ADMIN/System** - Credit/Debit wallet
 * @security BearerAuth
 * @param {string} userId.path.required - User ID
 * @param {object} request.body.required - Balance update
 * @param {number} amount.body.required - Amount to add/subtract
 * @param {string} type.body.required - Transaction type - enum:credit,debit
 * @param {string} description.body - Transaction description
 * @return {Wallet} 200 - Balance updated
 * @example request - Add funds
 * {
 *   "amount": 100.50,
 *   "type": "credit",
 *   "description": "Order refund"
 * }
 */
router.post("/update-balance/:userId", protect, updateWalletBalance);

/**
 * GET /api/v1/wallet/transactions/{userId}
 * @summary Get transaction history
 * @tags 💰 Wallet
 * @description 👤 **Ownership Required** - View wallet transaction history
 * @security BearerAuth
 * @param {string} userId.path.required - User ID
 * @return {array<WalletTransaction>} 200 - Transaction history
 */
router.get("/transactions/:userId", protect, getTransactionHistory);

export default router;
