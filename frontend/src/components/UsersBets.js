import React, { useState, useEffect } from "react";
import * as nearAPI from "near-api-js";
import Big from "big.js";
const {
  utils: {
    format: { formatNearAmount, parseNearAmount },
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
const UsersBets = ({ contract, currentUser }) => {
  const [usersBets, setUsersBets] = useState([]);
  const [openBetsShown, setOpenBetsShown] = useState(true);

  useEffect(() => {
    const getBets = async () => {
      const allUsersBets = await contract.get_bets_by_account({
        lookup_account: currentUser.accountId,
      });

      setUsersBets(allUsersBets);
    };
    getBets();
  }, [contract, currentUser.accountId]);

  const handleCancelBet = async (betId) => {
    const newUsersBets = usersBets.filter((bet) => bet.id !== betId);
    setUsersBets(newUsersBets);
    await contract.cancel_bet({ id: betId });
  };

  const OpenBets = () => {
    return (
      <div className="h-56 grid grid-cols-1 md:grid-cols-3 gap-4 w-5/6">
        {usersBets
          .filter((bet) => bet.better_found === false)
          .map((bet) => (
            <div
              key={bet.id}
              className="grid grid-cols-6 rounded-md bg-gray-100 border-2 border-black align-center"
            >
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
                  onClick={() => handleCancelBet(bet.id)}
                >
                  Cancel Bet
                </button>
                <button className="mx-auto bg-green-700 px-2 rounded-md hover:bg-green-500">
                  Payout
                </button>
              </div>
            </div>
          ))}
      </div>
    );
  };

  const AcceptedBets = () => {
    return (
      <div className="h-56 grid grid-cols-1 md:grid-cols-3 gap-4 w-5/6">
        {usersBets
          .filter((bet) => bet.better_found === true)
          .map((bet) => (
            <div
              key={bet.id}
              className="grid grid-cols-6 rounded-md bg-gray-100 border-2 border-black align-center"
            >
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
                <button className="mx-auto bg-green-700 px-2 rounded-md hover:bg-green-500">
                  Cancel Bet
                </button>
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Your Bets</h1>
      <div className="flex flex-col-2 items-center">
        <button
          className="bg-gray-500 rounded px-1 mx-2"
          onClick={() => setOpenBetsShown(true)}
        >
          Open Bets
        </button>
        <button
          className="bg-gray-500 rounded px-1 mx-2"
          onClick={() => setOpenBetsShown(false)}
        >
          Accepted Bets
        </button>
      </div>
      <h1 className="my-5 text-lg">
        {openBetsShown ? "Open Bets" : "Accepted Bets"}{" "}
      </h1>
      {openBetsShown ? <OpenBets /> : <AcceptedBets />}
    </div>
  );
};

export default UsersBets;
