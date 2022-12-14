import React, { useState } from "react";
import { GrClose } from "react-icons/gr";
import * as nearAPI from "near-api-js";
import Big from "big.js";
import getTeamFormatter from "../utils/getTeamFormatter";
import {
  americanOddsCalculator,
  payOutFromAmericanOdds,
} from "../utils/formating";
const {
  utils: {
    format: { parseNearAmount },
  },
} = nearAPI;
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const GameBetsModal = ({ visible, onClose, contract, gameData }) => {
  const [marketMakerDeposit, setMarketMakerDeposit] = useState(0);
  const [americanOdds, setAmericanOdds] = useState(0);
  const [marketMakerTeam, setMarketMakerTeam] = useState("");
  const [betterTeam, setBetterTeam] = useState("");
  const [formStage, setFormStage] = useState(1);
  const [validationErrors, setValidationErrors] = useState({
    noTeamSelected: "",
    negativeBettingAmount: "",
    wrongBettingOdds: "",
  });

  const handleTeamSelection = (team) => {
    if (team === gameData.hTeamTriCode) {
      setMarketMakerTeam(gameData.hTeamTriCode);
      setBetterTeam(gameData.vTeamTriCode);
      setValidationErrors({ ...validationErrors, noTeamSelected: "" });
    } else {
      setMarketMakerTeam(gameData.vTeamTriCode);
      setBetterTeam(gameData.hTeamTriCode);
      setValidationErrors({ ...validationErrors, noTeamSelected: "" });
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
      better_team: betterTeam,
      start_time_utc: gameData.startTimeUTC,
      game_url_code: gameData.gameUrlCode,
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
                marketMakerTeam === gameData.vTeamTriCode &&
                "border-separate border border-blue-500 bg-gray-200"
              } flex w-36 flex-col items-center justify-center rounded px-2 py-1 lg:w-48`}
              onClick={() => handleTeamSelection(gameData.vTeamTriCode)}
            >
              <img
                src={`/teams/${gameData.vTeamTriCode.toLowerCase()}.png`}
                alt={`${gameData.vTeamTriCode} Team Logo`}
                width="100"
                className="float-left"
              />
              <p className="text-center">
                {getTeamFormatter(gameData.vTeamTriCode)}
              </p>
            </button>
          </div>
          <div className="sm:mx-5 lg:mx-8">vs.</div>
          <div className="mx-2">
            <button
              className={`${
                marketMakerTeam === gameData.hTeamTriCode &&
                "border-separate border border-blue-500 bg-gray-200"
              } flex w-36 flex-col items-center justify-center rounded px-2 py-1 lg:w-48`}
              onClick={() => handleTeamSelection(gameData.hTeamTriCode)}
            >
              <img
                src={`/teams/${gameData.hTeamTriCode.toLowerCase()}.png`}
                alt={`${gameData.hTeamTriCode} Team Logo`}
                width="100"
                className="float-left"
              />
              <div className="text-center">
                {getTeamFormatter(gameData.hTeamTriCode)}
              </div>
            </button>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center pt-2 text-lg font-bold text-gray-500">
          {marketMakerTeam &&
            `You selected the ${getTeamFormatter(marketMakerTeam)} to win.`}
          {validationErrors.noTeamSelected ? (
            <p className=" text-center text-red-500 ">
              {validationErrors.noTeamSelected}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };

  // Stage === 3
  const ReviewSelection = () => {
    return (
      <div className="lg:px:20 w-full px-8 pt-2">
        <h3 className="w-full py-1  text-sm font-bold text-black lg:text-2xl">
          Review your bet information:
        </h3>
        <p className="py-1 text-gray-500 lg:text-xl">
          1. The winner will get{" "}
          <span className="font-bold text-black">
            {payOutFromAmericanOdds(marketMakerDeposit, americanOdds)} N.
          </span>
        </p>
        <p className="py-1 text-sm text-gray-500 lg:text-xl">
          2. You are betting{" "}
          <span className="font-bold text-black">{marketMakerDeposit} N</span>{" "}
          on{" "}
          <span className="font-bold text-black">
            {getTeamFormatter(marketMakerTeam)}.
          </span>{" "}
          Your odds are{" "}
          <span className="font-bold text-black">{americanOdds}.</span>
        </p>
        <p className="py-1 text-sm text-gray-500 lg:text-xl">
          3. Your opponent will be betting{" "}
          <span className="font-bold text-black">
            {payOutFromAmericanOdds(marketMakerDeposit, americanOdds) -
              marketMakerDeposit}{" "}
            N
          </span>{" "}
          on{" "}
          <span className="font-bold text-black">
            {getTeamFormatter(betterTeam)}
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
        <p className="py-1 text-sm text-gray-500 lg:text-xl">
          4. If an opponent is found, you have{" "}
          <span className="font-bold text-black">2 hours</span> before tip-off
          to cancel the bet.
        </p>
      </div>
    );
  };

  const handleNext = () => {
    if (formStage === 1 && !marketMakerTeam) {
      setValidationErrors({
        ...validationErrors,
        noTeamSelected: "Please select a team.",
      });
    } else if (
      formStage === 2 &&
      (validationErrors.negativeBettingAmount ||
        validationErrors.wrongBettingOdds)
    ) {
    } else if (formStage >= 1 && formStage < 3) {
      setFormStage(formStage + 1);
    }
  };

  const handlePrevious = () => {
    if (formStage >= 2) {
      setFormStage(formStage - 1);
    }
  };

  const handleMarketMakerDeposit = (value) => {
    if (value > 0) {
      setMarketMakerDeposit(value);
      setValidationErrors({
        ...validationErrors,
        negativeBettingAmount: "",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        negativeBettingAmount: "Please input a valid positive amount",
      });
    }
  };

  const handleOdds = (value) => {
    if (Math.abs(value) >= 100) {
      setAmericanOdds(value);
      setValidationErrors({
        ...validationErrors,
        wrongBettingOdds: "",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        wrongBettingOdds: "Please put in valid odds (between -100 and 100)",
      });
    }
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm ">
      <div className="relative top-0 h-2/3 w-11/12 rounded bg-white p-2 lg:h-96 lg:w-1/2">
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
                    onChange={(e) => handleMarketMakerDeposit(e.target.value)}
                  />

                  <div className="text-xs italic text-red-500">
                    {validationErrors.negativeBettingAmount
                      ? validationErrors.negativeBettingAmount
                      : " "}
                  </div>
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
                    onChange={(e) => handleOdds(e.target.value)}
                    placeholder="Your Bettings Odds"
                  />
                  <div className="text-xs italic text-red-500">
                    {validationErrors.wrongBettingOdds
                      ? validationErrors.wrongBettingOdds
                      : " "}
                  </div>
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
