import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./forgotpassword.scss";
import { authService } from "../../services/auth.service";

/**
 * ForgotPassword Component
 *
 * Handles the first step of password recovery by sending
 * a security code to the user's email address.
 */
const ForgotPassword: React.FC = () => {
  // Form state
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Hooks
  const navigate = useNavigate();

  /**
   * Validate email format
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(email);

      toast.success("Security code sent to your email!");

      // Navigate to reset password page with email in state
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send security code. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Reset Your Password</h2>
        <p>Enter your email address to receive a security code.</p>

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
              autoFocus
            />
          </div>

          <button type="submit" disabled={loading} aria-busy={loading}>
            {loading ? "Sending security code..." : "Send Security Code"}
          </button>
        </form>

        <p>
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>

      <div className="image-section">
        <img src="/confusedguy.jpeg" alt="Password recovery illustration" />
      </div>
    </div>
  );
};

export default ForgotPassword;
