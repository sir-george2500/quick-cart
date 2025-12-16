import expressJSDocSwagger from "express-jsdoc-swagger";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerOptions = {
    info: {
        title: "Quick-Cart Multi-Vendor E-Commerce API",
        version: "1.0.0",
        description: `
# Quick-Cart API Documentation

Welcome to Quick-Cart's interactive API documentation.

## 🔐 How to Test with Authentication

1. **Register/Login** using the auth endpoints below
2. Copy the JWT token from the response
3. Click the **"Authorize"** button (🔓) at the top
4. Enter: \`Bearer <your_token>\`
5. Click **"Authorize"**
6. Now test any protected endpoint!

## 🎭 Roles & Permissions

| Role | Access Level |
|------|--------------|
| **SUPER_ADMIN** | Full platform control |
| **VENDOR** | Manage own store & products |
| **CUSTOMER** | Browse & purchase |
| **SUPPORT** | Customer support access |
    `,
    },
    security: {
        BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Enter JWT token in format: Bearer <token>",
        },
    },
    baseDir: path.join(__dirname, ".."),
    filesPattern: ["./routes/**/*.ts", "./src/routes/**/*.ts"],
    swaggerUIPath: "/api-docs",
    exposeSwaggerUI: true,
    exposeApiDocs: true,
    apiDocsPath: "/api-docs.json",
    notRequiredAsNullable: false,
    swaggerUiOptions: {
        explorer: true,
    },
};
export const setupSwagger = (app) => {
    expressJSDocSwagger(app)(swaggerOptions);
    console.log("📚 Swagger documentation available at /api-docs");
};
//# sourceMappingURL=swagger.config.js.map