import { useEffect, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Expenses from "./Expenses";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

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
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setShowSignup(false);
  };

  // ========================================
  // AUTH SCREEN
  // ========================================

  if (!user) {
    if (showSignup) {
      return (
        <Signup
          onSwitchToLogin={() =>
            setShowSignup(false)
          }
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onShowSignup={() =>
          setShowSignup(true)
        }
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