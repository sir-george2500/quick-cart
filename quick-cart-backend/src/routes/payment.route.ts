import express, { Router } from "express";
import axios from "axios";
import Stripe from "stripe";

// Load environment variables
const STRIPE_API_KEY = process.env.STRIPE_API_KEY || "";
const MOMO_HOST = process.env.MOMO_HOST || "sandbox.momodeveloper.mtn.com";

// Initialize Stripe with the API key from the environment
const stripe = new Stripe(STRIPE_API_KEY);

// MTN Mobile Money API credentials and endpoints
const momoTokenUrl = `https://${MOMO_HOST}/collection/token/`;
const momoPayUrl = `https://${MOMO_HOST}/collection/v1_0/requesttopay`;

let momoToken: string | null = null;

const router: Router = express.Router();

/**
 * POST /api/v1/payment/get-momo-token
 * @summary Get MTN MoMo token
 * @tags 💳 Payments
 * @description 🔓 **Internal** - Retrieve MTN Mobile Money API token
 * @param {object} request.body.required - MoMo credentials
 * @param {string} API_KEY.body.required - MTN API key
 * @param {string} subscriptionKey.body.required - MTN subscription key
 * @return {object} 200 - MoMo token retrieved
 * @return {object} 500 - Token retrieval failed
 */
router.post("/get-momo-token", async (req, res) => {
  try {
    const { API_KEY, subscriptionKey } = req.body;
    const momoTokenResponse = await axios.post(
      momoTokenUrl,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          Authorization: `Basic ${API_KEY}`,
        },
      }
    );
    momoToken = momoTokenResponse.data.access_token;

    res.json({ momoToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * POST /api/v1/payment/request-to-pay
 * @summary Request MTN MoMo payment
 * @tags 💳 Payments
 * @description 🔓 **Protected** - Initiate MTN Mobile Money payment
 * @param {object} request.body.required - Payment details
 * @param {number} total.body.required - Amount to charge
 * @param {string} phone.body.required - Customer phone number
 * @return {object} 200 - Payment initiated
 * @return {object} 400 - MoMo token not found
 * @return {object} 500 - Payment failed
 * @example request - Request payment
 * {
 *   "total": 100.50,
 *   "phone": "46733123454"
 * }
 */
router.post("/request-to-pay", async (req, res) => {
  try {
    if (!momoToken) {
      return res.status(400).json({ error: "Momo token not found" });
    }

    const { total, phone } = req.body;
    const body = {
      amount: total,
      currency: "EUR",
      externalId: "your_unique_transaction_id",
      payee: {
        partyIdType: "MSISDN",
        partyId: phone ? phone : 46733123454,
      },
      payerMessage: "Payment for order",
      payeeNote: "Thank you for your order",
    };

    const momoResponse = await axios.post(momoPayUrl, body, {
      headers: {
        "X-Reference-Id": "",
        "X-Target-Environment": "sandbox",
        "Ocp-Apim-Subscription-Key": "",
        "Content-Type": "application/json",
        Authorization: `Bearer ${momoToken}`,
      },
    });
    res.json({ momoResponse: momoResponse.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred",
    });
  }
});

/**
 * POST /api/v1/payment/intents
 * @summary Create Stripe payment intent
 * @tags 💳 Payments
 * @description 🔒 **Protected** - Create Stripe payment intent for card payments
 * @security BearerAuth
 * @param {object} request.body.required - Payment details
 * @param {number} amount.body.required - Amount in cents (e.g., 1000 = $10.00)
 * @return {object} 200 - Payment intent created
 * @return {object} 400 - Payment creation failed
 * @example request - Create intent
 * {
 *   "amount": 5000
 * }
 * @example response - 200 - Success
 * {
 *   "paymentIntent": "pi_3ABC123def456..."
 * }
 */
router.post("/intents", async (req, res) => {
  try {
    //create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    //Return the secret
    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
});

export default router;
