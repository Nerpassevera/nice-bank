import { useContext, useState } from "react";
import Card from "../context.jsx";
import { UserContext } from "../index.jsx";

/**
 * Represents a component for depositing funds into a user's account.
 * @returns {JSX.Element} The Deposit component.
 */
export default function Deposit() {
  const [show, setShow] = useState(false);
  const [deposit, setDeposit] = useState("");
  const [status, setStatus] = useState(
    "Please log in for managing your account balance"
  );
  const ctx = useContext(UserContext);
  var user = ctx.loggedUser;

  /**
   * Validates the user and shows the deposit form if the user is logged in.
   */
  function validateUser() {
    if (user && !show) {
      setShow(true);
      setStatus("");

      if (!user[0].hasOwnProperty("balance")) {
        user[0].balance = 0;
      }
    }
  }

  /**
   * Clears the deposit form.
   */
  function clearForm() {
    setDeposit(0);
  }

  /**
   * Handles the deposit action.
   */
  function handleDeposit() {
    user[0].balance = user[0].balance + Number(deposit);
    clearForm();
    setStatus(`${deposit}$ deposited successfully!`);
    setTimeout(() => {
      setStatus("");
    }, 4000);
    ctx.history.push(`${user[0].name} deposited $${deposit}`);
  }

  // validateUser();

  return (
    <Card
      bgcolor="success"
      header="Deposit"
      status={status}
      body={
        show ? (
          <>
            <p style={{ width: "50%", float: "left" }}>Balance</p>
            <p style={{ width: "50%", float: "right" }}>
              ${user[0] ? user[0].balance : NaN}
            </p>
            Deposit amount
            <input
              type="number"
              className="form-control"
              id="deposit"
              placeholder="Enter deposit amount"
              value={deposit}
              min={0}
              onChange={(e) => setDeposit(e.currentTarget.value)}
            />
            <br />
            <button
              type="submit"
              className="btn btn-light"
              disabled={deposit <= 0}
              onClick={handleDeposit}
            >
              Deposit
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
