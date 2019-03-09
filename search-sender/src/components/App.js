import React from "react";
import NavBar from "./NavBar";

import useHistory from "../hooks/useHistory";

export default function App({ children }) {
  const { location } = useHistory();
  return (
    <div>
      {location.pathname !== "/login" && <NavBar />}
      {children}
    </div>
  );
}
