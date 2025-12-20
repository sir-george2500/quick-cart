import { http, HttpResponse } from "msw";

const BASE_URL = "http://localhost:3000/api/v1";

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: "test-user-id",
  name: "Test Vendor",
  email: "vendor@test.com",
  role: "seller",
  avatar: null,
  isApproved: true,
  businessName: "Test Business",
  phoneNumber: "+1234567890",
  address: "123 Test St",
  city: "Test City",
  state: "Test State",
  storeId: "test-store-id",
};

/**
 * Mock unapproved user
 */
export const mockUnapprovedUser = {
  ...mockUser,
  id: "unapproved-user-id",
  email: "unapproved@test.com",
  isApproved: false,
};

/**
 * Mock customer (non-vendor) user
 */
export const mockCustomerUser = {
  ...mockUser,
  id: "customer-user-id",
  email: "customer@test.com",
  role: "customer",
};

/**
 * MSW request handlers for API mocking
 */
export const handlers = [
  // Login endpoint
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const { email, password } = body;

    // Simulate invalid credentials
    if (password === "wrongpassword") {
      return HttpResponse.json(
        { message: "Invalid Credentials!" },
        { status: 401 }
      );
    }

    // Simulate unapproved user
    if (email === "unapproved@test.com") {
      return HttpResponse.json(mockUnapprovedUser, { status: 200 });
    }

    // Simulate customer user (not vendor)
    if (email === "customer@test.com") {
      return HttpResponse.json(mockCustomerUser, { status: 200 });
    }

    // Simulate user not found
    if (email === "notfound@test.com") {
      return HttpResponse.json(
        { message: "Invalid Credentials!" },
        { status: 401 }
      );
    }

    // Successful login
    return HttpResponse.json(mockUser, { status: 200 });
  }),

  // Logout endpoint
  http.post(`${BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({ message: "Logout Successful" }, { status: 200 });
  }),

  // Register vendor endpoint
  http.post(`${BASE_URL}/auth/seller`, async ({ request }) => {
    const body = (await request.json()) as { email: string };
    const { email } = body;

    // Simulate existing user
    if (email === "existing@test.com") {
      return HttpResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      { message: "Seller account created successfully, pending approval." },
      { status: 201 }
    );
  }),

  // Forgot password endpoint
  http.post(`${BASE_URL}/user/forgot-password`, async ({ request }) => {
    const body = (await request.json()) as { email: string };
    const { email } = body;

    // Simulate user not found
    if (email === "notfound@test.com") {
      return HttpResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      { success: true, message: "Security code sent to your email" },
      { status: 200 }
    );
  }),

  // Verify OTP and reset password endpoint
  http.post(
    `${BASE_URL}/user/verify-otp-reset-password`,
    async ({ request }) => {
      const body = (await request.json()) as {
        email: string;
        securityCode: string;
        newPassword: string;
      };
      const { securityCode } = body;

      // Simulate invalid/expired code
      if (securityCode === "000000") {
        return HttpResponse.json(
          { success: false, message: "Invalid or expired security code" },
          { status: 400 }
        );
      }

      return HttpResponse.json(
        { success: true, message: "Password reset successfully" },
        { status: 200 }
      );
    }
  ),

  // Resend security code endpoint
  http.post(`${BASE_URL}/user/resend-security-code`, async ({ request }) => {
    const body = (await request.json()) as { email: string };
    const { email } = body;

    // Simulate code already sent
    if (email === "code-sent@test.com") {
      return HttpResponse.json(
        {
          success: false,
          message:
            "A security code has already been sent. Please use the existing code.",
        },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      { success: true, message: "New security code sent to your email" },
      { status: 200 }
    );
  }),

  // Update user endpoint
  http.put(`${BASE_URL}/user/:email`, async ({ request }) => {
    const body = (await request.json()) as Partial<typeof mockUser>;

    return HttpResponse.json(
      {
        success: true,
        message: "User updated successfully",
        data: { ...mockUser, ...body },
      },
      { status: 200 }
    );
  }),

  // Get orders endpoint (for dashboard)
  http.get(`${BASE_URL}/orders/get-orders`, () => {
    return HttpResponse.json([
      {
        id: "order-1",
        userId: "customer-1",
        orderDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        products: [
          {
            storeId: "test-store-id",
            categoryName: "Electronics",
            product: { id: "prod-1", price: 99.99, storeId: "test-store-id" },
            quantity: 2,
          },
        ],
      },
    ]);
  }),

  // Get products endpoint (for dashboard)
  http.get(`${BASE_URL}/products`, () => {
    return HttpResponse.json([
      {
        id: "product-1",
        name: "Test Product",
        storeId: "test-store-id",
        price: 49.99,
        createdAt: new Date().toISOString(),
      },
    ]);
  }),

  // Get user by ID endpoint (for TopBox)
  http.get(`${BASE_URL}/user/:userId`, () => {
    return HttpResponse.json({
      data: {
        id: "customer-1",
        name: "Test Customer",
        email: "customer1@test.com",
        avatar: null,
      },
    });
  }),
];
