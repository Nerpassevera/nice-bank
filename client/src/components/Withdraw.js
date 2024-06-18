import React from "react";
import Card from "../context.js";
import { UserContext } from "../index.js";

/**
 * Represents a component for withdrawing funds from a user's account.
 * @returns {JSX.Element} The Withdraw component.
 */
export default function Withdraw() {
  const [show, setShow] = React.useState(false);
  const [withdraw, setWithdraw] = React.useState("");
  const [status, setStatus] = React.useState(
    "Please log in for managing your account balance"
  );
  const ctx = React.useContext(UserContext);
  var user = ctx.loggedUser;

  /**
   * Validates the user and updates the component state accordingly.
   */
  function validateUser() {
    if (user && !show) {
      setShow(true);
      setStatus("");

      if (!user[0].balance) {
        user[0].balance = 0;
      }
    }
  }

  /**
   * Clears the withdraw form.
   */
  function clearForm() {
    setWithdraw(0);
  }

  /**
   * Handles the withdraw action.
   * If the user has sufficient funds, the balance is updated and a success message is displayed.
   * Otherwise, an insufficient funds message is displayed.
   */
  function handleWithdraw() {
    if (user[0].balance >= withdraw) {
      user[0].balance = user[0].balance - Number(withdraw);
      clearForm();
      setStatus(`${withdraw}$ withdrew successfully!`);
      setTimeout(() => {
        setStatus("");
      }, 4000);
      ctx.history.push(`${user[0].name} withdrew $${withdraw}`);
    } else {
      setStatus("Insufficient funds");
      setTimeout(() => setStatus(""), 4000);
    }
  }

  validateUser();

  return (
    <Card
      bgcolor="info"
      header="Withdraw"
      status={status}
      body={
        show ? (
          <>
            <p style={{ width: "50%", float: "left" }}>Balance</p>
            <p style={{ width: "50%", float: "right" }}>
              ${user[0] ? user[0].balance : NaN}
            </p>
            Withdraw amount
            <input
              type="number"
              className="form-control"
              id="Withdraw"
              placeholder="Enter withdraw amount"
              value={withdraw}
              min={0}
              onChange={(e) => setWithdraw(e.currentTarget.value)}
            />
            <br />
            <button
              type="submit"
              className="btn btn-light"
              disabled={withdraw <= 0}
              onClick={handleWithdraw}
            >
              Withdraw
            </button>
          </>
        ) : (
          <>
            <h5>Important!</h5>
          </>
        )
      }
    />
  );
}
