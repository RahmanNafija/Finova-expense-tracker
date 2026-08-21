import { useState } from "react";
import "./Auth.css";

const API_URL = "http://localhost:5000/api/auth";

function ResetPassword({ token, onResetSuccess, onBackToLogin }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    // Check password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/reset-password`,
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to reset password"
        );
      }

      setSuccess(
        "Password reset successfully!"
      );

      setPassword("");
      setConfirmPassword("");

      // Go back to login after a short delay
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


          {/* FORM */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* NEW PASSWORD */}

            <div className="form-field">

              <label htmlFor="password">
                New password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="form-field">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
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
                ? "Resetting..."
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

export default ResetPassword;