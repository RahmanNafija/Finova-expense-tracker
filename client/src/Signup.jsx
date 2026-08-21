import { useState } from "react";
import "./Auth.css";
import "./Login.css";

const API_URL =
  "https://finova-expense-tracker.onrender.com";

function Signup({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  // ========================================
  // SIGNUP
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ========================================
    // VALIDATION
    // ========================================

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
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // ========================================
      // API REQUEST
      // ========================================

      const response = await fetch(
        `${API_URL}/api/auth/signup`,
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

      // ========================================
      // HANDLE RESPONSE
      // ========================================

      const contentType =
        response.headers.get("content-type");

      let data;

      if (
        contentType &&
        contentType.includes("application/json")
      ) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "Server returned non-JSON response:",
          text
        );

        throw new Error(
          "Server returned an invalid response. Please try again."
        );
      }

      // ========================================
      // HANDLE API ERROR
      // ========================================

      if (!response.ok) {
        throw new Error(
          data.message || "Signup failed."
        );
      }

      // ========================================
      // SUCCESS
      // ========================================

      setSuccess(
        "Account created successfully!"
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // ========================================
      // GO TO LOGIN
      // ========================================

      setTimeout(() => {
        onSwitchToLogin();
      }, 1200);

    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      setError(
        error.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* ========================================
            LOGO
        ======================================== */}

        <div className="auth-logo">
          F
        </div>


        {/* ========================================
            HEADING
        ======================================== */}

        <div className="auth-heading">

          <p className="auth-welcome">
            WELCOME TO FINOVA ✨
          </p>

          <h1>
            Create your account
          </h1>

          <p className="auth-subtitle">
            Start taking control of your
            spending today.
          </p>

        </div>


        {/* ========================================
            FORM
        ======================================== */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />

          </div>


          {/* ERROR */}

          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="auth-success">
              ✅ {success}
            </div>
          )}


          {/* SUBMIT */}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >

            {loading
              ? "Creating account..."
              : "Create Account"}

          </button>

        </form>


        {/* ========================================
            DIVIDER
        ======================================== */}

        <div className="auth-divider">

          <span></span>

          <p>
            or
          </p>

          <span></span>

        </div>


        {/* ========================================
            LOGIN
        ======================================== */}

        <div className="auth-switch">

          <span>
            Already have an account?
          </span>

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