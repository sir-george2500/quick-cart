import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import "./login.scss";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";
import { loginSchema, LoginFormValues } from "../../utils/validationSchemas";

/**
 * Login Component
 *
 * Handles vendor authentication with email and password.
 * Uses Formik for form state management and Yup for validation.
 */
const Login: React.FC = () => {
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
        // Attempt login via auth service
        const user = await authService.login(values.email, values.password);

        // Check if account is approved
        if (!authService.isApproved(user)) {
          toast.error(
            "Account Pending Verification. Wait for Verification Email."
          );
          return;
        }

        // Check if user has vendor role
        if (!authService.isVendor(user)) {
          toast.error(
            "Not authorized. Only vendor accounts can access this dashboard."
          );
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
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign in to Quick-cart-vendor</h2>
        <p>Sell With Ease</p>

        <form onSubmit={formik.handleSubmit}>
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
              className={
                formik.touched.email && formik.errors.email ? "error" : ""
              }
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
              autoComplete="current-password"
              className={
                formik.touched.password && formik.errors.password ? "error" : ""
              }
            />
            {formik.touched.password && formik.errors.password && (
              <span className="error-message">{formik.errors.password}</span>
            )}
          </div>

          <div className="options">
            <div className="checkbox-group">
              <input type="checkbox" id="keep-logged-in" />
              <label htmlFor="keep-logged-in">Keep me logged in</label>
            </div>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            aria-busy={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Logging in..." : "Login to Your Account"}
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
