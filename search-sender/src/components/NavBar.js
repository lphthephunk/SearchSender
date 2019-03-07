import React from "react";
import Button from "@material-ui/core/Button";

import useHistory from "../hooks/useHistory";
import "./styles/NavBar.css";

const handleLogout = history => {
  localStorage.removeItem("token");
  history.push("/login");
};

export default function NavBar() {
  const { history } = useHistory();
  return (
    <div style={{ position: "fixed", top: "0%", width: "100%" }}>
      <Button
        id="logout-button"
        variant="contained"
        onClick={() => handleLogout(history)}
      >
        Logout
      </Button>
    </div>
  );
}
