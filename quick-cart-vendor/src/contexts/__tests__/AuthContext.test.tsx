import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../AuthContext";
import { User } from "../../types";

// Mock the authService
jest.mock("../../services/auth.service", () => ({
  authService: {
    logout: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// Test component that uses the auth context
const TestComponent: React.FC = () => {
  const { isAuthenticated, user, login, logout, updateUser, setUserAvatar } =
    useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? "authenticated" : "not-authenticated"}
      </div>
      <div data-testid="user-name">{user?.name || "no-user"}</div>
      <div data-testid="user-avatar">{user?.avatar || "no-avatar"}</div>
      <button onClick={() => login(mockUser)}>Login</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => updateUser({ name: "Updated Name" })}>
        Update User
      </button>
      <button onClick={() => setUserAvatar("https://example.com/avatar.jpg")}>
        Set Avatar
      </button>
    </div>
  );
};

const mockUser: User = {
  id: "test-id",
  name: "Test User",
  email: "test@example.com",
  role: "seller",
  avatar: null,
  isApproved: true,
};

describe("AuthContext", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe("AuthProvider", () => {
    it("should provide initial unauthenticated state", () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "not-authenticated"
      );
      expect(screen.getByTestId("user-name")).toHaveTextContent("no-user");
    });

    it("should restore auth state from localStorage", () => {
      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === "isAuthenticated") return "true";
        if (key === "user") return JSON.stringify(mockUser);
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "authenticated"
      );
      expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
    });

    it("should clear state if authenticated but no user in storage", () => {
      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === "isAuthenticated") return "true";
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Should reset to unauthenticated
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "not-authenticated"
      );
    });
  });

  describe("login", () => {
    it("should update state and localStorage on login", async () => {
      const user = userEvent.setup();

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText("Login"));

      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "authenticated"
      );
      expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "isAuthenticated",
        "true"
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(mockUser)
      );
    });
  });

  describe("logout", () => {
    it("should clear state and localStorage on logout", async () => {
      const user = userEvent.setup();

      // Start logged in
      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === "isAuthenticated") return "true";
        if (key === "user") return JSON.stringify(mockUser);
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText("Logout"));

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "not-authenticated"
        );
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "isAuthenticated"
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user");
    });
  });

  describe("updateUser", () => {
    it("should update user data and localStorage", async () => {
      const user = userEvent.setup();

      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === "isAuthenticated") return "true";
        if (key === "user") return JSON.stringify(mockUser);
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText("Update User"));

      expect(screen.getByTestId("user-name")).toHaveTextContent("Updated Name");
    });
  });

  describe("setUserAvatar", () => {
    it("should update avatar and localStorage", async () => {
      const user = userEvent.setup();

      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === "isAuthenticated") return "true";
        if (key === "user") return JSON.stringify(mockUser);
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await user.click(screen.getByText("Set Avatar"));

      expect(screen.getByTestId("user-avatar")).toHaveTextContent(
        "https://example.com/avatar.jpg"
      );
    });
  });

  describe("useAuth hook", () => {
    it("should throw error when used outside AuthProvider", () => {
      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow("useAuth must be used within an AuthProvider");

      consoleSpy.mockRestore();
    });
  });
});
