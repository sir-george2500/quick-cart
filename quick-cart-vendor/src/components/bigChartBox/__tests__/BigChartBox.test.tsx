import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BigChartBox from "../BigChartBox";
import { AuthProvider } from "../../../contexts/AuthContext";

/**
 * BigChartBox Component Tests
 */

// Helper to setup localStorage with a mock user
const setupMockUser = (user: object | null) => {
  if (user) {
    localStorage.setItem("quick-cart-vendor-user", JSON.stringify(user));
    localStorage.setItem("quick-cart-vendor-isAuthenticated", "true");
  }
};

describe("BigChartBox Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Rendering", () => {
    it("should display 'Revenue Analytics' header", () => {
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
          <BigChartBox />
        </AuthProvider>
      );

      expect(screen.getByText("Revenue Analytics")).toBeInTheDocument();
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
          <BigChartBox />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Store not configured")).toBeInTheDocument();
      });
    });
  });

  describe("Data Loading", () => {
    it("should render without crashing with valid user", async () => {
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
          <BigChartBox />
        </AuthProvider>
      );

      expect(screen.getByText("Revenue Analytics")).toBeInTheDocument();
    });
  });
});
