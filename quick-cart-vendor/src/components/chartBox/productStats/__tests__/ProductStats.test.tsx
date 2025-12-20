import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductStats from "../ProductStats";
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

describe("ProductStats Component", () => {
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

      renderWithAuth(<ProductStats />, mockUser);
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
  });

  describe("Error States", () => {
    it("should render ChartBox with zero when user has no storeId", async () => {
      const mockUserNoStore = {
        id: "1",
        storeId: null,
        name: "Test Vendor",
        email: "vendor@test.com",
        role: "seller",
        isApproved: true,
      };

      renderWithAuth(<ProductStats />, mockUserNoStore);

      await waitFor(() => {
        // Should show ChartBox with "Total Products" title
        expect(screen.getByText("Total Products")).toBeInTheDocument();
      });
    });
  });

  describe("Data Loading", () => {
    it("should load and display product statistics", async () => {
      const mockUser = {
        id: "1",
        storeId: "test-store-id",
        name: "Test Vendor",
        email: "vendor@test.com",
        role: "seller",
        isApproved: true,
      };

      renderWithAuth(<ProductStats />, mockUser);

      await waitFor(
        () => {
          expect(screen.getByText("Total Products")).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });
});
