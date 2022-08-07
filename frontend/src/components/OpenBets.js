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

const DATA = [
  {
    gameId: "0012100001",
    startTimeUTC: "2021-10-03T19:30:00.000Z",
    gameDate: "20211003",
    hTeam: "1610612747",
    vTeam: "1610612751",
  },
  {
    gameId: "0012100003",
    gameDate: "20211003",
    startTimeUTC: "2021-10-04T23:30:00.000Z",
    hTeam: "1610612738",
    vTeam: "1610612753",
  },
];

const TEAMS = [
  { fullName: "Boston Celtics", tricode: "BOS", teamId: "1610612738" },
  { fullName: "Brooklyn Nets", tricode: "BKN", teamId: "1610612751" },
  { fullName: "Los Angeles Lakers", tricode: "LAL", teamId: "1610612747" },
  { fullName: "Orlando Magic", tricode: "ORL", teamId: "1610612753" },
];

const OpenBets = ({ currentUser, contract }) => {
  const [openBets, setOpenBets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const getBets = async () => {
      const allOpenBets = await contract.get_all_open_bets();
      console.log("allOpenBets", allOpenBets);
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
      <h1 className="text-xl">Open Bets</h1>

      <div className="h-56 grid grid-cols-1 md:grid-cols-3 gap-4 w-5/6">
        {openBets.map((bet) => (
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
                onClick={() => acceptBet(bet.id, bet.better_deposit)}
              >
                {" "}
                Accept{" "}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 w-full">
        <button
          className="bottom-0 my-8 float-right px-5 py-2 mx-5 bg-red-500 text-white text-sm font-bold tracking-wide rounded-full focus:outline-none"
          onClick={() => setModalVisible(true)}
        >
          Add Bet
        </button>
      </div>
      <Modal
        visible={modalVisible}
        onClose={handleModalClose}
        contract={contract}
      />
    </div>
  );
};

const Modal = ({ visible, onClose, contract }) => {
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedGameId, setSelectedGameId] = useState("");
  const [selectedGameDate, setSelectedGameDate] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [marketMakerTeam, setMarketMakerTeam] = useState("");
  const [bidderTeam, setBidderTeam] = useState("");
  const [betterDeposit, setBetterDeposit] = useState(0);
  const [marketMakerDeposit, setMarketMakerDeposit] = useState(0);
  const [onReviewStage, setOnReviewStage] = useState(false);

  const changeGameHandler = (e) => {
    setSelectedGame(DATA.filter((game) => game.gameId === e.target.value)[0]);
    setSelectedGameId(e.target.value);
    setSelectedGameDate(
      DATA.filter((game) => game.gameId === e.target.value)[0].gameDate
    );

    setHomeTeam(
      TEAMS.filter(
        (team) =>
          team.teamId ===
          DATA.filter((game) => game.gameId === e.target.value)[0].hTeam
      )[0].fullName
    );
    setAwayTeam(
      TEAMS.filter(
        (team) =>
          team.teamId ===
          DATA.filter((game) => game.gameId === e.target.value)[0].vTeam
      )[0].fullName
    );
  };

  const changeMarketMakerTeamHandler = (e) => {
    if (e.target.value === homeTeam) {
      setMarketMakerTeam(homeTeam);
      setBidderTeam(awayTeam);
    } else {
      setMarketMakerTeam(awayTeam);
      setBidderTeam(homeTeam);
    }
  };

  const handleSubmitBet = async () => {
    const bet = {
      better_amount: parseNearAmount(betterDeposit),
      game_id: selectedGameId,
      game_date: selectedGameDate,
      market_maker_team: TEAMS.find((team) => team.fullName === marketMakerTeam)
        .tricode,
      bidder_team: TEAMS.find((team) => team.fullName === bidderTeam).tricode,
      start_time_utc: selectedGame.startTimeUTC,
    };
    await contract.create_bet(
      bet,
      BOATLOAD_OF_GAS,
      parseNearAmount(marketMakerDeposit)
    );
    // console.log(bet);
  };

  const changeBetterDepositHandler = (e) => {
    setBetterDeposit(e.target.value);
  };

  const changeMarketMakerDepositHandler = (e) => {
    setMarketMakerDeposit(e.target.value);
  };

  const handleReview = () => {
    setOnReviewStage(true);
  };

  const reverseReview = () => {
    setOnReviewStage(false);
  };

  const ReviewDiv = () => {
    return (
      <div className="bg-white p-2 rounded lg:w-1/2 w-72 h-96 relative">
        <h1 className="font-semibold text-center text-xl text-gray-700 pb-5">
          Please review to make sure everything is correct
        </h1>
        <div className="grid grid-cols-2 items-center justify-center w-1/2">
          <div className="">Game: </div>
          <div className="">
            {homeTeam} vs {awayTeam}
          </div>
          <div className="">Your Team: </div>
          <div className="">{homeTeam}</div>
          <div className="">Your Opponent's Team: </div>
          <div className="">{awayTeam}</div>
          <div className="">Your Betting Amount: </div>
          <div className="">{marketMakerDeposit} N</div>
          <div className="">Amount You'd Win: </div>
          <div className="">{betterDeposit} N N</div>
        </div>

        <button
          className="px-5 py-2 bg-gray-700 text-white rounded"
          onClick={reverseReview}
        >
          Cancel
        </button>
        <button
          className="px-5 py-2 bg-gray-700 text-white rounded"
          onClick={() => handleSubmitBet()}
        >
          Submit
        </button>
      </div>
    );
  };

  const FormDiv = () => {
    return (
      <div className="bg-white p-2 rounded lg:w-1/2 w-72 h-96 relative">
        <button onClick={() => onClose()}>X</button>
        <h1 className="font-semibold text-center text-xl text-gray-700 pb-5">
          Make a bet
        </h1>
        <div className="flex items-center justify-center">
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
            onChange={(e) => changeGameHandler(e)}
            value={selectedGameId}
          >
            <option value="" key="0">
              Select a game you want to bet on first
            </option>
            {DATA.map((game) => (
              <option value={game.gameId} key={game.gameId}>
                {TEAMS.filter((team) => team.teamId === game.hTeam)[0].fullName}{" "}
                vs{" "}
                {TEAMS.filter((team) => team.teamId === game.vTeam)[0].fullName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex pt-5 items-center justify-center">
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
            onChange={(e) => changeMarketMakerTeamHandler(e)}
            value={marketMakerTeam}
          >
            <option value="" key="0">
              Select the team you want to bet on
            </option>
            <option value={homeTeam}>{homeTeam}</option>
            <option value={awayTeam}>{awayTeam}</option>
          </select>
        </div>
        <div className="flex pt-5 items-center justify-center">
          <input
            className="w-1/2 bg-gray-200 rounded"
            type="number"
            placeholder="Amount you're betting"
            name="marketMakerDeposit"
            onChange={changeMarketMakerDepositHandler}
            value={marketMakerDeposit}
          />
        </div>
        <div className="flex pt-5 items-center justify-center">
          <input
            className="w-1/2 bg-gray-200 rounded"
            type="number"
            placeholder="Amount your opponent is betting"
            name="betterDeposit"
            onChange={changeBetterDepositHandler}
            value={betterDeposit}
          />
        </div>

        <div className="text-center absolute inset-x-0 bottom-10">
          <button
            className="px-5 py-2 bg-gray-700 text-white rounded"
            onClick={handleReview}
          >
            Review Your Bet
          </button>
        </div>
      </div>
    );
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center ">
      {onReviewStage ? <ReviewDiv /> : <FormDiv />}
    </div>
  );
};

export default OpenBets;
