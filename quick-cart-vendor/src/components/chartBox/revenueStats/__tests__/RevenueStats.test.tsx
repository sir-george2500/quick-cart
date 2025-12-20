import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RevenueStats from "../RevenueStats";
import { AuthProvider } from "../../../../contexts/AuthContext";

// Mock MUI CircularProgress
jest.mock("@mui/material/CircularProgress", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Wrapper component for rendering with auth provider
const renderWithAuth = (
  component: React.ReactElement,
  initialUser?: object | null
) => {
  if (initialUser) {
    localStorage.setItem("quick-cart-vendor-user", JSON.stringify(initialUser));
    localStorage.setItem("quick-cart-vendor-isAuthenticated", "true");
  }
  return render(<AuthProvider>{component}</AuthProvider>);
};

describe("RevenueStats Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Loading State", () => {
    it("should show loading spinner while fetching data", () => {
      const mockUser = {
        id: "1",
        storeId: "test-store-id",
        name: "Test Vendor",
        email: "vendor@test.com",
        role: "seller",
        isApproved: true,
      };

      renderWithAuth(<RevenueStats />, mockUser);
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
  });

  describe("Error States", () => {
    it("should render ChartBox with $0.00 when user has no storeId", async () => {
      const mockUserNoStore = {
        id: "1",
        storeId: null,
        name: "Test Vendor",
        email: "vendor@test.com",
        role: "seller",
        isApproved: true,
      };

      renderWithAuth(<RevenueStats />, mockUserNoStore);

      await waitFor(() => {
        expect(screen.getByText("Total Revenue")).toBeInTheDocument();
      });
    });
  });

  describe("Data Loading", () => {
    it("should load and display revenue statistics", async () => {
      const mockUser = {
        id: "1",
        storeId: "test-store-id",
        name: "Test Vendor",
        email: "vendor@test.com",
        role: "seller",
        isApproved: true,
      };

      renderWithAuth(<RevenueStats />, mockUser);

      await waitFor(
        () => {
          expect(screen.getByText("Total Revenue")).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });
});
