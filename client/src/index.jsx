import { Route, Routes, HashRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { createContext, useState, useEffect } from "react";
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

// Create a UserContext to manage the user state throughout the app
export const UserContext = createContext("");

/**
 * Main component representing the single page application (SPA).
 * @returns {JSX.Element} The main SPA component.
 */
export default function Spa() {
  const [loggedUser, setLoggedUser] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize Firebase authentication
  const auth = getAuth();

  // Use effect to handle user authentication state changes
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
