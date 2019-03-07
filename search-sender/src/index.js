import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, Redirect } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import WrappedBrowserRouter from "./utils/WrappedBrowserRouter";
import AuthWrapper from "./utils/AuthWrapper";
import App from "./components/App";
import AuthedRoute from "./utils/AuthedRoute";
import HomePage from "./components/pages/HomePage";
import Login from "./components/auth/Login";
import client from "./apolloClient";
import ManageSchedulePage from "./components/pages/ManageSchedulePage";
import UserStateProvider from "./utils/UserStateProvider";
import "./mainStyles/style.css";

ReactDOM.render(
  <ApolloProvider client={client}>
    <WrappedBrowserRouter>
      <AuthWrapper>
        <UserStateProvider>
          <App>
            <Switch>
              <AuthedRoute exact path="/" component={HomePage} />
              <AuthedRoute
                exact
                path="/schedules/add"
                component={ManageSchedulePage}
              />
              <AuthedRoute
                exact
                path="/schedules/edit/:scheduleId"
                component={ManageSchedulePage}
              />
              <Route exact path="/login" component={Login} />
              <Route render={() => <Redirect to={{ pathname: "/" }} />} />
            </Switch>
          </App>
        </UserStateProvider>
      </AuthWrapper>
    </WrappedBrowserRouter>
  </ApolloProvider>,
  document.querySelector("#root")
);
