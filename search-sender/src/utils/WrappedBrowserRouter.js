import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

export const RouterContext = React.createContext({});

export default function WrappedBrowserRouter({ children }) {
  return (
    <BrowserRouter>
      <Route>
        {routeProps => (
          <RouterContext.Provider value={routeProps}>
            {children}
          </RouterContext.Provider>
        )}
      </Route>
    </BrowserRouter>
  );
}
