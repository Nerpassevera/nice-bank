import { useEffect, useContext, useState } from "react";
import BankLogo from "../bank-app-logo.png";
import { Tooltip } from "bootstrap";
import { UserContext } from "../index.jsx";
import useAuthentication from "../authentication/auth.js";
import { writeToDatabase } from "../services/api.js";

/**
 * Represents a navigation bar component.
 * @returns {JSX.Element} The JSX element representing the navigation bar.
 */

export default function NavBar() {
  const ctx = useContext(UserContext);
  const [buttonSwitch, setButtonSwitch] = useState(
    ctx.loggedUser ? "logout" : "login"
  );
  const authTools = useAuthentication();

  // console.log("NAVBAR: Navbar renders");

  useEffect(() => {
    // console.log("NAVBAR: useEffect inside Navbar fires");

    // Create tooltips
    // Get all elements with data-bs-toggle="tooltip"
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );

    // Create a tooltip for each element
    [...tooltipTriggerList].map(
      (tooltipTriggerEl) =>
        new Tooltip(tooltipTriggerEl, {
          trigger: "hover",
        })
    );

    if (ctx.loggedUser) {
      setButtonSwitch("logout");
      // console.log('NAVBAR: buttonSwitch has set to "logOUT btn"');
    } else {
      setButtonSwitch("login");
      // console.log('NAVBAR: buttonSwitch has set to "logIN btn"');
    }
  }, [ctx.loggedUser, buttonSwitch]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#" alt="Nice Bank Logo">
          <img src={BankLogo} alt="Bad Bank logo" href="#" width="70" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link"
                href="#/"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                data-bs-title="Bank app landing page"
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#/deposit/"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                data-bs-title="Deposit money into the account"
              >
                Deposit
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="#/withdraw"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                data-bs-title="Withdraw money from the account"
              >
                Withdraw
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="#/alldata"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                data-bs-title="See all accounts data"
              >
                All Data
              </a>
            </li>
          </ul>
        </div>
        <a id="account-greeting">
          Hello, 
          {ctx.loggedUser ? ' ' + ctx.loggedUser.displayName : " dear guest"}
          !
        </a>

        <div className="navbar-nav nav-btn-div">
          {buttonSwitch === "login" ? (
            <a
              className="btn btn-outline-primary"
              id="login-btn"
              type="button"
              href="#/login/"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              data-bs-title="Log into your account"
            >
              Login
            </a>
          ) : (
            <a
              className="btn btn-outline-warning"
              id="logout-btn"
              type="button"
              href="#/login/"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              data-bs-title="Log into your account"
              onClick={() => {
                authTools.handleLogOut();
                writeToDatabase(ctx.loggedUser.email, "Logged out successfully!")
              }}
            >
              Log out
            </a>
          )}

          {buttonSwitch === "login" ? (
            <a
              className="btn btn-outline-success"
              id="signup-btn"
              type="button"
              href="#/CreateAccount"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              data-bs-title="Create new bank account"
            >
              Create Account
            </a>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
