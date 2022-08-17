import React, { useState } from "react";
import { GrClose } from "react-icons/gr";
import * as nearAPI from "near-api-js";
import Big from "big.js";
import getTeamFormatter from "../utils/getTeamFormatter";
const {
  utils: {
    format: { parseNearAmount },
  },
} = nearAPI;
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

function americanOddsCalculator(amount, total) {
  if (total / amount - 1 >= 2) {
    return (
      "+" +
      ((total / amount - 1) * 100).toLocaleString("en-US", {
        useGrouping: false,
      })
    );
  } else {
    return (
      "-" +
      (100 / (total / amount - 1)).toLocaleString("en-US", {
        useGrouping: false,
      })
    );
  }
}

// TO DO: look at this again (need more structure in the restrictions i.e. nothing between -100 and 100)
function payOutFromAmericanOdds(amount, odds) {
  if (odds > 0) {
    return (odds / 100 + 1) * amount;
  } else {
    return (100 / -odds + 1) * amount;
  }
}

const GameBetsModal = ({ visible, onClose, contract, gameData }) => {
  const [marketMakerDeposit, setMarketMakerDeposit] = useState(5);
  const [americanOdds, setAmericanOdds] = useState(100);
  const [marketMakerTeam, setMarketMakerTeam] = useState(gameData.hTeamTriCode);
  const [bidderTeam, setBidderTeam] = useState(gameData.vTeamTriCode);
  const [formStage, setFormStage] = useState(1);

  const handleTeamSelection = (team) => {
    if (team === gameData.hTeamTriCode) {
      setMarketMakerTeam(gameData.hTeamTriCode);
      setBidderTeam(gameData.vTeamTriCode);
    } else {
      setMarketMakerTeam(gameData.vTeamTriCode);
      setBidderTeam(gameData.hTeamTriCode);
    }
  };

  const handleSubmitBet = async () => {
    const bettorAmount =
      payOutFromAmericanOdds(marketMakerDeposit, americanOdds) -
      marketMakerDeposit;
    const bet = {
      better_amount: parseNearAmount(bettorAmount.toLocaleString()),
      game_id: gameData.gameId,
      game_date: gameData.gameDate,
      market_maker_team: marketMakerTeam,
      bidder_team: bidderTeam,
      start_time_utc: gameData.startTimeUTC,
    };

    await contract.create_bet(
      bet,
      BOATLOAD_OF_GAS,
      parseNearAmount(marketMakerDeposit.toLocaleString())
    );
  };

  // Stage === 1
  const TeamSelection = () => {
    return (
      <div className="py-5">
        <div className="flex flex-row items-center justify-center">
          <div className="mx-2">
            <button
              className={`${
                marketMakerTeam === gameData.hTeamTriCode &&
                "border-separate border border-blue-500 bg-gray-200"
              } flex w-48 flex-col items-center justify-center rounded px-2 py-1`}
              onClick={() => handleTeamSelection(gameData.hTeamTriCode)}
            >
              <img
                src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${gameData.hTeamTriCode.toLowerCase()}.png`}
                alt={`${gameData.hTeamTriCode} Team Logo`}
                width="100"
                className="float-left"
              />
              <p className="text-center">
                {getTeamFormatter(gameData.hTeamTriCode)}
              </p>
            </button>
          </div>
          <div className="sm:mx-5 lg:mx-8">vs.</div>
          <div className="mx-2">
            <button
              className={`${
                marketMakerTeam === gameData.vTeamTriCode &&
                "border-separate border border-blue-500 bg-gray-200"
              } flex w-48 flex-col items-center justify-center rounded px-2 py-1`}
              onClick={() => handleTeamSelection(gameData.vTeamTriCode)}
            >
              <img
                src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${gameData.vTeamTriCode.toLowerCase()}.png`}
                alt={`${gameData.vTeamTriCode} Team Logo`}
                width="100"
                className="float-left"
              />
              <div className="text-center">
                {getTeamFormatter(gameData.vTeamTriCode)}
              </div>
            </button>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center pt-2 text-lg font-bold text-gray-500">
          {marketMakerTeam &&
            `You selected the ${getTeamFormatter(marketMakerTeam)} to win.`}
        </div>
      </div>
    );
  };

  // Stage === 3
  const ReviewSelection = () => {
    return (
      <div className="px-20 pt-2 ">
        <h3 className="py-1 text-2xl font-bold text-black">
          Review your bet information:
        </h3>
        <p className="py-1 text-xl text-gray-500">
          1. The winner will get{" "}
          <span className="font-bold text-black">
            {payOutFromAmericanOdds(marketMakerDeposit, americanOdds)} N.
          </span>
        </p>
        <p className="py-1 text-xl text-gray-500">
          2. You are betting{" "}
          <span className="font-bold text-black">{marketMakerDeposit} N</span>{" "}
          on{" "}
          <span className="font-bold text-black">
            {getTeamFormatter(marketMakerTeam)}.
          </span>{" "}
          Your odds are{" "}
          <span className="font-bold text-black">+{americanOdds}.</span>
        </p>
        <p className="py-1 text-xl text-gray-500">
          3. Your opponent will be betting{" "}
          <span className="font-bold text-black">
            {payOutFromAmericanOdds(marketMakerDeposit, americanOdds) -
              marketMakerDeposit}{" "}
            N
          </span>{" "}
          on{" "}
          <span className="font-bold text-black">
            {getTeamFormatter(bidderTeam)}
          </span>
          . Their odds are{" "}
          <span className="font-bold text-black">
            {americanOddsCalculator(
              payOutFromAmericanOdds(marketMakerDeposit, americanOdds) -
                marketMakerDeposit,
              payOutFromAmericanOdds(marketMakerDeposit, americanOdds)
            )}
          </span>
          .
        </p>
        <p className="py-1 text-xl text-gray-500">
          4. If an opponent is found, you have{" "}
          <span className="font-bold text-black">2 hours</span> before tip-off
          to cancel the bet.
        </p>
      </div>
    );
  };

  const handleNext = () => {
    if (formStage >= 1 && formStage < 3) {
      setFormStage(formStage + 1);
    }
  };

  const handlePrevious = () => {
    if (formStage >= 2) {
      setFormStage(formStage - 1);
    }
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm ">
      <div className="relative top-0 h-2/3 w-96 rounded bg-white p-2 lg:h-96 lg:w-1/2">
        <GrClose
          className="float-right fill-red-500"
          onClick={() => onClose()}
        />
        <div className="border-b-2 pb-4 pt-2">
          <div className="mb-1 text-xs font-bold uppercase leading-tight tracking-wide text-gray-500">
            Step {formStage} of 3
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div>
                <div className="text-lg font-bold leading-tight text-gray-700">
                  {formStage === 1 && "Select your Team"}
                  {formStage === 2 && "Make your Bet"}
                  {formStage === 3 && "Review Bet"}
                </div>
              </div>
            </div>
            <div className="flex w-72 items-center">
              <div className="mr-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500 text-center text-xs leading-none text-white"
                  style={{ width: (formStage / 3) * 100 + "%" }}
                ></div>
              </div>
              <div className="w-10 text-xs text-gray-600">
                {Math.round((100 * formStage) / 3)}%
              </div>
            </div>
          </div>
        </div>

        {formStage === 1 && <TeamSelection />}
        {formStage === 2 && (
          <div className="py-5">
            <div className="flex flex-row items-center justify-center">
              <div className="py-2">
                <label
                  htmlFor="marketMakerTeam"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount you are betting on {marketMakerTeam}
                </label>
                <div className="py-2">
                  <input
                    type="number"
                    name="marketMakerDeposit"
                    id="marketMakerDeposit"
                    className="block w-full rounded-md border border-solid border-gray-300  py-2 pl-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Amount you will bet"
                    onChange={(e) => setMarketMakerDeposit(e.target.value)}
                    value={marketMakerDeposit}
                  />
                </div>
                <label
                  htmlFor="marketMakerTeam"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your betting odds on {marketMakerTeam}
                </label>
                <div className="py-2">
                  <input
                    className="block w-full rounded-md border border-solid border-gray-300  py-2 pl-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    type="number"
                    name="marketMakerDeposit"
                    onChange={(e) => setAmericanOdds(e.target.value)}
                    value={americanOdds}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {formStage === 3 && <ReviewSelection />}
        <div className="absolute inset-x-0 bottom-0 pb-5">
          <div className="mx-auto max-w-3xl px-4">
            <div className="flex justify-between">
              <div className="w-1/2">
                {formStage !== 1 && (
                  <button
                    className="w-32 rounded-lg border bg-white py-2 px-5 text-center font-medium text-gray-600 shadow-sm hover:bg-gray-100 focus:outline-none"
                    onClick={() => handlePrevious()}
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="w-1/2 text-right">
                {formStage === 3 ? (
                  <button
                    className="w-32 rounded-lg border border-transparent bg-blue-500 py-2 px-5 text-center font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none"
                    onClick={() => handleSubmitBet()}
                  >
                    Complete
                  </button>
                ) : (
                  <button
                    className="w-32 rounded-lg border border-transparent bg-blue-500 py-2 px-5 text-center font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none"
                    onClick={() => handleNext()}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBetsModal;
