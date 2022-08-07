import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import UsersBets from "./components/UsersBets";
import OpenBets from "./components/OpenBets";
import Header from "./components/Header";

function App({ contract, currentUser, nearConfig, wallet }) {
  const signIn = (e) => {
    e.preventDefault();
    wallet.requestSignIn(
      {
        contractId: nearConfig.contractName,
      },
      "Sports Marketplace"
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <BrowserRouter>
      <Header currentUser={currentUser} signIn={signIn} signOut={signOut} />
      <Routes>
        <Route
          exact
          path="/"
          element={<OpenBets currentUser={currentUser} contract={contract} />}
        />
        <Route
          exact
          path="/users_bets"
          element={<UsersBets currentUser={currentUser} contract={contract} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
