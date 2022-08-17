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
                "bg-gray-200 border border-separate border-blue-500"
              } px-2 py-1 rounded flex flex-col items-center justify-center w-48`}
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
          <div className="lg:mx-8 sm:mx-5">vs.</div>
          <div className="mx-2">
            <button
              className={`${
                marketMakerTeam === gameData.vTeamTriCode &&
                "bg-gray-200 border border-separate border-blue-500"
              } px-2 py-1 rounded flex flex-col items-center justify-center w-48`}
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
      <div className="pt-2 px-20 ">
        <h3 className="text-2xl py-1 text-black font-bold">
          Review your bet information:
        </h3>
        <p className="text-xl py-1 text-gray-500">
          1. The winner will get{" "}
          <span className="font-bold text-black">
            {payOutFromAmericanOdds(marketMakerDeposit, americanOdds)} N.
          </span>
        </p>
        <p className="text-xl py-1 text-gray-500">
          2. You are betting{" "}
          <span className="font-bold text-black">{marketMakerDeposit} N</span>{" "}
          on{" "}
          <span className="font-bold text-black">
            {getTeamFormatter(marketMakerTeam)}.
          </span>{" "}
          Your odds are{" "}
          <span className="font-bold text-black">+{americanOdds}.</span>
        </p>
        <p className="text-xl py-1 text-gray-500">
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
        <p className="text-xl py-1 text-gray-500">
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
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center ">
      <div className="bg-white p-2 rounded lg:w-1/2 lg:h-96 w-96 h-2/3 relative top-0">
        <GrClose
          className="float-right fill-red-500"
          onClick={() => onClose()}
        />
        <div className="border-b-2 pb-4 pt-2">
          <div className="uppercase tracking-wide text-xs font-bold text-gray-500 mb-1 leading-tight">
            Step {formStage} of 3
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div>
                <div className="text-lg font-bold text-gray-700 leading-tight">
                  {formStage === 1 && "Select your Team"}
                  {formStage === 2 && "Make your Bet"}
                  {formStage === 3 && "Review Bet"}
                </div>
              </div>
            </div>
            <div className="flex items-center w-72">
              <div className="w-full bg-gray-200 rounded-full mr-2">
                <div
                  className="rounded-full bg-blue-500 text-xs leading-none h-2 text-center text-white"
                  style={{ width: (formStage / 3) * 100 + "%" }}
                ></div>
              </div>
              <div className="text-xs w-10 text-gray-600">
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
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 border-solid border  block w-full sm:text-sm rounded-md pl-4 py-2"
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
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 border-solid border  block w-full sm:text-sm rounded-md pl-4 py-2"
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
        <div className="absolute bottom-0 inset-x-0 pb-5">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="w-1/2">
                {formStage !== 1 && (
                  <button
                    className="w-32 focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border"
                    onClick={() => handlePrevious()}
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="w-1/2 text-right">
                {formStage === 3 ? (
                  <button
                    className="w-32 focus:outline-none border border-transparent py-2 px-5 rounded-lg shadow-sm text-center text-white bg-blue-500 hover:bg-blue-600 font-medium"
                    onClick={() => handleSubmitBet()}
                  >
                    Complete
                  </button>
                ) : (
                  <button
                    className="w-32 focus:outline-none border border-transparent py-2 px-5 rounded-lg shadow-sm text-center text-white bg-blue-500 hover:bg-blue-600 font-medium"
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
