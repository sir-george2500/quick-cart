import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import "./resetpassword.scss";
import { authService } from "../../services/auth.service";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "../../utils/validationSchemas";

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
 * Uses Formik for form state management and Yup for validation.
 */
const ResetPassword: React.FC = () => {
  // State for resend loading
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
   * Formik form configuration
   */
  const formik = useFormik<ResetPasswordFormValues>({
    initialValues: {
      securityCode: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!email) {
        toast.error("Email address is missing. Please start over.");
        navigate("/forgot-password");
        return;
      }

      try {
        await authService.resetPassword({
          email,
          securityCode: values.securityCode,
          newPassword: values.newPassword,
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
        setSubmitting(false);
      }
    },
  });

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

  /**
   * Helper to get input class with error state
   */
  const getInputClass = (field: keyof ResetPasswordFormValues) => {
    return formik.touched[field] && formik.errors[field] ? "error" : "";
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

        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label htmlFor="securityCode">Security Code</label>
            <input
              type="text"
              id="securityCode"
              name="securityCode"
              value={formik.values.securityCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter the security code"
              disabled={formik.isSubmitting}
              autoComplete="one-time-code"
              autoFocus
              className={getInputClass("securityCode")}
            />
            {formik.touched.securityCode && formik.errors.securityCode && (
              <span className="error-message">
                {formik.errors.securityCode}
              </span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your new password"
              disabled={formik.isSubmitting}
              autoComplete="new-password"
              className={getInputClass("newPassword")}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <span className="error-message">{formik.errors.newPassword}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Confirm your new password"
              disabled={formik.isSubmitting}
              autoComplete="new-password"
              className={getInputClass("confirmPassword")}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <span className="error-message">
                  {formik.errors.confirmPassword}
                </span>
              )}
          </div>

          <div className="button-group">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              aria-busy={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Resetting password..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading || formik.isSubmitting}
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
