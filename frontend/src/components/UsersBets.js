import React, { useState, useEffect } from "react";
import IndividualBet from "./IndividualBet";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Big from "big.js";
import * as nearAPI from "near-api-js";

const {
  utils: {
    format: { formatNearAmount },
  },
} = nearAPI;

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const UsersBets = ({ contract, currentUser }) => {
  const [usersBets, setUsersBets] = useState([]);
  const [shownBets, setShownBets] = useState([]);
  const [shownState, setShownState] = useState("Open Bets");
  const [parent] = useAutoAnimate(/* optional config */);
  const [userTotalWins, setUserTotalWins] = useState(0);
  const [usersTotalBets, setUsersTotalBets] = useState(0);
  const [userAmountWon, setUserAmountWon] = useState(0);

  const handleStateChange = (state) => {
    if (state === "Open Bets") {
      setShownBets(usersBets.filter((bet) => bet.better_found === false));
      setShownState(state);
    } else if (state === "Accepted Bets") {
      setShownBets(
        usersBets.filter(
          (bet) => bet.better_found === true && bet.paid_out === false
        )
      );
      setShownState(state);
    } else if (state === "Completed Bets") {
      setShownBets(
        usersBets.filter(
          (bet) => bet.paid_out === true && bet.paid_out === true
        )
      );
      setShownState(state);
    }
  };

  useEffect(() => {
    const getBets = async () => {
      const allUsersBets = await contract.get_bets_by_account({
        lookup_account: currentUser.accountId,
      });

      const completedUsersBets = allUsersBets.filter(
        (bet) => bet.paid_out === true && bet.paid_out === true
      );

      const winAmount = completedUsersBets.reduce((sum, bet) => {
        return bet.winner === currentUser.accountId
          ? sum +
              parseInt(bet.better_deposit) +
              parseInt(bet.market_maker_deposit)
          : sum;
      }, 0);

      const wins = completedUsersBets.filter(
        (bet) => bet.winner === currentUser.accountId
      ).length;

      const totalBets = completedUsersBets.length;
      setUserTotalWins(wins);
      setUsersTotalBets(totalBets);
      setUserAmountWon(winAmount);

      console.log(
        formatNearAmount(
          winAmount.toLocaleString("en-US", {
            useGrouping: false,
          })
        ),
        wins,
        totalBets
      );

      setUsersBets(allUsersBets);
    };
    getBets();
  }, [contract, currentUser.accountId]);

  const cancelBet = async (betId) => {
    const newUsersBets = usersBets.filter((bet) => bet.id !== betId);
    setUsersBets(newUsersBets);
    await contract.cancel_bet({ id: betId });
  };

  const payoutBet = async (gameId, gameDate, betId) => {
    const data = await fetch(
      `https://data.nba.net/10s/prod/v1/${gameDate}/${gameId}_mini_boxscore.json`
    )
      .then((res) => res.json())
      .then((data) => data.basicGameData);
    const winningTeam =
      parseInt(data.hTeam.score) > parseInt(data.vTeam.score)
        ? data.hTeam.triCode
        : data.vTeam.triCode;

    await contract.payout_bet({
      id: betId,
      winning_team: winningTeam,
      status_num: data.statusNum,
    });
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
        <div className="flex w-4/12 flex-col items-center lg:w-6/12">
          <h2 className="pb-2 text-2xl font-semibold">Your Bet Statistics</h2>
          <div className="flex flex-row items-center">
            <div className="mx-1 border-separate rounded-lg border-2 border-blue-500 px-4">
              <h3 className="text-xl font-semibold">
                Your Winning Percentage:
              </h3>
              <h1 className="pb-2 text-center text-6xl font-bold">
                {" "}
                {100 * (userTotalWins / usersTotalBets)}%
              </h1>
            </div>
            <div className="mx-1 border-separate rounded-lg border-2 border-blue-500 px-4">
              <h3 className="text-xl font-semibold">Your Total Wins:</h3>
              <h1 className="pb-2 text-center text-6xl font-bold">
                {" "}
                {formatNearAmount(
                  userAmountWon.toLocaleString("en-US", {
                    useGrouping: false,
                  }),
                  2
                )}
                {" N"}
              </h1>
            </div>
          </div>
        </div>
        <h1 className="py-5 text-4xl font-bold">
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
              payoutBet={payoutBet}
              currentUser={currentUser}
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
