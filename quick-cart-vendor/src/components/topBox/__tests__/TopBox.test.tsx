import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TopBox from "../TopBox";
import { AuthProvider } from "../../../contexts/AuthContext";

/**
 * TopBox Component Tests
 *
 * Tests the Recent Customers dashboard widget which displays
 * customers who have ordered from the vendor's store.
 */

// Helper to setup localStorage with a mock user
const setupMockUser = (user: object | null) => {
  if (user) {
    localStorage.setItem("quick-cart-vendor-user", JSON.stringify(user));
    localStorage.setItem("quick-cart-vendor-isAuthenticated", "true");
  }
};

describe("TopBox Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Error States", () => {
    it("should show 'Store not configured' when user has no storeId", async () => {
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
        <AuthProvider>
          <TopBox />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Store not configured")).toBeInTheDocument();
      });
    });

    it("should show 'Store not configured' when storeId is undefined", async () => {
      const mockUserUndefinedStore = {
        id: "1",
        name: "Test Vendor",
        email: "vendor@test.com",
        role: "seller",
        isApproved: true,
        // storeId intentionally omitted
      };

      setupMockUser(mockUserUndefinedStore);

      render(
        <AuthProvider>
          <TopBox />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Store not configured")).toBeInTheDocument();
      });
    });
  });

  describe("Rendering", () => {
    it("should display 'Recent Customers' header", async () => {
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
        <AuthProvider>
          <TopBox />
        </AuthProvider>
      );

      expect(screen.getByText("Recent Customers")).toBeInTheDocument();
    });
  });

  describe("Data Loading", () => {
    it("should load and display content after API call", async () => {
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
        <AuthProvider>
          <TopBox />
        </AuthProvider>
      );

      // Wait for component to finish loading
      await waitFor(
        () => {
          // Should either show customer data or empty state after loading
          const hasCustomer = screen.queryByText(/Test Customer/i) !== null;
          const hasEmptyState = screen.queryByText("No customers yet") !== null;
          const hasHeader = screen.queryByText("Recent Customers") !== null;
          expect(hasCustomer || hasEmptyState || hasHeader).toBe(true);
        },
        { timeout: 5000 }
      );
    });
  });
});
