import { useState } from "react";
import "./Auth.css";

const API_URL =
  "https://finova-expense-tracker.onrender.com";

function ResetPassword({
  token,
  onResetSuccess,
  onBackToLogin,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // RESET PASSWORD
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ========================================
    // CHECK TOKEN
    // ========================================

    if (!token) {
      setError(
        "Password reset token is missing. Please request a new reset link."
      );
      return;
    }

    // ========================================
    // PASSWORD VALIDATION
    // ========================================

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    // ========================================
    // CONFIRM PASSWORD
    // ========================================

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // ========================================
      // API REQUEST
      // ========================================

      const response = await fetch(
        `${API_URL}/api/auth/reset-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      // ========================================
      // READ RESPONSE SAFELY
      // ========================================

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (
        contentType.includes(
          "application/json"
        )
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
          data.message ||
            "Failed to reset password"
        );
      }

      // ========================================
      // SUCCESS
      // ========================================

      setSuccess(
        "Password reset successfully!"
      );

      setPassword("");
      setConfirmPassword("");

      // ========================================
      // RETURN TO LOGIN
      // ========================================

      setTimeout(() => {
        onResetSuccess();
      }, 1500);

    } catch (error) {
      console.error(
        "Reset password error:",
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
              PASSWORD RESET 🔐
            </p>

            <h2>
              Create new password
            </h2>

            <p>
              Enter a new password for your
              Finova account.
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
              SUCCESS
          ======================================== */}

          {success && (
            <div className="auth-success">
              ✅ {success}
            </div>
          )}


          {/* ========================================
              FORM
          ======================================== */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* ========================================
                NEW PASSWORD
            ======================================== */}

            <div className="form-field">

              <label htmlFor="password">
                New password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(event) => {
                  setPassword(
                    event.target.value
                  );
                  setError("");
                }}
                autoComplete="new-password"
                disabled={loading}
                required
              />

            </div>


            {/* ========================================
                CONFIRM PASSWORD
            ======================================== */}

            <div className="form-field">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value
                  );
                  setError("");
                }}
                autoComplete="new-password"
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
                ? "Resetting..."
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

export default ResetPassword;