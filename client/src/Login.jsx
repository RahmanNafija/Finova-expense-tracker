import { useState } from "react";
import "./Login.css";
import "./Auth.css";

const API_URL = "https://finova-expense-tracker.onrender.com";

function Login({
  onLogin,
  onShowSignup,
  onShowForgotPassword,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ========================================
  // LOGIN
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Save token
      localStorage.setItem(
        "token",
        data.token
      );

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Send user data to App
      onLogin(data.user);

    } catch (error) {
      console.error("Login error:", error);

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

      {/* ================= LEFT SIDE ================= */}

      <div className="auth-brand-section">

        <div className="auth-brand">

          <div className="auth-brand-icon">
            F
          </div>

          <h1>
            Finova
          </h1>

        </div>

        <p className="auth-tagline">
          Smart Finance, Better Future
        </p>

        <div className="auth-decoration">
          <div className="circle circle-one"></div>
          <div className="circle circle-two"></div>
          <div className="circle circle-three"></div>
        </div>

      </div>


      {/* ================= RIGHT SIDE ================= */}

      <div className="auth-form-section">

        <div className="auth-card">

          {/* HEADER */}

          <div className="auth-header">

            <div className="mobile-logo">
              S
            </div>

            <p className="auth-welcome">
              WELCOME BACK ✨
            </p>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to continue managing
              your expenses.
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}


          {/* FORM */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="form-field">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="form-field">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                {/* FORGOT PASSWORD */}

                <button
                  type="button"
                  className="forgot-password"
                  onClick={onShowForgotPassword}
                >
                  Forgot password?
                </button>

              </div>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Sign In"}

            </button>

          </form>


          {/* SIGNUP */}

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="signup-prompt">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={onShowSignup}
              className="signup-link"
            >
              Create account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;