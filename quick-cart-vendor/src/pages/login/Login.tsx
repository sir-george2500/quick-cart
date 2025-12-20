import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaShoppingBag,
  FaExclamationCircle,
  FaArrowRight,
} from "react-icons/fa";
import "./login.scss";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";
import { loginSchema, LoginFormValues } from "../../utils/validationSchemas";

/**
 * Login Component
 *
 * A stunning, modern login page with glassmorphism design,
 * smooth animations, and premium user experience.
 */
const Login: React.FC = () => {
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Formik form configuration
   */
  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const user = await authService.login(values.email, values.password);

        if (!authService.isApproved(user)) {
          toast.error(
            "Account Pending Verification. Wait for Verification Email."
          );
          return;
        }

        if (!authService.isVendor(user)) {
          toast.error(
            "Not authorized. Only vendor accounts can access this dashboard."
          );
          return;
        }

        toast.success("Welcome back! 🎉");
        login(user);
        navigate("/");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An error occurred during login";
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      {/* Login Form Section */}
      <div className="login-box">
        <div className="login-card">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-icon">
              <FaShoppingBag />
            </div>
            <h1>Quick Cart Vendor</h1>
            <p className="subtitle">Sign in to your dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your password"
                  disabled={formik.isSubmitting}
                  autoComplete="current-password"
                  className={
                    formik.touched.password && formik.errors.password
                      ? "error"
                      : ""
                  }
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
              {formik.touched.password && formik.errors.password && (
                <span className="error-message">
                  <FaExclamationCircle />
                  {formik.errors.password}
                </span>
              )}
            </div>

            {/* Options Row */}
            <div className="options">
              <div className="checkbox-group">
                <input type="checkbox" id="keep-logged-in" />
                <label htmlFor="keep-logged-in">Remember me</label>
              </div>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={formik.isSubmitting}
            >
              <span className="btn-content">
                {formik.isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <FaArrowRight />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <p className="footer-text">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="floating-cards">
          <div className="card card-1">
            <span>🌱</span>
          </div>
          <div className="card card-2">
            <span>🌾</span>
          </div>
          <div className="card card-3">
            <span>🍃</span>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Trusted by 10,000+ vendors
          </div>

          <h2>Grow Your Business With Quick Cart</h2>

          <p>
            Join thousands of successful vendors who trust Quick Cart to manage
            their online store, track sales, and grow their business.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">10K+</div>
              <div className="stat-label">Vendors</div>
            </div>
            <div className="stat">
              <div className="stat-value">$2M+</div>
              <div className="stat-label">Sales</div>
            </div>
            <div className="stat">
              <div className="stat-value">99%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
