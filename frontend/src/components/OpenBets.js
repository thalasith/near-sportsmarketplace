import React, { useState, useEffect } from "react";
import IndividualBet from "./IndividualBet";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Big from "big.js";

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const OpenBets = ({ currentUser, contract }) => {
  const [openBets, setOpenBets] = useState([]);
  const [parent] = useAutoAnimate(/* optional config */);

  useEffect(() => {
    const getBets = async () => {
      const allOpenBets = await contract.get_all_open_bets();
      setOpenBets(allOpenBets);
    };
    getBets();
  }, [contract, currentUser]);

  const acceptBet = async (betId, deposit) => {
    try {
      await contract.accept_bet_index({ id: betId }, BOATLOAD_OF_GAS, deposit);
      const newOpenBets = openBets.filter((bet) => bet.id !== betId);
      setOpenBets(newOpenBets);
    } catch (error) {
      alert("You have to login first!");
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h1 className="pb-10 text-4xl font-bold">All Open Bets Below</h1>
      <div
        className="grid w-8/12 grid-cols-1 justify-center py-2 lg:w-3/4 lg:grid-cols-[repeat(auto-fit,_16.666666%)]"
        ref={parent}
      >
        {openBets.length === 0 && "No open bets on this game"}
        {openBets.length === 0 && "Nobody has agreed on a bet on this game."}
        {openBets.map((bet) => (
          <IndividualBet bet={bet} key={bet.id} acceptBet={acceptBet} />
        ))}
      </div>
    </div>
  );
};

export default OpenBets;
