import { BrowserRouter } from "react-router-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfitStats from "../ProfitsStats";
import { AuthProvider } from "../../../../contexts/AuthContext";

/**
 * ProfitStats Component Tests
 */

// Helper to setup localStorage with a mock user
const setupMockUser = (user: object | null) => {
  if (user) {
    localStorage.setItem("quick-cart-vendor-user", JSON.stringify(user));
    localStorage.setItem("quick-cart-vendor-isAuthenticated", "true");
  }
};

describe("ProfitStats Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Error States", () => {
    it("should render BarChartBox when user has no storeId", async () => {
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
          <ProfitStats />
        </AuthProvider></BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Profit Earned")).toBeInTheDocument();
      });
    });
  });

  describe("Rendering", () => {
    it("should display Profit Earned title", async () => {
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
          <ProfitStats />
        </AuthProvider></BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Profit Earned")).toBeInTheDocument();
      });
    });
  });
});
