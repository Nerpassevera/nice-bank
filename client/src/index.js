import { Route, Routes, HashRouter } from "react-router-dom";
import {createRoot} from 'react-dom/client';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import AllData from './components/AllData';
import CreateAccount from "./components/CreateAccount";
import Deposit from './components/Deposit';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Withdraw from './components/Withdraw';

export const UserContext = React.createContext(null);
export default function Spa() {
  // async function dataFetch(){
  //   const response = await fetch("http://localhost:3001/account/all");
  //   const info = await response.json();
  //   console.log(info);
  // };

  // dataFetch();


  return (
    <>
      <HashRouter>
        <UserContext.Provider
          value={{
            users: [
              {
                name: "abel",
                email: "abel@mit.edu",
                password: "secret",
                balance: 100,
              },
              {
                name: "mira",
                email: "mira@mit.edu",
                password: "secret1",
                balance: 200,
              },
              {
                name: "john",
                email: "john@mit.edu",
                password: "secret2",
                balance: 180,
              },
            ],
            loggedUser: undefined,
            history:[]
          }}
        >
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createaccount/" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/alldata" element={<AllData />} />
          </Routes>
        </UserContext.Provider>
      </HashRouter>
      {/* <p>{JSON.stringify(info)}</p> */}
    </>
  );
}


// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(<Spa />);

// import { createRoot } from 'react-dom/client';
// import React from "react";

// import Spa from './Spa'; // Assuming Spa is your main component

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Spa />);
} else {
  console.error("Root container not found.");
}

