import { useEffect, useContext, useState } from "react";
import "../../src/styles.css";
import { requestOperationHistory, requestUserData } from "../services/api.js";
import { UserContext } from "../index.jsx";

export default function AllData() {
  const [userData, setUserData] = useState(null);
  const [operationHistory, setOperationHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const ctx = useContext(UserContext);

  useEffect(() => {
    async function loadDataFromDB() {
      try {
        const userData = await requestUserData(ctx.loggedUser.email);
        setUserData(userData);

        const operationHistoryData = await requestOperationHistory(ctx.loggedUser.email);
        setOperationHistory(operationHistoryData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (ctx.loggedUser) {
      loadDataFromDB();
    }
  }, [ctx.loggedUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h1>
        User profile <br />
      </h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Account Number</th>
            <th scope="col">Email</th>
            <th scope="col">Balance</th>
          </tr>
        </thead>
        <tbody>
          {userData && (
            <tr key={userData._id}>
              <th scope="row">{userData.name}</th>
              <td>{userData.account_number}</td>
              <td>{userData.email}</td>
              <td>{userData.balance}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h1>
        Operations history
        <br />
      </h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Email</th>
            <th scope="col">Date and Time</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {operationHistory && operationHistory.map(item => (
            <tr key={item._id}>
              <td>{item.email}</td>
              <td>{item.timeStamp}</td>
              <td>{item.operation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}