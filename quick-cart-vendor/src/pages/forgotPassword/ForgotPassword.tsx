import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import "./forgotpassword.scss";
import { authService } from "../../services/auth.service";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "../../utils/validationSchemas";

/**
 * ForgotPassword Component
 *
 * Handles the first step of password recovery by sending
 * a security code to the user's email address.
 * Uses Formik for form state management and Yup for validation.
 */
const ForgotPassword: React.FC = () => {
  // Hooks
  const navigate = useNavigate();

  /**
   * Formik form configuration
   */
  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await authService.forgotPassword(values.email);

        toast.success("Security code sent to your email!");

        // Navigate to reset password page with email in state
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
      <div className="forgot-password-box">
        <h2>Reset Your Password</h2>
        <p>Enter your email address to receive a security code.</p>

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
              autoFocus
              className={
                formik.touched.email && formik.errors.email ? "error" : ""
              }
            />
            {formik.touched.email && formik.errors.email && (
              <span className="error-message">{formik.errors.email}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            aria-busy={formik.isSubmitting}
          >
            {formik.isSubmitting
              ? "Sending security code..."
              : "Send Security Code"}
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
