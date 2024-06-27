import { Route, Routes, HashRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { StrictMode, createContext, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import AllData from "./components/AllData";
import CreateAccount from "./components/CreateAccount";
import Deposit from "./components/Deposit";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Withdraw from "./components/Withdraw";

export const UserContext = createContext('');

export default function Spa() {
  const [ loggedUser,  setLoggedUser ] = useState('');
  
  
  return (
    <>
    {/* <StrictMode> */}

      <HashRouter>
        <UserContext.Provider
          value={{ loggedUser, setLoggedUser }}
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
      {/* </StrictMode> */}

    </>
  );
}

// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(<Spa />);

// import { createRoot } from 'react-dom/client';
// import React from "react";

// import Spa from './Spa'; // Assuming Spa is your main component

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<Spa />);
} else {
  console.error("Root container not found.");
}
