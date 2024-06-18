import { useEffect } from "react";
import BankLogo from "../BadBank-logo.jpg";
import { Tooltip } from "bootstrap";

/**
 * Represents a navigation bar component.
 * @returns {JSX.Element} The JSX element representing the navigation bar.
 */
export default function NavBar() {
  useEffect(() => {
    // Get all elements with data-bs-toggle="tooltip"
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );

    // Create a tooltip for each element
    [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );
    return () => {
      
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
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

        <div className="navbar-nav nav-btn-div">
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
        </div>
      </div>
    </nav>
  );
}
