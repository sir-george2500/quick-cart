import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import "./signup.scss";
import { authService } from "../../services/auth.service";
import { VendorRegistrationRequest } from "../../types";
import { signupSchema, SignupFormValues } from "../../utils/validationSchemas";

/**
 * Signup Component
 *
 * Handles vendor registration with comprehensive form validation.
 * Uses Formik for form state management and Yup for validation.
 */
const Signup: React.FC = () => {
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
        // Prepare registration data (exclude confirmPassword)
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

        // Register vendor via auth service
        const message = await authService.registerVendor(registrationData);

        toast.success(
          message || "Seller account created successfully, pending approval."
        );

        // Navigate to login page
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

  /**
   * Helper to get input class with error state
   */
  const getInputClass = (field: keyof SignupFormValues) => {
    return formik.touched[field] && formik.errors[field] ? "error" : "";
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create an Account</h2>
        <p>Sell With Ease</p>

        <form onSubmit={formik.handleSubmit}>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your full name"
                disabled={formik.isSubmitting}
                autoComplete="name"
                className={getInputClass("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <span className="error-message">{formik.errors.name}</span>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="businessName">Business Name</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formik.values.businessName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your business name"
                disabled={formik.isSubmitting}
                autoComplete="organization"
                className={getInputClass("businessName")}
              />
              {formik.touched.businessName && formik.errors.businessName && (
                <span className="error-message">
                  {formik.errors.businessName}
                </span>
              )}
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your phone number"
                disabled={formik.isSubmitting}
                autoComplete="tel"
                className={getInputClass("phoneNumber")}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <span className="error-message">
                  {formik.errors.phoneNumber}
                </span>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your address"
                disabled={formik.isSubmitting}
                autoComplete="street-address"
                className={getInputClass("address")}
              />
              {formik.touched.address && formik.errors.address && (
                <span className="error-message">{formik.errors.address}</span>
              )}
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your city"
                disabled={formik.isSubmitting}
                autoComplete="address-level2"
                className={getInputClass("city")}
              />
              {formik.touched.city && formik.errors.city && (
                <span className="error-message">{formik.errors.city}</span>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your state"
                disabled={formik.isSubmitting}
                autoComplete="address-level1"
                className={getInputClass("state")}
              />
              {formik.touched.state && formik.errors.state && (
                <span className="error-message">{formik.errors.state}</span>
              )}
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
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
                className={getInputClass("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="error-message">{formik.errors.email}</span>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your password"
                disabled={formik.isSubmitting}
                autoComplete="new-password"
                className={getInputClass("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <span className="error-message">{formik.errors.password}</span>
              )}
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Confirm your password"
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
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            aria-busy={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      <div className="image-section">
        <img src="/vendor.png" alt="Vendor illustration" />
      </div>
    </div>
  );
};

export default Signup;
