import React, { useState, useEffect } from "react";
import IndividualBet from "./IndividualBet";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Big from "big.js";

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const UsersBets = ({ contract, currentUser }) => {
  const [usersBets, setUsersBets] = useState([]);
  const [shownBets, setShownBets] = useState([]);
  const [shownState, setShownState] = useState("Open Bets");
  const [parent] = useAutoAnimate(/* optional config */);

  const handleStateChange = (state) => {
    if (state === "Open Bets") {
      setShownBets(usersBets.filter((bet) => bet.better_found === false));
      setShownState(state);
    } else if (state === "Accepted Bets") {
      setShownBets(usersBets.filter((bet) => bet.better_found === true));
      setShownState(state);
    } else if (state === "Completed Bets") {
      setShownBets(usersBets.filter((bet) => bet.paid_out === true));
      setShownState(state);
    }
  };

  useEffect(() => {
    const getBets = async () => {
      const allUsersBets = await contract.get_bets_by_account({
        lookup_account: currentUser.accountId,
      });
      console.log("test", allUsersBets);

      setUsersBets(allUsersBets);
    };
    getBets();
  }, [contract]);

  const cancelBet = async (betId) => {
    const newUsersBets = usersBets.filter((bet) => bet.id !== betId);
    setUsersBets(newUsersBets);
    await contract.cancel_bet({ id: betId });
  };

  const acceptBet = async (betId, deposit) => {
    try {
      await contract.accept_bet_index({ id: betId }, BOATLOAD_OF_GAS, deposit);
      const newUsersBets = usersBets.filter((bet) => bet.id !== betId);
      setUsersBets(newUsersBets);
    } catch (error) {
      alert("You have to login first!");
    }
  };

  const LoggedIn = () => {
    return (
      <div className="flex flex-col items-center">
        <h1 className="pb-10 text-4xl font-bold">
          Here are all your bets below.
        </h1>
        <div className="flex w-11/12 flex-row lg:w-7/12">
          <button
            className={`w-1/3 bg-gray-200 text-center ${
              shownState === "Open Bets" && "bg-blue-500 text-white"
            }`}
            onClick={() => handleStateChange("Open Bets")}
          >
            Open Bets
          </button>
          <button
            className={`w-1/3 bg-gray-200 text-center ${
              shownState === "Accepted Bets" && "bg-blue-500 text-white"
            }`}
            onClick={() => handleStateChange("Accepted Bets")}
          >
            Accepted Bets
          </button>
          <button
            className={`w-1/3 bg-gray-200 text-center ${
              shownState === "Completed Bets" && "bg-blue-500 text-white"
            }`}
            onClick={() => handleStateChange("Completed Bets")}
          >
            Completed Bets
          </button>
        </div>
        <div
          className="grid w-8/12 grid-cols-1 justify-center py-2 lg:w-3/4 lg:grid-cols-[repeat(auto-fit,_16.666666%)]"
          ref={parent}
        >
          {shownBets.length === 0 && "Nothing to show here."}
          {shownBets.map((bet) => (
            <IndividualBet
              bet={bet}
              key={bet.id}
              acceptBet={acceptBet}
              cancelBet={cancelBet}
            />
          ))}
        </div>
      </div>
    );
  };

  const NotLoggedIn = () => {
    return (
      <div className="flex flex-col items-center">
        <h1 className="pb-10 text-4xl font-bold">Please login.</h1>
      </div>
    );
  };

  return currentUser ? <LoggedIn /> : <NotLoggedIn />;
};

export default UsersBets;
