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
    mockAuthService.login.mockResolvedValue(mockUser);
    mockAuthService.isApproved.mockReturnValue(true);
    mockAuthService.isVendor.mockReturnValue(true);
  });

  describe("Rendering", () => {
    it("should render login form with new design", () => {
      renderWithProviders(<Login />);

      expect(screen.getByText("Quick Cart Vendor")).toBeInTheDocument();
      expect(screen.getByText("Sign in to your dashboard")).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("should render forgot password link", () => {
      renderWithProviders(<Login />);
      expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
    });

    it("should render create account link", () => {
      renderWithProviders(<Login />);
      expect(screen.getByText(/create one/i)).toBeInTheDocument();
    });

    it("should render hero section with stats", () => {
      renderWithProviders(<Login />);
      expect(screen.getByText("10K+")).toBeInTheDocument();
      expect(screen.getByText("Vendors")).toBeInTheDocument();
    });

    it("should render password toggle button", () => {
      renderWithProviders(<Login />);
      expect(
        screen.getByRole("button", { name: /show password/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show validation error for invalid email", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(screen.getByLabelText(/email address/i), "invalid");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid email/i)
        ).toBeInTheDocument();
      });
    });

    it("should show validation error for short password", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(screen.getByLabelText("Password"), "12345");
      await user.tab();

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
      await user.type(screen.getByLabelText("Password"), "password123");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(mockAuthService.login).toHaveBeenCalledWith(
          "vendor@test.com",
          "password123"
        );
      });
    });

    it("should show loading state during login", async () => {
      mockAuthService.login.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100))
      );

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(
        screen.getByLabelText(/email address/i),
        "vendor@test.com"
      );
      await user.type(screen.getByLabelText("Password"), "password123");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
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
      await user.type(screen.getByLabelText("Password"), "wrongpassword");
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe("Password Toggle", () => {
    it("should toggle password visibility", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const passwordInput = screen.getByLabelText("Password");
      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });

      expect(passwordInput).toHaveAttribute("type", "password");

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      await user.click(screen.getByRole("button", { name: /hide password/i }));
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });
});
