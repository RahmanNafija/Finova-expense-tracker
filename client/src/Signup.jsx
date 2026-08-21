import { useState } from "react";
import "./Auth.css";
import "./Login.css";
function Signup({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "https://finova-expense-tracker.onrender.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed.");
      }

      setSuccess("Account created successfully!");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        onSwitchToLogin();
      }, 1200);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* Logo */}
       <div className="auth-logo">
            F
            </div>

        {/* Heading */}
        <div className="auth-heading">
          <p className="auth-welcome">
            WELCOME TO FINOVA ✨
          </p>

          <h1>Create your account</h1>

          <p className="auth-subtitle">
            Start taking control of your spending today.
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Name */}
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email address</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
          >
            Create Account
          </button>

        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        {/* Login */}
        <div className="auth-switch">
          <span>Already have an account?</span>

          <button
            type="button"
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </div>

      </div>

    </div>
  );
}

export default Signup;