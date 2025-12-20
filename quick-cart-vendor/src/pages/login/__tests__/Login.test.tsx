import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "../Login";
import { AuthProvider } from "../../../contexts/AuthContext";
import { authService } from "../../../services/auth.service";

// Mock auth service
jest.mock("../../../services/auth.service");
const mockAuthService = authService as jest.Mocked<typeof authService>;

// Wrapper component for rendering with providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
};

// Mock user data
const mockUser = {
  id: "test-user-id",
  name: "Test Vendor",
  email: "vendor@test.com",
  role: "seller",
  isApproved: true,
  storeId: "test-store-id",
};

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Default mock implementation
    mockAuthService.login.mockResolvedValue(mockUser);
    mockAuthService.isApproved.mockReturnValue(true);
    mockAuthService.isVendor.mockReturnValue(true);
  });

  describe("Rendering", () => {
    it("should render login form", () => {
      renderWithProviders(<Login />);

      expect(
        screen.getByText("Sign in to Quick-cart-vendor")
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login to your account/i })
      ).toBeInTheDocument();
    });

    it("should render forgot password link", () => {
      renderWithProviders(<Login />);

      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });

    it("should render signup link", () => {
      renderWithProviders(<Login />);

      expect(screen.getByText(/create an account/i)).toBeInTheDocument();
    });
  });

  describe("Form Validation with Formik/Yup", () => {
    it("should show validation error for invalid email format", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(screen.getByLabelText(/email address/i), "invalid-email");
      await user.tab(); // Trigger blur

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid email/i)
        ).toBeInTheDocument();
      });
    });

    it("should show validation error for short password", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(screen.getByLabelText(/password/i), "12345");
      await user.tab(); // Trigger blur

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 6 characters/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Login Flow", () => {
    it("should handle successful login", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(
        screen.getByLabelText(/email address/i),
        "vendor@test.com"
      );
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(
        screen.getByRole("button", { name: /login to your account/i })
      );

      await waitFor(() => {
        expect(mockAuthService.login).toHaveBeenCalledWith(
          "vendor@test.com",
          "password123"
        );
      });
    });

    it("should show loading state during login", async () => {
      // Make login take longer so we can check loading state
      mockAuthService.login.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100))
      );

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(
        screen.getByLabelText(/email address/i),
        "vendor@test.com"
      );
      await user.type(screen.getByLabelText(/password/i), "password123");

      const submitButton = screen.getByRole("button", {
        name: /login to your account/i,
      });

      // Click and check loading state
      user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it("should show error for invalid credentials", async () => {
      mockAuthService.login.mockRejectedValue(
        new Error("Invalid Credentials!")
      );

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(
        screen.getByLabelText(/email address/i),
        "vendor@test.com"
      );
      await user.type(screen.getByLabelText(/password/i), "wrongpassword");
      await user.click(
        screen.getByRole("button", { name: /login to your account/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it("should show error for unapproved account", async () => {
      mockAuthService.isApproved.mockReturnValue(false);

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(
        screen.getByLabelText(/email address/i),
        "unapproved@test.com"
      );
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(
        screen.getByRole("button", { name: /login to your account/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/pending verification/i)).toBeInTheDocument();
      });
    });

    it("should show error for non-seller role", async () => {
      mockAuthService.isVendor.mockReturnValue(false);

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(
        screen.getByLabelText(/email address/i),
        "customer@test.com"
      );
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(
        screen.getByRole("button", { name: /login to your account/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/not authorized/i)).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have accessible form labels", () => {
      renderWithProviders(<Login />);

      expect(screen.getByLabelText(/email address/i)).toHaveAttribute(
        "type",
        "email"
      );
      expect(screen.getByLabelText(/password/i)).toHaveAttribute(
        "type",
        "password"
      );
    });

    it("should have autocomplete attributes", () => {
      renderWithProviders(<Login />);

      expect(screen.getByLabelText(/email address/i)).toHaveAttribute(
        "autocomplete",
        "email"
      );
      expect(screen.getByLabelText(/password/i)).toHaveAttribute(
        "autocomplete",
        "current-password"
      );
    });
  });
});
