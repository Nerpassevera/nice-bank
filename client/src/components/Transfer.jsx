import { useContext, useState, useEffect } from "react";
import Card from "../context.jsx";
import { UserContext } from "../index.jsx";
import {
  requestUserBalance,
  balanceOperation,
  writeToDatabase,
  requestRecipient,
} from "../services/api.js";

/**
 * Represents a component for transfering funds into a user's account.
 * @returns {JSX.Element} The transfer component.
 */
export default function Transfer() {
  const [show, setShow] = useState(false);
  const [transfer, setTransfer] = useState("");
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState(
    "Please log in for managing your account balance"
  );
  const [userBalance, setUserBalance] = useState("");
  const [alertShow, setAlertShow] = useState(false);
  const ctx = useContext(UserContext);

  useEffect(() => {
    if (ctx.loggedUser) {
      if (ctx.loggedUser) {
        if (status === "Please log in for managing your account balance"){
          setStatus("");
        };
      }
      setShow(true);
      checkUserBalance();
    }
  }, [ctx.loggedUser, checkUserBalance]);

  const user = ctx.loggedUser;

  function checkUserBalance() {
    requestUserBalance(ctx.loggedUser.email).then((result) =>
      setUserBalance(result)
    );
  }

  /**
   * Clears the transfer form.
   */
  function clearForm() {
    setTransfer(0);
    setRecipient("");
  }

  function errorMsgTimer(label) {
    setStatus("Error: " + label);
    setTimeout(() => setStatus(""), 5000);
  }

  /**
   * Handles the transfer action.
   */
  async function handleTransfer() {
    if (Number(userBalance) > Number(transfer)) {
      await requestRecipient(recipient).then((userExist) => {
        console.log("user exist: ", userExist);
        if (userExist) {
          balanceOperation(user.email, -parseInt(transfer));
          balanceOperation(recipient, parseInt(transfer));
          writeToDatabase(
            user.email,
            `Transfered $${transfer} to account ${recipient}`
          );
          writeToDatabase(
            recipient,
            `$${transfer} were transferred from account ${user.email}`
          );
          clearForm();
          setAlertShow(true);
          setTimeout(() => {
            setAlertShow(false);
          }, 5000);
        } else {
          errorMsgTimer(
            "The user you are trying to transfer funds to doesn't have an account in our bank."
          );
        }
      });
    } else {
      setStatus("Error: insufficient funds!");
      setTimeout(() => setStatus(""), 5000);
    }
  }

  return (
    <>
      <Card
        bgcolor="info"
        header="Transfer"
        status={status}
        body={
          show ? (
            <>
              Recipient's email
              <br />
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                aria-describedby="emailHelp"
                value={recipient}
                onChange={(e) => setRecipient(e.currentTarget.value)}
              />
              <br />
              <p style={{ width: "50%", float: "left" }}>Balance</p>
              <p style={{ width: "50%", float: "right" }}>
                ${ctx.loggedUser ? userBalance : NaN}
              </p>
              Transfer amount
              <input
                type="number"
                className="form-control"
                id="transfer"
                placeholder="Enter transfer amount"
                value={transfer}
                min={0}
                onChange={(e) => setTransfer(e.currentTarget.value)}
              />
              <br />
              <button
                type="submit"
                className="btn btn-light"
                disabled={transfer <= 0}
                onClick={handleTransfer}
              >
                Transfer
              </button>
            </>
          ) : (
            <>
              <h5>Important!</h5>
            </>
          )
        }
      />
      {alertShow ? (
        <div
          className="alert alert-info alert-dismissible fade show"
          role="alert"
        >
          Funds have been transferred successfully!
        </div>
      ) : null}
    </>
  );
}
