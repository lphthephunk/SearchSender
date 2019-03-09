import React, { useContext } from "react";
import Button from "@material-ui/core/Button";

import useHistory from "../hooks/useHistory";
import { AuthContext } from "../utils/AuthWrapper";
import { UserStateContext } from "../utils/UserStateProvider";
import "./styles/NavBar.css";
import { Typography } from "@material-ui/core";

export default function NavBar() {
  const { history } = useHistory();
  const { setIsAuthenticated } = useContext(AuthContext);
  const { email } = useContext(UserStateContext);

  const handleLogout = history => {
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    setIsAuthenticated(false);
    history.push("/login");
  };
  return (
    <div id="nav-container">
      <Button
        id="logout-button"
        variant="contained"
        onClick={() => handleLogout(history)}
      >
        Logout
      </Button>
      <Typography
        style={{ marginTop: "15px", marginRight: "20px" }}
        component="h4"
        variant="h5"
      >
        Hi, {email}!
      </Typography>
    </div>
  );
}
