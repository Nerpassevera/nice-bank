import React from "react";
import Card from "../context.js";
import { UserContext } from "../index.js";

/**
 * Represents a login component.
 * @returns {JSX.Element} The login component.
 */
export default function Login() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const ctx = React.useContext(UserContext);

  /**
   * Runs when the loggedUser value in the context changes.
   * If a user is logged in, hides the login component.
   */
  React.useEffect(() => {
    if (ctx.loggedUser) {
      setShow(false);
    }
  }, [ctx.loggedUser]);

  /**
   * Handles the logout functionality.
   * Sets the loggedUser property of the ctx object to undefined and shows a message.
   */
  const handleLogOut = () => {
    ctx.history.push(`${ctx.loggedUser[0].name} logged out`);
    ctx.loggedUser = undefined;
    setShow(true);
  };

  /**
   * Validates the email and password entered by the user.
   * @returns {boolean} True if the email and password are valid, false otherwise.
   */
  function validate() {
    const emailMatched =
      ctx.users.filter((item) => item.email === email.toLowerCase()).length === 1;
    const passwordlMatched =
      ctx.users.filter((item) => item.password === password).length === 1;
    return emailMatched && passwordlMatched;
  }

  /**
   * Handles the login button click event.
   * Validates the login credentials and updates the loggedUser value in the context.
   * If the credentials are valid, hides the login component.
   * If the credentials are invalid, displays an error message.
   */
  function handleLogin() {
    console.log("Login credentials: ", email, password);
    if (validate()) {
      ctx.loggedUser = ctx.users.filter((user) => user.email === email.toLowerCase());
      setStatus("");
      setShow(false);
      ctx.history.push(`${ctx.loggedUser[0].name} logged into account`);
    } else {
      setStatus("Email or password is invalid");
      setTimeout(() => setStatus(""), 3500);
    }
  }

  return (
    <Card
      bgcolor="primary"
      header="Log in"
      status={status}
      body={
        show ? (
          <>
            Email
            <br />
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              aria-describedby="emailHelp"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <br />
            Password
            <br />
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <br />
            <button
              type="submit"
              className="btn btn-light"
              onClick={handleLogin}
            >
              Log in
            </button>
          </>
        ) : (
          <>
            <h5>Success</h5>
            <h6>Enjoy your banking!</h6>
            <br />
            <h6>
              Changed your mind? You can
              <a
                className="link-dark ms-1"
                onClick={handleLogOut}
                role="button"
              >
                log out here
              </a>
            </h6>
          </>
        )
      }
    />
  );
}
