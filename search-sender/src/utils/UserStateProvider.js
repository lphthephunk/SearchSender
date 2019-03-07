import React from "react";

export const UserStateContext = React.createContext({});

export default function UserStateProvider({ children }) {
  return (
    <UserStateContext.Provider value={localStorage.getItem("userId")}>
      {children}
    </UserStateContext.Provider>
  );
}
