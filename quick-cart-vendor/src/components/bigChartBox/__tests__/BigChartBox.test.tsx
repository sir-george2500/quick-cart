import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BigChartBox from "../BigChartBox";
import { AuthProvider } from "../../../contexts/AuthContext";

// Mock MUI CircularProgress
jest.mock("@mui/material/CircularProgress", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Mock Recharts components
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
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

      renderWithAuth(<BigChartBox />, mockUser);
      expect(screen.getByText("Revenue Analytics")).toBeInTheDocument();
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

      renderWithAuth(<BigChartBox />, mockUser);
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

      renderWithAuth(<BigChartBox />, mockUserNoStore);

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

      renderWithAuth(<BigChartBox />, mockUser);

      await waitFor(
        () => {
          expect(screen.getByTestId("area-chart")).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });
});
