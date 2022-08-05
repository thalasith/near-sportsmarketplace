import React, { useState, useEffect } from "react";
import * as nearAPI from "near-api-js";
import Big from "big.js";
const {
  utils: {
    format: { formatNearAmount },
  },
} = nearAPI;
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return (
    date.getMonth() +
    1 +
    "/" +
    date.getDate() +
    "/" +
    date.getFullYear() +
    "  " +
    strTime
  );
};

const OpenBets = ({ currentUser, contract }) => {
  const [openBets, setOpenBets] = useState([]);
  console.log(openBets);

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
      // console.log("error", error);
      alert("You have to login first!");
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl">Open Bets</h1>

      <div className="h-56 grid grid-cols-1 md:grid-cols-3 gap-4 w-5/6">
        {openBets.map((bet) => (
          <div className="grid grid-cols-6 rounded-md bg-gray-100 border-2 border-black align-center">
            <div className=" flex flex-col col-span-6 mx-auto pt-2">
              <p className="mx-auto">
                Bet:{" "}
                <span className="font-bold italic underline">
                  {" "}
                  {formatNearAmount(bet.better_deposit, 2)} NEAR
                </span>{" "}
                on {bet.bidder_team}
              </p>
            </div>
            <div className="col-span-6 mx-auto">
              <h1 className="text-sm">
                Tip Off: {formatDate(bet.start_time_utc)}
              </h1>
            </div>
            <div className="flex flex-col col-span-3 mx-auto">
              <img
                src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${bet.bidder_team.toLowerCase()}.png`}
                width="75"
              />
              <p className="mx-auto">{bet.bidder_team}</p>
            </div>
            <div className="flex flex-col col-span-3 mx-auto">
              <img
                src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${bet.market_maker_team.toLowerCase()}.png`}
                width="75"
              />
              <p className="mx-auto ">{bet.market_maker_team}</p>
            </div>

            <div className="flex flex-col col-span-3 mx-auto">
              <p className="mx-auto"> Total Pot </p>
              <p className="mx-auto">
                {formatNearAmount(
                  (
                    parseInt(bet.better_deposit) +
                    parseInt(bet.market_maker_deposit)
                  ).toLocaleString("en-US", {
                    useGrouping: false,
                  }),
                  2
                )}
                N
              </p>
            </div>
            <div className="flex flex-col col-span-3 mx-auto">
              <p className="mx-auto"> % Return </p>
              <p className="mx-auto">
                {Math.round(
                  ((parseInt(bet.better_deposit) +
                    parseInt(bet.market_maker_deposit)) /
                    parseInt(bet.better_deposit) -
                    1) *
                    100,
                  2
                )}{" "}
                %
              </p>
            </div>
            <div className="col-span-6 mx-auto mb-2">
              <button
                className="mx-auto bg-green-700 px-2 rounded-md hover:bg-green-500"
                onClick={() => acceptBet(bet.id, bet.better_deposit)}
              >
                {" "}
                Accept{" "}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenBets;
