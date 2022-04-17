import React from "react";
import { MdArrowBack } from "../icons";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      name: "",
      signUp: false,
      logIn: true,
      error: "",
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.enter = this.enter.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLogin(event) {
    const { email, password } = this.state;
    event.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(
        (error) =>
          error.message && this.setState({ error: "Invalid credentials" })
      );
  }

  handleSignUp(event) {
    const { name, email, password } = this.state;
    event.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((credentials) =>
        database
          .collection("users")
          .doc(credentials.user.uid)
          .set({
            name,
            email,
            id: credentials.user.uid,
            weather: { unit: "imperial", weatherCities: [] },
          })
      )
      .catch(
        (error) =>
          error.message && this.setState({ error: "Invalid credentials" })
      );
  }

  enter() {
    document.addEventListener("keydown", function (event) {
      if (event.key === "Enter")
        document.getElementsByClassName("login-button")[0].click();
    });
  }

  render() {
    const { logIn, signUp, email, password, name, error } = this.state;
    return (
      <div className="login card">
        {/* Login */}
        {logIn && (
          <div className="login-form">
            <div className="login-title">Welcome!</div>
            <div className="login-input">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={this.handleChange}
                autoComplete="off"
                required
              ></input>
            </div>
            <div className={password ? "login-input password" : "login-input"}>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
                autoComplete="off"
                required
              ></input>
            </div>
            <div className="login-button" onClick={this.handleLogin}>
              Log In
            </div>
            <div className="login-or">- OR -</div>
            <div
              className="login-signup-link"
              onClick={() =>
                this.setState({ signUp: true, logIn: false, error: "" })
              }
            >
              Create Account
            </div>
          </div>
        )}

        {/* Sign Up */}
        {signUp && (
          <div className="signup-form">
            <div className="login-title">Create Account</div>
            <div className="login-input">
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={this.handleChange}
                autoComplete="off"
                required
              ></input>
            </div>
            <div className="login-input">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={this.handleChange}
                autoComplete="off"
                required
              ></input>
            </div>
            <div className={password ? "login-input password" : "login-input"}>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
                autoComplete="off"
                required
              ></input>
            </div>
            <div className="login-button" onClick={this.handleSignUp}>
              Sign Up
            </div>
            <div className="login-button-back">
              <MdArrowBack
                onClick={() =>
                  this.setState({
                    signUp: false,
                    logIn: true,
                    email: "",
                    password: "",
                    name: "",
                    error: "",
                  })
                }
              />
            </div>
          </div>
        )}

        {email && password && this.enter()}
        {error && (
          <div className="login-error">
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
}

export default Login;
