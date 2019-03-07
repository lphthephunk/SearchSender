import React from "react";

export const AuthContext = React.createContext({});

export default function AuthWrapper({ children }) {
  return (
    <AuthContext.Provider value={localStorage.getItem("token") !== null}>
      {children}
    </AuthContext.Provider>
  );
}
