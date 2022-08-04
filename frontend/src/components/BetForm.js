import React, { useState } from "react";

const DATA = [
  {
    gameId: "0012100001",
    startTimeUTC: "2021-10-03T19:30:00.000Z",
    hTeam: "1610612747",
    vTeam: "1610612751",
  },
  {
    gameId: "0012100003",
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

const BetForm = () => {
  const [selectedGame, setSelectedGame] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [bet, setBet] = useState({
    gameId: "",
    startTimeUTC: "",
    market_maker_team: "",
    bidder_team: "",
  });

  const changeGameHandler = (e) => {
    setSelectedGame(DATA.filter((game) => game.gameId === e.target.value)[0]);
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

  const showSelections = (
    <div>
      <select>
        <option value={homeTeam}>{homeTeam}</option>
        <option value={awayTeam}>{awayTeam}</option>
      </select>
      <input
        className="bg-gray-200"
        type="number"
        placeholder="Your Betting Amount"
      />
      <input
        className="bg-gray-200"
        type="number"
        placeholder="Amount They'll Bet"
      />
    </div>
  );

  return (
    <div>
      <form>
        <p className="text-xl mx-5"> Add a Bet </p>
        <div className="flex justify-center">
          <div className="mb-3 xl:w-96">
            <select
              className="form-select form-select-sm
                    appearance-none
                    block
                    w-full
                    px-2
                    py-1
                    text-sm
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
              onChange={changeGameHandler}
              defaultValue="0"
            >
              <option value="" key="0">
                Open this select menu
              </option>
              {DATA.map((game) => (
                <option value={game.gameId} key={game.gameId}>
                  {
                    TEAMS.filter((team) => team.teamId === game.hTeam)[0]
                      .fullName
                  }{" "}
                  vs{" "}
                  {
                    TEAMS.filter((team) => team.teamId === game.vTeam)[0]
                      .fullName
                  }
                </option>
              ))}
            </select>
            {selectedGame !== "" && showSelections}
          </div>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default BetForm;
