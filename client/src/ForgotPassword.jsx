import { useState } from "react";
import "./Auth.css";

const API_URL =
  "https://finova-expense-tracker.onrender.com";

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

    // ========================================
    // EMAIL VALIDATION
    // ========================================

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      // ========================================
      // API REQUEST
      // ========================================

      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );

      // ========================================
      // READ RESPONSE SAFELY
      // ========================================

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
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
          data.message ||
            "Failed to process password reset."
        );
      }

      // ========================================
      // CHECK RESET TOKEN
      // ========================================

      if (!data.resetToken) {
        throw new Error(
          "Password reset token was not generated."
        );
      }

      // ========================================
      // SEND TOKEN TO APP.JSX
      // ========================================

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

      {/* ========================================
          LEFT SIDE
      ======================================== */}

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


      {/* ========================================
          RIGHT SIDE
      ======================================== */}

      <div className="auth-form-section">

        <div className="auth-card">

          {/* ========================================
              HEADER
          ======================================== */}

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


          {/* ========================================
              ERROR
          ======================================== */}

          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}


          {/* ========================================
              FORM
          ======================================== */}

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
                autoComplete="email"
                disabled={loading}
                required
              />

            </div>


            {/* ========================================
                RESET BUTTON
            ======================================== */}

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


          {/* ========================================
              BACK TO LOGIN
          ======================================== */}

          <div className="signup-prompt">

            <span>
              Remember your password?
            </span>

            <button
              type="button"
              onClick={onBackToLogin}
              className="signup-link"
              disabled={loading}
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