import { useEffect, useContext, useState } from "react";
import "../../src/styles.css";
import { requestOperationHistory, requestUserData } from "../services/api.js";
import { UserContext } from "../index.jsx";

export default function AllData() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const ctx = useContext(UserContext);

  useEffect(() => {
    if (ctx.loggedUser) {
      requestUserData(ctx.loggedUser.email)
        .then(data => {
          setUserData(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          setIsLoading(false);
        });
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
        {/* Здесь можно добавить логику для отображения истории операций */}
      </table>
    </>
  );
}