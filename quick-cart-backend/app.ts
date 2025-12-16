import express, { Application } from "express";
import cors from "cors";
import { setupSwagger } from "./src/config/swagger.config.js";
import { globalLimiter } from "./src/middleware/rate-limit.js";

import swaggerRoute from "./src/routes/swagger.route.js";
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import productRoute from "./src/routes/product.route.js";
import storeRoute from "./src/routes/store.route.js";
import categoryRoute from "./src/routes/category.route.js";
import subcategoryRoute from "./src/routes/subcategory.route.js";
import { approveSeller } from "./src/controllers/auth.controller.js";
import bannerRoute from "./src/routes/banner.route.js";
import cartRoute from "./src/routes/cart.route.js";
import orderRoute from "./src/routes/order.route.js";
import walletRoute from "./src/routes/wallet.route.js";
import pickupstationRoute from "./src/routes/pickupstation.route.js";
import messageRoute from "./src/routes/message.route.js";
import paymentRoute from "./src/routes/payment.route.js";
import vendorRoute from "./src/routes/vendor.route.js";

// Initialize Express
const app: Application = express();

// Apply rate limiting
app.use(globalLimiter);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Swagger Documentation
setupSwagger(app);

app.use(
  cors({
    origin: [process.env.CLIENT_URL || "", process.env.ADMIN_URL || ""],
    credentials: true,
  })
);

// Default route to serve the OpenAPI documentation
app.use("/", swaggerRoute);

// General Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/stores", storeRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subcategoryRoute);
app.use("/api/v1/products", productRoute);
app.get("/api/v1/approve-seller/:token", approveSeller);
app.use("/api/v1/banners", bannerRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/wallet", walletRoute);
app.use("/api/v1/pickupstation", pickupstationRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/vendor", vendorRoute);

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// Global error handler - must be last middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    res.status(err.status || 500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : err.message,
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
        details: err,
      }),
    });
  }
);

// Export for Vercel serverless
export default app;

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== "production") {
  const PORT: string = process.env.PORT || "3000";
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
