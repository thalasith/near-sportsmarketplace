import React, { useState } from "react";
import { GrClose } from "react-icons/gr";
import * as nearAPI from "near-api-js";
import Big from "big.js";
const {
  utils: {
    format: { parseNearAmount },
  },
} = nearAPI;
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

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
  const [marketMakerTeam, setMarketMakerTeam] = useState("");
  const [bidderTeam, setBidderTeam] = useState(gameData.vTeamTriCode);
  const [review, setReview] = useState(false);

  const handleBettingTeamChange = (e) => {
    if (e.target.value === gameData.hTeamTriCode) {
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
      parseNearAmount(marketMakerDeposit)
    );
  };

  const ReviewComponent = () => {
    return (
      <div>
        <h3>Review</h3>
        <p>
          You are betting {marketMakerDeposit} on {marketMakerTeam}
        </p>
        <p>The odds are {americanOdds}.</p>
        <p>
          Your opponent will bet{" "}
          {payOutFromAmericanOdds(marketMakerDeposit, americanOdds) -
            marketMakerDeposit}{" "}
          on {bidderTeam}
        </p>
        <button
          className="bg-gray-300 rounded px-1 mx-1"
          onClick={() => setReview(false)}
        >
          Make some edits
        </button>
        <button
          className="bg-gray-300 rounded px-1 mx-1"
          onClick={() => handleSubmitBet()}
        >
          Submit
        </button>
      </div>
    );
  };
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center ">
      <div className="bg-white p-2 rounded lg:w-1/2 w-72 h-96 relative">
        <GrClose className="float-right" onClick={() => onClose()} />
        {review && <ReviewComponent />}
        {!review && (
          <div className="flex flex-row items-center justify-center w-full">
            <form>
              <label>Team You're Betting on</label>
              <select
                className="form-select form-select-sm
                appearance-none
                block
                w-1/2
                px-2
                py-1
                text-sm
                text-center
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                aria-label=".form-select-sm example"
                onChange={(e) => handleBettingTeamChange(e)}
                value={marketMakerTeam}
              >
                <option value="">Select a team</option>
                <option value={gameData.hTeamTriCode}>
                  {gameData.hTeamTriCode}
                </option>
                <option value={gameData.vTeamTriCode}>
                  {gameData.vTeamTriCode}
                </option>
              </select>
              <label>Amount You Will Bet</label>
              <input
                className=" w-full bg-gray-200 rounded"
                type="number"
                name="marketMakerDeposit"
                onChange={(e) => setMarketMakerDeposit(e.target.value)}
                value={marketMakerDeposit}
              />

              <label>Odds you would like</label>
              <input
                className=" w-full bg-gray-200 rounded"
                type="number"
                name="marketMakerDeposit"
                onChange={(e) => setAmericanOdds(e.target.value)}
                value={americanOdds}
              />
              <p className="flex flex-row ">
                You will potentially win{" "}
                {payOutFromAmericanOdds(marketMakerDeposit, americanOdds)} N off
                of your {marketMakerDeposit} N bet.
              </p>
              <button onClick={(e) => setReview(true)}>Review</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBetsModal;
