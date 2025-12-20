import { BrowserRouter } from "react-router-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductSalesStats from "../ProductSalesStats";
import { AuthProvider } from "../../../../contexts/AuthContext";

/**
 * ProductSalesStats Component Tests
 */

// Helper to setup localStorage with a mock user
const setupMockUser = (user: object | null) => {
  if (user) {
    localStorage.setItem("quick-cart-vendor-user", JSON.stringify(user));
    localStorage.setItem("quick-cart-vendor-isAuthenticated", "true");
  }
};

describe("ProductSalesStats Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Error States", () => {
    it("should render ChartBox when user has no storeId", async () => {
      const mockUserNoStore = {
        id: "1",
        storeId: null,
        name: "Test Vendor",
        email: "vendor@test.com",
        role: "seller",
        isApproved: true,
      };

      setupMockUser(mockUserNoStore);

      render(
        <BrowserRouter><AuthProvider>
          <ProductSalesStats />
        </AuthProvider></BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Total Products Sold")).toBeInTheDocument();
      });
    });
  });

  describe("Rendering", () => {
    it("should display Total Products Sold title", async () => {
      const mockUser = {
        id: "1",
        storeId: "test-store-id",
        name: "Test Vendor",
        email: "vendor@test.com",
        role: "seller",
        isApproved: true,
      };

      setupMockUser(mockUser);

      render(
        <BrowserRouter><AuthProvider>
          <ProductSalesStats />
        </AuthProvider></BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Total Products Sold")).toBeInTheDocument();
      });
    });
  });
});
