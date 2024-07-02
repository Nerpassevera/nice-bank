import { useEffect, useContext, useState} from "react";
// import { UserContext } from "../index.js";
import "../../src/styles.css";
import { requestOperationHistory } from "../services/api.js";
import { UserContext } from "../index.jsx";

/**
 * Renders all data from the UserContext.
 * @returns {JSX.Element} The rendered component.
 */
export default function AllData() {
  const [data, setData] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:3001/account/all")
  //   .then(response => response.json())
  //   .then((data) => {
  //     setData(data);
  //   });
  // }, []);

  const content = [];
  const ctx = useContext(UserContext);

  // Iterate through each user in the UserContext
  for (const user of data) {

    content.push(
      <tr key={user._id}>
         <th scope="row">{user.name}</th>
         <td>{user.email}</td>
         <td>{user.password}</td>
         <td>{user.balance}</td>
       </tr>
    );
  }
  // let history = [];
  // console.log(requestOperationHistory(ctx.loggedUser.email))
  //   .then( response => {
  //     response.map( item => console.log("&&&   ", item))
  //     }
  //   );


  return (
    <>
      <h1>
        User profile <br />
      </h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Password</th>
            <th scope="col">Balance</th>
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>

      <h1>
        Operations history
        <br />
      </h1>
      {/* <table className="table">
        {history.map(element => {
          return <tbody>element</tbody>
        })}
      </table> */}

    </>
  );
}
