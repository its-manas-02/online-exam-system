// Fronyend/src/context/AuthContext
import React from "react";

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Helper function to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now(); // exp is in seconds
    } catch (e) {
      return true; // Invalid token
    }
  };

  // Load user & token from localStorage on app start
  React.useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        // setUser(JSON.parse(storedUser));
        const userData = JSON.parse(storedUser);

        if (isTokenExpired(storedToken)) {
          console.log("🔴 Old/Expired token found. Logging out...");
          logout();
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to parse user data");
        // localStorage.removeItem("token");
        // localStorage.removeItem("user");
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = (userData , token) => {
    if (!token || !userData) return;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData); // 🔥 instant UI update
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // 🔥 instant UI update
    // Redirect to login page
    window.location.href = "/login";
  };

  // Optional: Check token validity
  // const checkTokenValidity = () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     logout();
  //     return false;
  //   }
  //   return true;
  // };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);