import React, { useEffect, useState, useContext } from "react";
import Card from "../context.jsx";
import { UserContext } from "../index.jsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import useAuthentication from "../authentication/auth.js";

/**
 * Represents a login component.
 * @returns {JSX.Element} The login component.
 */
export default function Login() {
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const ctx = useContext(UserContext);
  const auth = getAuth();
  const authFunctions = useAuthentication();
  
  console.log('LOGIN: Login module renders');

  useEffect(() => {
    console.log('LOGIN: useEffect fires');

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('LOGIN: unsibscribe cleanup function fires');
      if (user) {
        ctx.setLoggedUser(user);
        console.log("LOGIN: now logged in as", ctx.loggedUser);
      } else {
        ctx.setLoggedUser(null);
        console.log("LOGIN: no logged user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, ctx]);


  function errorMsgTimer(label) {
    setStatus("Error: " + label);
    setTimeout(() => setStatus(""), 3000);
  }

  if (loading) {
    return (
      <Card
        bgcolor="primary"
        header="Log in"
        status={status}
        body={<div>Loading ... </div>}
      />
    );
  }
  

  return (
    <Card
      bgcolor="primary"
      header="Log in"
      status={status}
      body={
        !ctx.loggedUser ? (
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
              id="login-button"
              type="submit"
              className="btn btn-light"
              onClick={async (e) => {
                console.log('LOGIN: "LogIN" button clicked');
                e.preventDefault();
                const attempt = await authFunctions.handleLogin(email, password);
                console.log("🚀 ~ Login ~ attempt:", attempt)
                if ( attempt !== undefined ){
                  console.log("🚀 ~ Login ~ attempt !== undefined:", attempt !== undefined)
                  errorMsgTimer(attempt);
                  return;
                } else {
                  setLoading(true);
                }
              }}
            >
              Log in
            </button>
          </>
        ) : (
          <>
            <h5>Success</h5>
            <h6>Enjoy your banking!</h6>            
          </>
        )
      }
    />
  );
}
