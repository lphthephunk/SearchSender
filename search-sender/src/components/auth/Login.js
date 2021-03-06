import React, { useState, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import BackButton from "@material-ui/icons/ArrowBack";
import CheckIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import XIcon from "@material-ui/icons/RemoveCircleOutlineRounded";

import "../styles/Login.css";
import useHistory from "../../hooks/useHistory";
import { FormControl, Avatar, Typography, InputLabel } from "@material-ui/core";
import { client } from "../../apolloClient";
import { AddUser } from "../../graphql/user/mutations";
import { FetchUser } from "../../graphql/user/queries";
import { AuthContext } from "../../utils/AuthWrapper";

export default function Login({ currentPath }) {
  const { history } = useHistory();
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showEmailError, setShowEmailError] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);
  const [unknownError, setUnknownError] = useState("");

  const apolloClient = client();

  const MINIMUM_PASSWORD_LENGTH = 8;

  const handleLogin = async e => {
    e.preventDefault();

    await apolloClient
      .query({
        variables: { email, password },
        query: FetchUser
      })
      .then(res => {
        // store jwt and send them to the next page
        const parsedObj = JSON.parse(res.data.user);
        const userId = parsedObj.userId;
        const token = parsedObj.JWT_TOKEN;
        const email = parsedObj.email;
        localStorage.setItem("JWT_TOKEN", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", email);
        setIsAuthenticated(true);
        if (!currentPath) {
          history.push("/");
        } else {
          history.push(currentPath);
        }
      })
      .catch(err => {
        if (err.graphQLErrors && err.graphQLErrors.length > 0) {
          console.error(err.graphQLErrors[0]);
          setValidationError(err.graphQLErrors[0].message);
        } else {
          setValidationError(
            "Couldn't resolve error. Please try logging in again."
          );
        }
        setIsAuthenticated(false);
      });
  };

  const handleRegister = async e => {
    e.preventDefault();

    await apolloClient
      .mutate({
        variables: { email, password },
        mutation: AddUser
      })
      .then(res => {
        const jsonObj = JSON.parse(res.data.addUser);
        const userId = jsonObj.userId;
        const token = jsonObj.JWT_TOKEN;
        const email = jsonObj.email;

        localStorage.setItem("JWT_TOKEN", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", email);

        setIsAuthenticated(true);

        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setConfirmEmail("");
        setShowRegister(false);

        history.push("/");
      })
      .catch(err => {
        try {
          if (err.graphQLErrors) {
            if (err.graphQLErrors[0].message.match("email")) {
              if (err.graphQLErrors[0].message.match("dup key")) {
                setShowEmailError(true);
              }
            }
          }
        } catch (parseErr) {
          console.error(parseErr);
        } finally {
          setUnknownError("Unkown registration error. Please wait and retry.");
        }
      });
  };

  const doEmailsMatch = () => {
    return email === confirmEmail && email !== "" && confirmEmail !== "";
  };

  const validationAggregator = () => {
    return (
      doEmailsMatch() &&
      doPasswordsMatch() &&
      doPasswordsHaveANumber() &&
      doPasswordsHaveOneLowercaseLetter() &&
      doPasswordsHaveOneUppercaseLetter() &&
      arePasswordsOfMinimumLength()
    );
  };

  const doPasswordsMatch = () => {
    if (
      password === confirmPassword &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const doPasswordsHaveOneUppercaseLetter = () => {
    const matchArray = password.match(/[A-Z]/);
    return matchArray !== null && matchArray.length >= 1;
  };

  const doPasswordsHaveOneLowercaseLetter = () => {
    const matchArray = password.match(/[a-z]/);
    return matchArray !== null && matchArray.length >= 1;
  };

  const doPasswordsHaveANumber = () => {
    const matchArray = password.match(/[0-9]/);
    return matchArray !== null && matchArray.length >= 1;
  };

  const arePasswordsOfMinimumLength = () => {
    return password.length >= MINIMUM_PASSWORD_LENGTH;
  };

  const inlineIconStyle = { display: "flex" };

  const checkMarkStyle = { color: "green" };
  const xStyle = { color: "red" };

  return (
    <div>
      <Typography id="title" component="h1" variant="h2">
        Search Sender
      </Typography>

      {/* Register Popup */}
      {showRegister && (
        <div id="register-container">
          <Paper id="register-paper">
            <div id="register-area">
              <Avatar id="back-button" onClick={() => setShowRegister(false)}>
                <BackButton />
              </Avatar>
              <Typography id="register-text" component="h1" variant="h5">
                Registration
              </Typography>
            </div>
            <form onSubmit={handleRegister}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input
                  type="text"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={event => {
                    setEmail(event.target.value);
                    setShowEmailError(false);
                  }}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Confirm Email Address</InputLabel>
                <Input
                  type="text"
                  name="confirmEmail"
                  autoComplete="confirmEmail"
                  value={confirmEmail}
                  onChange={event => {
                    setConfirmEmail(event.target.value);
                  }}
                />
                {showEmailError === true && (
                  <Typography component="p" style={{ color: "red" }}>
                    * Email already exists in our database
                  </Typography>
                )}
                <div
                  style={{
                    display: "flex",
                    marginBottom: "-20px",
                    marginTop: "5px"
                  }}
                >
                  {doEmailsMatch() ? (
                    <CheckIcon style={checkMarkStyle} />
                  ) : (
                    <XIcon style={xStyle} />
                  )}
                  <Typography component="p">
                    Emails must match exactly
                  </Typography>
                </div>
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={event => {
                    setPassword(event.target.value);
                  }}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Confirm Password</InputLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  autoComplete="current-password"
                  value={confirmPassword}
                  onChange={event => {
                    setConfirmPassword(event.target.value);
                  }}
                />
                <div style={{ display: "flex", marginTop: "5px" }}>
                  {doPasswordsMatch() ? (
                    <CheckIcon style={checkMarkStyle} />
                  ) : (
                    <XIcon style={xStyle} />
                  )}
                  <Typography>Passwords must match exactly</Typography>
                </div>
                <div style={inlineIconStyle}>
                  {arePasswordsOfMinimumLength() ? (
                    <CheckIcon style={checkMarkStyle} />
                  ) : (
                    <XIcon style={xStyle} />
                  )}
                  <Typography>
                    Password must be at least 8 characters
                  </Typography>
                </div>
                <div style={inlineIconStyle}>
                  {doPasswordsHaveANumber() ? (
                    <CheckIcon style={checkMarkStyle} />
                  ) : (
                    <XIcon style={xStyle} />
                  )}
                  <Typography>Must contain at least one number</Typography>
                </div>
                <div style={inlineIconStyle}>
                  {doPasswordsHaveOneLowercaseLetter() ? (
                    <CheckIcon style={checkMarkStyle} />
                  ) : (
                    <XIcon style={xStyle} />
                  )}
                  <Typography>
                    Must contain at least one lowercase letter
                  </Typography>
                </div>
                <div style={inlineIconStyle}>
                  {doPasswordsHaveOneUppercaseLetter() ? (
                    <CheckIcon style={checkMarkStyle} />
                  ) : (
                    <XIcon style={xStyle} />
                  )}
                  <Typography>
                    Must contain at least one uppercase letter
                  </Typography>
                </div>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!validationAggregator()}
              >
                Register
              </Button>
            </form>
          </Paper>
        </div>
      )}

      {!showRegister && (
        <div id="main-container">
          <Paper id="paper">
            <Avatar id="avatar">
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form onSubmit={handleLogin}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel>Email Address</InputLabel>
                <Input
                  type="text"
                  name="email"
                  autoComplete="email"
                  valued={email}
                  onChange={event => setEmail(event.target.value)}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel>Password</InputLabel>
                <Input
                  name="password"
                  autoComplete="current-password"
                  type="password"
                  value={password}
                  onChange={event => {
                    setPassword(event.target.value);
                  }}
                />
              </FormControl>
              <Typography
                id="register"
                component="h4"
                onClick={() => setShowRegister(true)}
              >
                Register
              </Typography>
              {validationError !== "" && (
                <Typography component="p" style={{ color: "red" }}>
                  {validationError}
                </Typography>
              )}
              {unknownError !== "" && (
                <Typography component="p">{unknownError}</Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Log in
              </Button>
            </form>
          </Paper>
        </div>
      )}
    </div>
  );
}
