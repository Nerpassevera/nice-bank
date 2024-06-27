import React from "react";
import Card from "../context.jsx";

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
  function errorMsg(label) {
    setStatus("Error: " + label);
    setTimeout(() => setStatus(""), 3000);
  }

  /**
   * Validates a field based on its value and label.
   * @param {string} field - The value of the field to validate.
   * @param {string} label - The label of the field to validate.
   * @returns {boolean} True if the field is valid, false otherwise.
   */
  function validate(field) {
    if (!field) {
      errorMsg("All fields are requiered");
      return false;
    }
    // Validation for email field
    if (
      // If this is an email field
      field === email &&
      // If email format is correct
      !String(field)
        .toLowerCase()
        .match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    ){
      errorMsg("email is incorrect");
      return false;
    }
    if (field === password && password.length < 8) {
      errorMsg("password should be 8 characters or more");
      return false;
    }
    return true;
  }

  /**
   * Checks if a user with the given email already exists.
   * @param {string} newUserEmail - The email of the new user to check.
   * @returns {boolean} True if a user with the given email already exists, false otherwise.
   */
  const userExists = (newUserEmail) => {
    let condition = Boolean(
      // ctx.users.filter((user) => user.email === newUserEmail.toLowerCase())
      //   .length > 0
    );

    if (condition) {
      errorMsg("user with this email already exists");
      return true;
    }
    return false;
  };

  /**
   * Handles the create account action by validating the form fields and creating a new user account.
   */
  function handleCreate() {
    if (
      validate(name, "name") &&
      validate(email, "email") &&
      // !userExists(email) &&
      validate(password, "password")
    ) {
      console.log(name, email, password);
      const url = `http://localhost:3001/account/create/${name}/${email}/${password}`;
    ( async () => {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
    })();
      alert(`Account for user ${name} has been created`);
      clearForm();
      setShow(false);
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
