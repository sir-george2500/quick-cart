import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./login.scss";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Login Component
 *
 * Handles vendor authentication with email and password.
 * Validates user role and approval status before allowing access.
 */
const Login: React.FC = () => {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      // Attempt login via auth service
      const user = await authService.login(email, password);

      // Check if account is approved
      if (!authService.isApproved(user)) {
        toast.error(
          "Account Pending Verification. Wait for Verification Email."
        );
        setLoading(false);
        return;
      }

      // Check if user has vendor role
      if (!authService.isVendor(user)) {
        toast.error(
          "Not authorized. Only vendor accounts can access this dashboard."
        );
        setLoading(false);
        return;
      }

      // Login successful
      toast.success("Login Successful!");

      // Update auth context
      login(user);

      // Navigate to home page
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during login";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign in to Quick-cart-vendor</h2>
        <p>Sell With Ease</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <div className="options">
            <div className="checkbox-group">
              <input type="checkbox" id="keep-logged-in" />
              <label htmlFor="keep-logged-in">Keep me logged in</label>
            </div>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} aria-busy={loading}>
            {loading ? "Logging in..." : "Login to Your Account"}
          </button>
        </form>

        <p>
          Not a member yet? <Link to="/signup">Create an account</Link>
        </p>
      </div>

      <div className="image-section">
        <img src="/vendor.png" alt="Vendor illustration" />
      </div>
    </div>
  );
};

export default Login;
