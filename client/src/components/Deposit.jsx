import { useContext, useState, useEffect } from "react";
import Card from "../context.jsx";
import { UserContext } from "../index.jsx";
import { requestUserBalance, balanceOperation, writeToDatabase } from "../services/api.js";

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
  const [userBalance, setUserBalance] = useState("");
  const ctx = useContext(UserContext);

  useEffect(() => {
    console.log("Context has changed");
    if (ctx.loggedUser) {
      setStatus("");
      setShow(true);
      checkUserBalance();
    }
  }, [ctx.loggedUser, checkUserBalance]);

  const user = ctx.loggedUser;

  // console.log("userBalance", userBalance);
  // console.log("🚀 ~ Deposit ~ ctx.loggedUser.email:", user.email);
  // console.log("type of userBalance", typeof userBalance);

  function checkUserBalance() {
    requestUserBalance(ctx.loggedUser.email).then((result) =>
      setUserBalance(result));
  }

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
    balanceOperation(user.email, parseInt(deposit))
      .then(writeToDatabase(user.email, `Deposited $${deposit}`));
    clearForm();
  }


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
              ${ctx.loggedUser ? userBalance : NaN}
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
