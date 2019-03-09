import React from "react";

export const UserStateContext = React.createContext({});

export default function UserStateProvider({ children }) {
  return (
    <UserStateContext.Provider
      value={{
        userId: localStorage.getItem("userId"),
        email: localStorage.getItem("email")
      }}
    >
      {children}
    </UserStateContext.Provider>
  );
}
