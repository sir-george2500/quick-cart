import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { User, AuthContextType } from "../types";
import { authService } from "../services/auth.service";

// Storage keys
const STORAGE_KEYS = {
  IS_AUTHENTICATED: "isAuthenticated",
  USER: "user",
} as const;

/**
 * Auth Context with undefined default
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props for AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Get initial auth state from localStorage
 */
const getInitialAuthState = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
    return stored ? JSON.parse(stored) : false;
  } catch {
    return false;
  }
};

/**
 * Get initial user from localStorage
 */
const getInitialUser = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * Authentication Provider Component
 *
 * Manages authentication state and provides auth methods to the app.
 * Persists auth state to localStorage for session persistence.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(getInitialAuthState);
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Validate stored auth state on mount
   * Clears invalid state if user data is corrupted
   */
  useEffect(() => {
    const storedUser = getInitialUser();
    const storedAuth = getInitialAuthState();

    // If authenticated but no user, clear state
    if (storedAuth && !storedUser) {
      setIsAuthenticated(false);
      localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, []);

  /**
   * Login user and persist to localStorage
   */
  const login = useCallback((userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, JSON.stringify(true));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  }, []);

  /**
   * Logout user - calls API and clears local state
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call logout API to invalidate server-side tokens
      await authService.logout();
    } catch (error) {
      // Log error but still clear local state
      console.error("Logout API error:", error);
    } finally {
      // Always clear local state, even if API call fails
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setIsLoading(false);
    }
  }, []);

  /**
   * Update user data (partial update)
   */
  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      const updatedUser = { ...prevUser, ...userData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  /**
   * Update user avatar specifically
   */
  const setUserAvatar = useCallback(
    (avatarUrl: string) => {
      updateUser({ avatar: avatarUrl });
    },
    [updateUser]
  );

  // Context value with memoization for performance
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    updateUser,
    setUserAvatar,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * Hook to access auth context
 *
 * @throws Error if used outside AuthProvider
 * @returns AuthContextType with auth state and methods
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

/**
 * Export context for testing purposes
 */
export { AuthContext };
