import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import {
  FaEnvelope,
  FaExclamationCircle,
  FaArrowRight,
  FaKey,
} from "react-icons/fa";
import "./forgotpassword.scss";
import { authService } from "../../services/auth.service";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "../../utils/validationSchemas";

/**
 * ForgotPassword Component
 *
 * Stunning password recovery page with glassmorphism design.
 */
const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await authService.forgotPassword(values.email);
        toast.success("Security code sent to your email! 📧");
        navigate("/reset-password", { state: { email: values.email } });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to send security code. Please try again.";
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="forgot-password-container">
      {/* Form Section */}
      <div className="forgot-password-box">
        <div className="forgot-password-card">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-icon">
              <img src="/logo.png" alt="Quick Cart Logo" />
            </div>
            <h1>Forgot Password?</h1>
            <p className="subtitle">
              No worries! Enter your email and we'll send you a security code to
              reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your email"
                  disabled={formik.isSubmitting}
                  autoComplete="email"
                  autoFocus
                  className={
                    formik.touched.email && formik.errors.email ? "error" : ""
                  }
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <span className="error-message">
                  <FaExclamationCircle />
                  {formik.errors.email}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={formik.isSubmitting}
            >
              <span className="btn-content">
                {formik.isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Security Code
                    <FaArrowRight />
                  </>
                )}
              </span>
            </button>
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
            <span>🔐</span>
          </div>
          <div className="card card-2">
            <span>📧</span>
          </div>
        </div>

        <div className="hero-content">
          <h2>Reset Your Password Securely</h2>
          <p>
            We'll send a secure code to your email address to help you regain
            access to your account.
          </p>
          <div className="illustration">🔑</div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
