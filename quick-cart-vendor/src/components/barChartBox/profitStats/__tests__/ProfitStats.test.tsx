import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfitStats from "../ProfitsStats";
import { AuthProvider } from "../../../../contexts/AuthContext";

// Mock MUI CircularProgress
jest.mock("@mui/material/CircularProgress", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Mock Recharts components (used by BarChartBox)
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
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

describe("ProfitStats Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Rendering", () => {
    it("should show loading spinner while fetching data", () => {
      const mockUser = {
        id: "1",
        storeId: "test-store-id",
        name: "Test Vendor",
        email: "vendor@test.com",
        role: "seller",
        isApproved: true,
      };

      renderWithAuth(<ProfitStats />, mockUser);
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
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

      renderWithAuth(<ProfitStats />, mockUserNoStore);

      await waitFor(() => {
        expect(screen.getByText("Profit Earned")).toBeInTheDocument();
      });
    });
  });

  describe("Data Loading", () => {
    it("should load and display profit chart", async () => {
      const mockUser = {
        id: "1",
        storeId: "test-store-id",
        name: "Test Vendor",
        email: "vendor@test.com",
        role: "seller",
        isApproved: true,
      };

      renderWithAuth(<ProfitStats />, mockUser);

      await waitFor(
        () => {
          expect(screen.getByText("Profit Earned")).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });
});
