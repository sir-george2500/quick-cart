import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
  FaExclamationCircle,
  FaArrowRight,
  FaRedo,
} from "react-icons/fa";
import "./resetpassword.scss";
import { authService } from "../../services/auth.service";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "../../utils/validationSchemas";

/**
 * Location state type
 */
interface LocationState {
  email?: string;
}

/**
 * ResetPassword Component
 *
 * Stunning password reset page with glassmorphism design.
 */
const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as LocationState)?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Please start the password reset process again.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

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

        toast.success("Password reset successfully! 🎉");
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

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email address is missing.");
      navigate("/forgot-password");
      return;
    }

    setResendLoading(true);

    try {
      await authService.resendSecurityCode(email);
      toast.success("Security code resent successfully! 📧");
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

  const getInputClass = (field: keyof ResetPasswordFormValues) => {
    return formik.touched[field] && formik.errors[field] ? "error" : "";
  };

  if (!email) {
    return null;
  }

  return (
    <div className="reset-password-container">
      {/* Form Section */}
      <div className="reset-password-box">
        <div className="reset-password-card">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-icon">
              <img src="/logo.png" alt="Quick Cart Logo" />
            </div>
            <h1>Reset Your Password</h1>
            <p className="subtitle">
              Enter the security code sent to your email and choose a new
              password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Security Code */}
            <div className="input-group">
              <label htmlFor="securityCode">Security Code</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FaShieldAlt />
                </span>
                <input
                  type="text"
                  id="securityCode"
                  name="securityCode"
                  value={formik.values.securityCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter security code"
                  disabled={formik.isSubmitting}
                  autoComplete="one-time-code"
                  autoFocus
                  className={getInputClass("securityCode")}
                />
              </div>
              {formik.touched.securityCode && formik.errors.securityCode && (
                <span className="error-message">
                  <FaExclamationCircle />
                  {formik.errors.securityCode}
                </span>
              )}
            </div>

            {/* New Password */}
            <div className="input-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter new password"
                  disabled={formik.isSubmitting}
                  autoComplete="new-password"
                  className={getInputClass("newPassword")}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formik.touched.newPassword && formik.errors.newPassword && (
                <span className="error-message">
                  <FaExclamationCircle />
                  {formik.errors.newPassword}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FaLock />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Confirm new password"
                  disabled={formik.isSubmitting}
                  autoComplete="new-password"
                  className={getInputClass("confirmPassword")}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <span className="error-message">
                    <FaExclamationCircle />
                    {formik.errors.confirmPassword}
                  </span>
                )}
            </div>

            {/* Buttons */}
            <div className="button-group">
              <button
                type="submit"
                className="submit-btn"
                disabled={formik.isSubmitting}
              >
                <span className="btn-content">
                  {formik.isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <FaArrowRight />
                    </>
                  )}
                </span>
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={handleResendCode}
                disabled={resendLoading || formik.isSubmitting}
              >
                <span className="btn-content">
                  {resendLoading ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaRedo />
                      Resend Code
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="footer-text">
            Remember your password? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="floating-cards">
          <div className="card card-1">
            <span>🔒</span>
          </div>
          <div className="card card-2">
            <span>✨</span>
          </div>
        </div>

        <div className="hero-content">
          <h2>Create a Strong Password</h2>
          <p>
            Choose a secure password to protect your vendor account and keep
            your business safe.
          </p>
          <div className="illustration">🛡️</div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
