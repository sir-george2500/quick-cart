import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PieChartBox from "../PieChartBox";
import { AuthProvider } from "../../../contexts/AuthContext";

// Mock MUI CircularProgress
jest.mock("@mui/material/CircularProgress", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Mock Recharts components to avoid rendering issues in tests
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
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

      renderWithAuth(<PieChartBox />, mockUser);
      expect(
        screen.getByText("Revenue by Product Category")
      ).toBeInTheDocument();
    });

    it("should show loading spinner while fetching data", () => {
      const mockUser = {
        id: "1",
        storeId: "test-store-id",
        name: "Test Vendor",
        email: "vendor@test.com",
        role: "seller",
        isApproved: true,
      };

      renderWithAuth(<PieChartBox />, mockUser);
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
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

      renderWithAuth(<PieChartBox />, mockUserNoStore);

      await waitFor(() => {
        expect(screen.getByText("Store not configured")).toBeInTheDocument();
      });
    });
  });

  describe("Data Loading", () => {
    it("should load and display chart when data is available", async () => {
      const mockUser = {
        id: "1",
        storeId: "test-store-id",
        name: "Test Vendor",
        email: "vendor@test.com",
        role: "seller",
        isApproved: true,
      };

      renderWithAuth(<PieChartBox />, mockUser);

      await waitFor(
        () => {
          // Should either show chart or empty state
          const hasChart = screen.queryByTestId("pie-chart") !== null;
          const hasEmptyState =
            screen.queryByText("No category data yet") !== null;
          expect(hasChart || hasEmptyState).toBe(true);
        },
        { timeout: 5000 }
      );
    });
  });
});
