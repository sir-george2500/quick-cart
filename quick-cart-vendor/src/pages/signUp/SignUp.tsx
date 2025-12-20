import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaStore,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaGlobeAfrica,
  FaExclamationCircle,
  FaArrowRight,
  FaCheckCircle,
  FaTruck,
  FaChartLine,
} from "react-icons/fa";
import "./signup.scss";
import { authService } from "../../services/auth.service";
import { VendorRegistrationRequest } from "../../types";
import { signupSchema, SignupFormValues } from "../../utils/validationSchemas";

/**
 * Signup Component
 *
 * A stunning, modern signup page with glassmorphism design,
 * smooth animations, and agriculture-themed green colors.
 */
const Signup: React.FC = () => {
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hooks
  const navigate = useNavigate();

  /**
   * Formik form configuration
   */
  const formik = useFormik<SignupFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      businessName: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
    },
    validationSchema: signupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const registrationData: VendorRegistrationRequest = {
          name: values.name,
          email: values.email,
          password: values.password,
          businessName: values.businessName,
          phoneNumber: values.phoneNumber,
          address: values.address,
          city: values.city,
          state: values.state,
        };

        const message = await authService.registerVendor(registrationData);

        toast.success(
          message || "Account created successfully! 🎉 Pending approval."
        );
        navigate("/login");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Signup failed! Please try again.";
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getInputClass = (field: keyof SignupFormValues) => {
    return formik.touched[field] && formik.errors[field] ? "error" : "";
  };

  return (
    <div className="signup-container">
      {/* Signup Form Section */}
      <div className="signup-box">
        <div className="signup-card">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-icon">
              <img src="/logo.png" alt="Quick Cart Logo" />
            </div>
            <h1>Join Quick Cart</h1>
            <p className="subtitle">Start selling your products today</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Row 1: Name & Business Name */}
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="John Doe"
                    disabled={formik.isSubmitting}
                    autoComplete="name"
                    className={getInputClass("name")}
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <span className="error-message">
                    <FaExclamationCircle />
                    {formik.errors.name}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="businessName">Business Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaStore />
                  </span>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formik.values.businessName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Your Farm Name"
                    disabled={formik.isSubmitting}
                    autoComplete="organization"
                    className={getInputClass("businessName")}
                  />
                </div>
                {formik.touched.businessName && formik.errors.businessName && (
                  <span className="error-message">
                    <FaExclamationCircle />
                    {formik.errors.businessName}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="form-row">
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
                    placeholder="you@example.com"
                    disabled={formik.isSubmitting}
                    autoComplete="email"
                    className={getInputClass("email")}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <span className="error-message">
                    <FaExclamationCircle />
                    {formik.errors.email}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaPhone />
                  </span>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="+1234567890"
                    disabled={formik.isSubmitting}
                    autoComplete="tel"
                    className={getInputClass("phoneNumber")}
                  />
                </div>
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <span className="error-message">
                    <FaExclamationCircle />
                    {formik.errors.phoneNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Row 3: Address */}
            <div className="form-row">
              <div className="input-group full-width">
                <label htmlFor="address">Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaMapMarkerAlt />
                  </span>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="123 Farm Road"
                    disabled={formik.isSubmitting}
                    autoComplete="street-address"
                    className={getInputClass("address")}
                  />
                </div>
                {formik.touched.address && formik.errors.address && (
                  <span className="error-message">
                    <FaExclamationCircle />
                    {formik.errors.address}
                  </span>
                )}
              </div>
            </div>

            {/* Row 4: City & State */}
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="city">City</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaCity />
                  </span>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Your City"
                    disabled={formik.isSubmitting}
                    autoComplete="address-level2"
                    className={getInputClass("city")}
                  />
                </div>
                {formik.touched.city && formik.errors.city && (
                  <span className="error-message">
                    <FaExclamationCircle />
                    {formik.errors.city}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="state">State / Region</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <FaGlobeAfrica />
                  </span>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Your State"
                    disabled={formik.isSubmitting}
                    autoComplete="address-level1"
                    className={getInputClass("state")}
                  />
                </div>
                {formik.touched.state && formik.errors.state && (
                  <span className="error-message">
                    <FaExclamationCircle />
                    {formik.errors.state}
                  </span>
                )}
              </div>
            </div>

            {/* Row 5: Password & Confirm */}
            <div className="form-row">
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
                    placeholder="••••••••"
                    disabled={formik.isSubmitting}
                    autoComplete="new-password"
                    className={getInputClass("password")}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                    placeholder="••••••••"
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FaArrowRight />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <p className="footer-text">
            Already have an account? <Link to="/login">Sign In</Link>
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
            <span>🥬</span>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Free to join
          </div>

          <h2>Grow Your Farm Business</h2>

          <p>
            Join thousands of farmers who sell their fresh produce directly to
            customers through Quick Cart.
          </p>

          <div className="features-list">
            <div className="feature">
              <div className="feature-icon">
                <FaCheckCircle />
              </div>
              <span>Easy product listing</span>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <FaTruck />
              </div>
              <span>Fast delivery network</span>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <span>Real-time sales analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
