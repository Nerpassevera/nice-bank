import { useContext, useState, useEffect } from "react";
import Card from "../context.jsx";
import { UserContext } from "../index.jsx";
import {
  requestUserBalance,
  balanceOperation,
  writeToDatabase,
} from "../services/api.js";

/**
 * Represents a component for withdrawing funds into a user's account.
 * @returns {JSX.Element} The withdraw component.
 */
export default function Withdraw() {
  const [show, setShow] = useState(false);
  const [withdraw, setWithdraw] = useState("");
  const [status, setStatus] = useState(
    "Please log in for managing your account balance"
  );
  const [userBalance, setUserBalance] = useState(null);
  const ctx = useContext(UserContext);

  /**
   * Fetches user balance and updates state when user logs in.
   */
  useEffect(() => {
    if (ctx.loggedUser) {
      if (status === "Please log in for managing your account balance") {
        setStatus("");
      }
      setShow(true);
      checkUserBalance();
    }
  }, [ctx.loggedUser, checkUserBalance]);

  const user = ctx.loggedUser;

  /**
   * Checks the user balance by requesting it from the API.
   */
  function checkUserBalance() {
    requestUserBalance(ctx.loggedUser.email).then((result) =>
      setUserBalance(result)
    );
  }

  /**
   * Clears the withdraw form.
   */
  function clearForm() {
    setWithdraw(0);
  }

  /**
   * Handles the withdraw action.
   */
  function handleWithdraw() {
    if (Number(userBalance) > Number(withdraw)) {
      balanceOperation(user.email, -parseInt(withdraw)).then(
        writeToDatabase(user.email, `Withdrawed $${withdraw}`)
      );
      clearForm();
    } else {
      setStatus("Error: insufficient funds!");
      setTimeout(() => setStatus(""), 5000);
    }
  }

  return (
    <Card
      bgcolor="warning"
      header="withdraw"
      status={status}
      body={
        show ? (
          <>
            <p style={{ width: "50%", float: "left" }}>Balance</p>
            <p style={{ width: "50%", float: "right" }}>
            {userBalance !== null ? `$${userBalance}` : "Loading..."}
            </p>
            Withdraw amount
            <input
              type="number"
              className="form-control"
              id="withdraw"
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
