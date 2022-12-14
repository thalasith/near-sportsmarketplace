import React from "react";
import { americanOddsCalculator, formatDate } from "../utils/formating";
import * as nearAPI from "near-api-js";

const {
  utils: {
    format: { formatNearAmount },
  },
} = nearAPI;

const IndividualBet = ({
  bet,
  acceptBet,
  cancelBet,
  payoutBet,
  currentUser,
  hTeam,
  vTeam,
}) => {
  const startTimeUtc = new Date(bet.start_time_utc);

  return (
    <div
      key={bet.id}
      className="m-auto my-2 w-full rounded-md border-2 border-gray-300 bg-gray-200 px-2 lg:col-span-2 lg:w-2/3"
    >
      <div className="flex border-separate flex-col items-center justify-between border border-b-2 border-t-0 border-l-0 border-r-0 border-gray-700">
        <p>
          <span
            className={`${
              bet.better_team === vTeam
                ? "font-bold text-black"
                : "text-gray-700"
            }`}
          >
            {vTeam}
          </span>{" "}
          vs{" "}
          <span
            className={`${
              bet.better_team === hTeam
                ? "font-bold text-black"
                : "text-gray-700"
            }`}
          >
            {hTeam}
          </span>
        </p>
        <p>Tip Off: {formatDate(startTimeUtc)}</p>
        <img
          src={`/teams/${bet.better_team.toLocaleLowerCase()}.png`}
          alt={`${bet.better_team} Team Logo`}
          width="75"
          className=""
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-2 text-gray-700">
        <div className="flex flex-col pl-3 text-start">
          <p className="">Odds</p>
          <p className="font-bold text-black">
            {americanOddsCalculator(
              parseInt(bet.better_deposit),
              parseInt(bet.better_deposit) + parseInt(bet.market_maker_deposit)
            )}{" "}
            on {bet.better_team}
          </p>
        </div>
        <div className="flex flex-col pb-3 pr-3 text-end">
          <p className="">Total Pot</p>
          <p className="font-bold text-black">
            {formatNearAmount(
              (
                parseInt(bet.better_deposit) +
                parseInt(bet.market_maker_deposit)
              ).toLocaleString("en-US", {
                useGrouping: false,
              }),
              2
            )}{" "}
            N
          </p>
        </div>

        {bet.better_found === false && (
          <div className="flex flex-col py-2 text-start">
            <p className="pt-1">
              You pay:{" "}
              <span className="font-bold text-black">
                {Math.round(formatNearAmount(bet.better_deposit) * 100) / 100} N
              </span>
            </p>
          </div>
        )}
        {bet.better_found === false && (
          <div className="flex flex-col text-start">
            <button
              className={
                "m-1 flex flex-col items-center justify-center rounded bg-blue-500 py-2 text-white hover:bg-blue-700"
              }
              onClick={() => acceptBet(bet.id, bet.better_deposit)}
            >
              Accept Bet
            </button>
          </div>
        )}
        {cancelBet && bet.better_found === false && (
          <div className="flex flex-col text-start">
            <button
              className={
                "m-1 rounded border bg-white py-2 text-center text-gray-600 shadow-sm hover:bg-gray-100 focus:outline-none"
              }
              onClick={() => cancelBet(bet.id)}
            >
              Cancel Bet
            </button>
          </div>
        )}
        {cancelBet && bet.better_found === false && (
          <div className="flex flex-col text-start">
            <button
              className={
                "m-1 rounded bg-blue-500 py-2 text-center text-white hover:bg-blue-700"
              }
              onClick={() => acceptBet(bet.id, bet.better_deposit)}
            >
              Accept Bet
            </button>
          </div>
        )}
        {bet.paid_out === false && bet.better_found === true && (
          <div className="flex flex-col">
            <button
              className={
                "m-1 rounded bg-blue-500 py-2 text-center text-white hover:bg-blue-700"
              }
              onClick={() => payoutBet(bet.game_id, bet.game_date, bet.id)}
            >
              Payout Bet
            </button>
          </div>
        )}
        {bet.paid_out === true && bet.better_found === true && (
          <div className="col-span-2">
            <p
              className={`m-1 rounded py-2 text-center text-white ${
                bet.winner === currentUser.accountId
                  ? "bg-green-700"
                  : "bg-red-700"
              }`}
              onClick={() => payoutBet(bet.game_id, bet.game_date, bet.id)}
            >
              {bet.winner === currentUser.accountId
                ? "You won this bet!"
                : "You lost this bet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndividualBet;
