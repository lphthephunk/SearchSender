import React, { useState } from "react";

export const AuthContext = React.createContext({});

export default function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("JWT_TOKEN") ? true : false
  );

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
