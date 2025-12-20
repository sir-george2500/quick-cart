import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "../Login";
import { AuthProvider } from "../../../contexts/AuthContext";

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

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

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
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

  describe("Form Validation", () => {
    it("should show error for empty email", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(
        screen.getByRole("button", { name: /login to your account/i })
      );

      // HTML5 validation should prevent submission
      expect(screen.getByLabelText(/email address/i)).toBeInvalid();
    });

    it("should show error for empty password", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(
        screen.getByLabelText(/email address/i),
        "test@example.com"
      );
      await user.click(
        screen.getByRole("button", { name: /login to your account/i })
      );

      expect(screen.getByLabelText(/password/i)).toBeInvalid();
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
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("should show loading state during login", async () => {
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
      await user.click(submitButton);

      // Button should show loading state initially
      expect(submitButton).toBeDisabled();
    });

    it("should show error for invalid credentials", async () => {
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
