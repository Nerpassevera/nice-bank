import { Route, Routes, HashRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { StrictMode, createContext, useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";


import AllData from "./components/AllData";
import CreateAccount from "./components/CreateAccount";
import Deposit from "./components/Deposit";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Withdraw from "./components/Withdraw";
import Transfer from "./components/Transfer";

export const UserContext = createContext('');

export default function Spa() {
  const [ loggedUser,  setLoggedUser ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const auth = getAuth();
  
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedUser(user);
        setLoading(false);
      } else {
        setLoggedUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, loggedUser]);
  return (
    <>
    {/* <StrictMode> */}

      <HashRouter>
        <UserContext.Provider
          value={{ loggedUser, setLoggedUser, loading, setLoading }}
        >
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createaccount/" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/alldata" element={<AllData />} />
          </Routes>
        </UserContext.Provider>
      </HashRouter>
      {/* </StrictMode> */}

    </>
  );
}


const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<Spa />);
} else {
  console.error("Root container not found.");
}
