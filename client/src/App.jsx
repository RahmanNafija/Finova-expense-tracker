import { useEffect, useState } from "react";

import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

function App() {
  const [user, setUser] = useState(null);

  const [showSignup, setShowSignup] = useState(false);

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [resetToken, setResetToken] = useState(null);

  // ========================================
  // CHECK EXISTING LOGIN
  // ========================================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid saved user:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // ========================================
  // LOGIN
  // ========================================

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setShowSignup(false);
    setShowForgotPassword(false);
    setResetToken(null);
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setShowSignup(false);
    setShowForgotPassword(false);
    setResetToken(null);
  };

  // ========================================
  // AUTH SCREEN
  // ========================================

  if (!user) {

    // RESET PASSWORD
    if (resetToken) {
      return (
        <ResetPassword
          token={resetToken}
          onResetSuccess={() => {
            setResetToken(null);
            setShowForgotPassword(false);
            setShowSignup(false);
          }}
          onBackToLogin={() => {
            setResetToken(null);
            setShowForgotPassword(false);
          }}
        />
      );
    }

    // FORGOT PASSWORD
    if (showForgotPassword) {
      return (
        <ForgotPassword
          onBackToLogin={() => {
            setShowForgotPassword(false);
          }}
          onResetToken={(token) => {
            setResetToken(token);
          }}
        />
      );
    }

    // SIGNUP
    if (showSignup) {
      return (
        <Signup
          onSwitchToLogin={() => {
            setShowSignup(false);
          }}
        />
      );
    }

    // LOGIN
    return (
      <Login
        onLogin={handleLogin}
        onShowSignup={() => {
          setShowSignup(true);
        }}
        onShowForgotPassword={() => {
          setShowForgotPassword(true);
        }}
      />
    );
  }

  // ========================================
  // DASHBOARD
  // ========================================

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default App;