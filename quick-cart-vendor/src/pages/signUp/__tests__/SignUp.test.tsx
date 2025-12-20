import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Signup from "../SignUp";
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

// Helper to fill all form fields
const fillAllFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/full name/i), "Test Vendor");
  await user.type(screen.getByLabelText(/business name/i), "Test Business");
  await user.type(screen.getByLabelText(/phone number/i), "+1234567890");
  await user.type(screen.getByLabelText(/^address$/i), "123 Test Street");
  await user.type(screen.getByLabelText(/city/i), "Test City");
  await user.type(screen.getByLabelText(/state/i), "Test State");
  await user.type(
    screen.getByLabelText(/email address/i),
    "newvendor@test.com"
  );
  await user.type(screen.getByLabelText("Password"), "password123");
  await user.type(screen.getByLabelText("Confirm Password"), "password123");
};

describe("Signup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockAuthService.registerVendor.mockResolvedValue(
      "Seller account created successfully, pending approval."
    );
  });

  describe("Rendering", () => {
    it("should render signup form with new design", () => {
      renderWithProviders(<Signup />);

      expect(screen.getByText("Join Quick Cart")).toBeInTheDocument();
      expect(
        screen.getByText("Start selling your products today")
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
    });

    it("should render hero section with features", () => {
      renderWithProviders(<Signup />);

      expect(screen.getByText("Grow Your Farm Business")).toBeInTheDocument();
      expect(screen.getByText("Easy product listing")).toBeInTheDocument();
    });

    it("should render login link", () => {
      renderWithProviders(<Signup />);

      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it("should render submit button", () => {
      renderWithProviders(<Signup />);

      expect(
        screen.getByRole("button", { name: /create account/i })
      ).toBeInTheDocument();
    });

    it("should render password toggle buttons", () => {
      renderWithProviders(<Signup />);

      const toggleButtons = screen.getAllByRole("button", {
        name: /show password/i,
      });
      expect(toggleButtons).toHaveLength(2);
    });
  });

  describe("Form Validation", () => {
    it("should show validation error for short password", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Signup />);

      await user.type(screen.getByLabelText("Password"), "12345");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 6 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("should show validation error for password mismatch", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Signup />);

      await user.type(screen.getByLabelText("Password"), "password123");
      await user.type(
        screen.getByLabelText("Confirm Password"),
        "different123"
      );
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });
  });

  describe("Registration Flow", () => {
    it("should handle successful registration", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Signup />);

      await fillAllFields(user);
      await user.click(screen.getByRole("button", { name: /create account/i }));

      await waitFor(() => {
        expect(mockAuthService.registerVendor).toHaveBeenCalled();
      });
    });

    it("should show loading state during registration", async () => {
      mockAuthService.registerVendor.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve("Success"), 100))
      );

      const user = userEvent.setup();
      renderWithProviders(<Signup />);

      await fillAllFields(user);

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it("should show error when user already exists", async () => {
      mockAuthService.registerVendor.mockRejectedValue(
        new Error("User already exists")
      );

      const user = userEvent.setup();
      renderWithProviders(<Signup />);

      await fillAllFields(user);
      await user.click(screen.getByRole("button", { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
      });
    });
  });
});
