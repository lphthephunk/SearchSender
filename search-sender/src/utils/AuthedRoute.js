import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../utils/AuthWrapper";

export default function AuthedRoute(props) {
  const authorized = useContext(AuthContext);

  if (authorized === true) {
    return <Route {...props} />;
  } else {
    return <Redirect to="/login" />;
  }
}
