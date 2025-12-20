import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Signup from "../SignUp";
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

// Helper to fill all form fields
const fillAllFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/full name/i), "Test Vendor");
  await user.type(screen.getByLabelText(/business name/i), "Test Business");
  await user.type(screen.getByLabelText(/phone number/i), "+1234567890");
  await user.type(screen.getByLabelText(/^address$/i), "123 Test St");
  await user.type(screen.getByLabelText(/city/i), "Test City");
  await user.type(screen.getByLabelText(/state/i), "Test State");
  await user.type(
    screen.getByLabelText(/email address/i),
    "newvendor@test.com"
  );
  await user.type(screen.getByLabelText(/^password$/i), "password123");
  await user.type(screen.getByLabelText(/confirm password/i), "password123");
};

describe("Signup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("Rendering", () => {
    it("should render all form fields", () => {
      renderWithProviders(<Signup />);

      expect(screen.getByText("Create an Account")).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^address$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it("should render login link", () => {
      renderWithProviders(<Signup />);

      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
    });

    it("should render submit button", () => {
      renderWithProviders(<Signup />);

      expect(
        screen.getByRole("button", { name: /create account/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should require all fields", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Signup />);

      await user.click(screen.getByRole("button", { name: /create account/i }));

      // HTML5 validation should prevent submission
      expect(screen.getByLabelText(/full name/i)).toBeInvalid();
    });

    it("should validate password length", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Signup />);

      await user.type(screen.getByLabelText(/full name/i), "Test");
      await user.type(screen.getByLabelText(/business name/i), "Test");
      await user.type(screen.getByLabelText(/phone number/i), "+1234567890");
      await user.type(screen.getByLabelText(/^address$/i), "123 Test");
      await user.type(screen.getByLabelText(/city/i), "Test");
      await user.type(screen.getByLabelText(/state/i), "Test");
      await user.type(screen.getByLabelText(/email address/i), "test@test.com");
      await user.type(screen.getByLabelText(/^password$/i), "12345"); // Too short
      await user.type(screen.getByLabelText(/confirm password/i), "12345");

      await user.click(screen.getByRole("button", { name: /create account/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 6 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("should validate password match", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Signup />);

      await user.type(screen.getByLabelText(/full name/i), "Test");
      await user.type(screen.getByLabelText(/business name/i), "Test");
      await user.type(screen.getByLabelText(/phone number/i), "+1234567890");
      await user.type(screen.getByLabelText(/^address$/i), "123 Test");
      await user.type(screen.getByLabelText(/city/i), "Test");
      await user.type(screen.getByLabelText(/state/i), "Test");
      await user.type(screen.getByLabelText(/email address/i), "test@test.com");
      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "different123"
      );

      await user.click(screen.getByRole("button", { name: /create account/i }));

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
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
    });

    it("should show loading state during registration", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Signup />);

      await fillAllFields(user);

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    it("should show error when user already exists", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Signup />);

      await user.type(screen.getByLabelText(/full name/i), "Existing Vendor");
      await user.type(
        screen.getByLabelText(/business name/i),
        "Existing Business"
      );
      await user.type(screen.getByLabelText(/phone number/i), "+1234567890");
      await user.type(screen.getByLabelText(/^address$/i), "123 Existing St");
      await user.type(screen.getByLabelText(/city/i), "Existing City");
      await user.type(screen.getByLabelText(/state/i), "Existing State");
      await user.type(
        screen.getByLabelText(/email address/i),
        "existing@test.com"
      );
      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "password123"
      );

      await user.click(screen.getByRole("button", { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have accessible form labels", () => {
      renderWithProviders(<Signup />);

      expect(screen.getByLabelText(/email address/i)).toHaveAttribute(
        "type",
        "email"
      );
      expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
        "type",
        "password"
      );
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute(
        "type",
        "password"
      );
      expect(screen.getByLabelText(/phone number/i)).toHaveAttribute(
        "type",
        "tel"
      );
    });

    it("should have autocomplete attributes", () => {
      renderWithProviders(<Signup />);

      expect(screen.getByLabelText(/full name/i)).toHaveAttribute(
        "autocomplete",
        "name"
      );
      expect(screen.getByLabelText(/email address/i)).toHaveAttribute(
        "autocomplete",
        "email"
      );
      expect(screen.getByLabelText(/phone number/i)).toHaveAttribute(
        "autocomplete",
        "tel"
      );
    });
  });
});
