import { useState } from "react";
import "./Auth.css";

const API_URL = "http://localhost:5000/api/auth";

function ForgotPassword({
  onBackToLogin,
  onResetToken,
}) {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // HANDLE PASSWORD RESET REQUEST
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/forgot-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to process password reset"
        );
      }

      // Check whether backend returned a token
      if (!data.resetToken) {
        throw new Error(
          "Password reset token was not generated."
        );
      }

      // Send token to App.jsx
      onResetToken(data.resetToken);

    } catch (error) {
      console.error(
        "Forgot password error:",
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

            <p className="auth-welcome">
              PASSWORD RECOVERY 🔐
            </p>

            <h2>
              Forgot your password?
            </h2>

            <p>
              Enter your email address and
              we'll help you reset your password.
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

            <div className="form-field">

              <label htmlFor="forgot-email">
                Email address
              </label>

              <input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                required
              />

            </div>


            {/* RESET BUTTON */}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : "Reset Password"}
            </button>

          </form>


          {/* BACK TO LOGIN */}

          <div className="signup-prompt">

            <span>
              Remember your password?
            </span>

            <button
              type="button"
              onClick={onBackToLogin}
              className="signup-link"
            >
              Back to login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;