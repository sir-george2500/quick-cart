import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./resetpassword.scss";
import { authService } from "../../services/auth.service";

/**
 * Location state type for type safety
 */
interface LocationState {
  email?: string;
}

/**
 * ResetPassword Component
 *
 * Handles password reset using the security code sent to user's email.
 * Also provides option to resend the security code.
 */
const ResetPassword: React.FC = () => {
  // Form state
  const [securityCode, setSecurityCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state
  const email = (location.state as LocationState)?.email;

  /**
   * Redirect to forgot password if no email in state
   */
  useEffect(() => {
    if (!email) {
      toast.error("Please start the password reset process again.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  /**
   * Validate password requirements
   */
  const validatePasswords = (): string | null => {
    if (!securityCode.trim()) {
      return "Please enter the security code";
    }

    if (!newPassword || !confirmPassword) {
      return "Please enter both password fields";
    }

    if (newPassword.length < 6) {
      return "Password must be at least 6 characters long";
    }

    if (newPassword !== confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationError = validatePasswords();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (!email) {
      toast.error("Email address is missing. Please start over.");
      navigate("/forgot-password");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        email,
        securityCode,
        newPassword,
      });

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle resend security code
   */
  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email address is missing.");
      navigate("/forgot-password");
      return;
    }

    setResendLoading(true);

    try {
      await authService.resendSecurityCode(email);
      toast.success("Security code resent successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend security code.";
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  // Don't render if no email
  if (!email) {
    return null;
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Enter Security Code</h2>
        <p>
          Enter the security code sent to your email, along with your new
          password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="security-code">Security Code</label>
            <input
              type="text"
              id="security-code"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
              placeholder="Enter the security code"
              required
              disabled={loading}
              autoComplete="one-time-code"
              autoFocus
            />
          </div>

          <div className="input-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="button-group">
            <button type="submit" disabled={loading} aria-busy={loading}>
              {loading ? "Resetting password..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading || loading}
              aria-busy={resendLoading}
              className="secondary"
            >
              {resendLoading ? "Resending code..." : "Resend Security Code"}
            </button>
          </div>
        </form>

        <p>
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
