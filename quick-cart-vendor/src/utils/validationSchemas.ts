import * as Yup from "yup";

/**
 * Login Form Validation Schema
 */
export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

/**
 * Signup Form Validation Schema
 */
export const signupSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  businessName: Yup.string()
    .min(2, "Business name must be at least 2 characters")
    .required("Business name is required"),
  phoneNumber: Yup.string()
    .matches(/^[+]?[\d\s-]{8,}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  address: Yup.string()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),
  city: Yup.string()
    .min(2, "City must be at least 2 characters")
    .required("City is required"),
  state: Yup.string()
    .min(2, "State must be at least 2 characters")
    .required("State is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

/**
 * Forgot Password Form Validation Schema
 */
export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

/**
 * Reset Password Form Validation Schema
 */
export const resetPasswordSchema = Yup.object({
  securityCode: Yup.string()
    .min(4, "Security code must be at least 4 characters")
    .required("Security code is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your password"),
});

/**
 * Type exports for form values
 */
export type LoginFormValues = Yup.InferType<typeof loginSchema>;
export type SignupFormValues = Yup.InferType<typeof signupSchema>;
export type ForgotPasswordFormValues = Yup.InferType<
  typeof forgotPasswordSchema
>;
export type ResetPasswordFormValues = Yup.InferType<typeof resetPasswordSchema>;
