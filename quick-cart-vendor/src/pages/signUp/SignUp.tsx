import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./signup.scss";
import { authService } from "../../services/auth.service";
import { VendorRegistrationRequest } from "../../types";

/**
 * Form data interface for type safety
 */
interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
}

/**
 * Initial form state
 */
const initialFormData: SignupFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  businessName: "",
  phoneNumber: "",
  address: "",
  city: "",
  state: "",
};

/**
 * Signup Component
 *
 * Handles vendor registration with comprehensive form validation.
 * Registered vendors require admin approval before they can log in.
 */
const Signup: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  // Hooks
  const navigate = useNavigate();

  /**
   * Handle input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  /**
   * Validate form data
   */
  const validateForm = (): string | null => {
    const {
      name,
      email,
      password,
      confirmPassword,
      businessName,
      phoneNumber,
      address,
      city,
      state,
    } = formData;

    // Check required fields
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !businessName ||
      !phoneNumber ||
      !address ||
      !city ||
      !state
    ) {
      return "All fields are required!";
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    // Validate password length
    if (password.length < 6) {
      return "Password must be at least 6 characters long!";
    }

    // Check password match
    if (password !== confirmPassword) {
      return "Passwords do not match!";
    }

    // Validate phone number (basic check)
    const phoneRegex = /^[+]?[\d\s-]{8,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return "Please enter a valid phone number";
    }

    return null;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      // Prepare registration data (exclude confirmPassword)
      const registrationData: VendorRegistrationRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        businessName: formData.businessName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
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
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create an Account</h2>
        <p>Sell With Ease</p>

        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
                autoComplete="name"
              />
            </div>
            <div className="input-group">
              <label htmlFor="businessName">Business Name</label>
              <input
                type="text"
                id="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Enter your business name"
                required
                disabled={loading}
                autoComplete="organization"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
                disabled={loading}
                autoComplete="tel"
              />
            </div>
            <div className="input-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                required
                disabled={loading}
                autoComplete="street-address"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
                required
                disabled={loading}
                autoComplete="address-level2"
              />
            </div>
            <div className="input-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter your state"
                required
                disabled={loading}
                autoComplete="address-level1"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} aria-busy={loading}>
            {loading ? "Creating..." : "Create Account"}
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
