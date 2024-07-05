import { useEffect, useContext, useState } from "react";
import "../../src/styles.css";
import { requestOperationHistory, requestUserData } from "../services/api.js";
import { UserContext } from "../index.jsx";

export default function AllData() {
  const [userData, setUserData] = useState(null);
  const [operationHistory, setOperationHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const ctx = useContext(UserContext);

  useEffect(() => {
    async function loadDataFromDB() {
      requestUserData(ctx.loggedUser.email)
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
      return requestOperationHistory(ctx.loggedUser.email)
        .then((data) => {
          return data;
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }

    if (ctx.loggedUser) {
      loadDataFromDB()
        .then((data) => {
          setOperationHistory(
            data.map((item) => {
              return (
                <tr key={item._id}>
                  <td>{item.email}</td>
                  <td>{item.timeStamp}</td>
                  <td>{item.operation}</td>
                </tr>
              );
            })
          );
        })
        .then(setIsLoading(false));
    }
  }, [ctx.loggedUser]);

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
          {!isLoading && userData && (
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
        <tbody>{!isLoading && operationHistory && operationHistory}</tbody>
      </table>
    </>
  );
}
