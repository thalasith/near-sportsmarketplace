import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import UsersBets from "./components/UsersBets";
import OpenBets from "./components/OpenBets";
import Home from "./components/Home";
import Header from "./components/Header";
import Games from "./components/Games";
import GameBets from "./components/GameBets";

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
        <Route path="/" element={<Home />} />
        <Route
          exact
          path="/games"
          element={<Games currentUser={currentUser} contract={contract} />}
        />
        <Route
          exact
          path="/open_bets"
          element={<OpenBets currentUser={currentUser} contract={contract} />}
        />
        <Route
          exact
          path="/users_bets"
          element={<UsersBets currentUser={currentUser} contract={contract} />}
        />
        <Route
          path="games/:gameDate/:gameId"
          element={<GameBets currentUser={currentUser} contract={contract} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
