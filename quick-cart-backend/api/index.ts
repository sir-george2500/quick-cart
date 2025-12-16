import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../app.js";

/**
 * Serverless function handler for Vercel
 * Wraps the Express app to handle requests in serverless environment
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Use Express app as request handler
    return app(req, res);
  } catch (error) {
    console.error("Function invocation error:", error);

    // Return error response
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : "Something went wrong",
    });
  }
}
