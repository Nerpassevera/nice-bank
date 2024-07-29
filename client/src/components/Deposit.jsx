import { useContext, useState, useEffect, useCallback } from "react";
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
  const [status, setStatus] = useState("Please log in for managing your account balance");
  const [userBalance, setUserBalance] = useState(null);
  const ctx = useContext(UserContext);

  const user = ctx.loggedUser;

  const checkUserBalance = useCallback(async () => {
    if (user) {
      try {
        const balance = await requestUserBalance(user.email);
        setUserBalance(balance);
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    }
  }, [user]);

  useEffect(() => {
    if (ctx.loggedUser) {
      setStatus("");
      setShow(true);
      checkUserBalance();
    }
  }, [ctx.loggedUser, checkUserBalance]);

  /**
   * Clears the deposit form.
   */
  function clearForm() {
    setDeposit("");
  }

  /**
   * Handles the deposit action.
   */
  async function handleDeposit() {
    try {
      await balanceOperation(user.email, parseInt(deposit));
      await writeToDatabase(user.email, `Deposited $${deposit}`);
      await checkUserBalance(); // Update balance after deposit
      clearForm();
    } catch (error) {
      console.error("Error during deposit operation:", error);
    }
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
              {userBalance !== null ? `$${userBalance}` : "Loading..."}
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