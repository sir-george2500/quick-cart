import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PieChartBox from "../PieChartBox";
import { AuthProvider } from "../../../contexts/AuthContext";

/**
 * PieChartBox Component Tests
 */

// Helper to setup localStorage with a mock user
const setupMockUser = (user: object | null) => {
  if (user) {
    localStorage.setItem("quick-cart-vendor-user", JSON.stringify(user));
    localStorage.setItem("quick-cart-vendor-isAuthenticated", "true");
  }
};

describe("PieChartBox Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Rendering", () => {
    it("should display 'Revenue by Product Category' header", () => {
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
          <PieChartBox />
        </AuthProvider>
      );

      expect(
        screen.getByText("Revenue by Product Category")
      ).toBeInTheDocument();
    });
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
          <PieChartBox />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Store not configured")).toBeInTheDocument();
      });
    });
  });

  describe("Data Loading", () => {
    it("should load and display content", async () => {
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
          <PieChartBox />
        </AuthProvider>
      );

      // Wait for component to render content
      await waitFor(() => {
        expect(
          screen.getByText("Revenue by Product Category")
        ).toBeInTheDocument();
      });
    });
  });
});
