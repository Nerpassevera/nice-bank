import React from "react";
import Card from "../context.jsx";
import useAuthentication from '../authentication/auth.js'

/**
 * Represents a component for creating a user account.
 * @returns {JSX.Element} The JSX element for the CreateAccount component.
 */
export default function CreateAccount() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const authFunctions = useAuthentication();


  /**
   * Clears the form by resetting the name, email, and password fields and setting show to true.
   */
  function clearForm() {
    setName("");
    setEmail("");
    setPassword("");
    setShow(true);
  }

  /**
   * Displays an error message with the given label and clears it after 3 seconds.
   * @param {string} label - The label for the error message.
   */
  function errorMsgTimer(label) {
    setStatus("Error: " + label);
    setTimeout(() => setStatus(""), 5000);
  }

  async function handleCreate (e) {
    console.log('CREATE_ACCOUNT: "Create Account" button clicked');
    e.preventDefault();
    const attempt = await authFunctions.signUp(name, email, password);
    console.log('Attempt: ', attempt);
    if (!attempt){
      clearForm();
      setShow(false);
    } else {
      errorMsgTimer(attempt);
    }
  }
    

  return (
    <Card
      bgcolor="success"
      header="Create Account"
      status={status}
      body={
        show ? (
          <>
            Name
            <br />
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter name"
              aria-describedby="inputGroup-sizing-default"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <br />
            Email address
            <br />
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              aria-describedby="emailHelp"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value.toLowerCase())}
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
              onClick={handleCreate}
              disabled={ true ? (!name || !email || !password) : false}
            >
              Create Account
            </button>
          </>
        ) : (
          <>
            <h5>Success</h5>
            <button type="submit" className="btn btn-light" onClick={clearForm}>
              Add another user
            </button>
          </>
        )
      }
    />
  );
}
