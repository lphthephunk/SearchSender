import React from "react";
import NavBar from "./NavBar";

import useHistory from "../hooks/useHistory";

const handleLogout = () => {
  console.log("removing token");
  localStorage.removeItem("token");
};

export default function App({ children }) {
  const { location } = useHistory();
  return (
    <div>
      {location.pathname !== "/login" && <NavBar handleLogout={handleLogout} />}
      {children}
    </div>
  );
}
