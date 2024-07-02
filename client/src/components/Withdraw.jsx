import { useContext, useState, useEffect } from "react";
import Card from "../context.jsx";
import { UserContext } from "../index.jsx";
import { requestUserBalance, balanceOperation, writeToDatabase } from "../services/api.js";

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
  // console.log("🚀 ~ withdraw ~ ctx.loggedUser.email:", user.email);
  // console.log("type of userBalance", typeof userBalance);

  function checkUserBalance() {
    requestUserBalance(ctx.loggedUser.email).then((result) =>
      setUserBalance(result));
  }

  /**
   * Validates the user and shows the withdraw form if the user is logged in.
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
   * Clears the withdraw form.
   */
  function clearForm() {
    setWithdraw(0);
  }

  /**
   * Handles the withdraw action.
   */
  function handleWithdraw() {
    balanceOperation(user.email, -parseInt(withdraw))
      .then(writeToDatabase(user.email, `withdrawed $${withdraw}`));
    clearForm();
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
              ${ctx.loggedUser ? userBalance : NaN}
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
