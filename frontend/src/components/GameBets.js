import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useWindowDimensions from "../utils/useWindowDimensions";
import GameBetsModal from "./GameBetsModal";
import * as nearAPI from "near-api-js";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

const {
  utils: {
    format: { formatNearAmount },
  },
} = nearAPI;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
const GameBets = ({ currentUser, contract }) => {
  let { gameDate, gameId } = useParams();
  const { width } = useWindowDimensions();
  const [gameData, setGameData] = useState({
    gameId: gameId,
    gameDate: gameDate,
    startTimeUTC: new Date().toISOString(),
    hTeamTriCode: "",
    vTeamTriCode: "",
    hTeamScore: "",
    vTeamScore: "",
    hTeamQ1Score: "",
    hTeamQ2Score: "",
    hTeamQ3Score: "",
    hTeamQ4Score: "",
    vTeamQ1Score: "",
    vTeamQ2Score: "",
    vTeamQ3Score: "",
    vTeamQ4Score: "",
    hTeamRecord: "",
    vTeamRecord: "",
    gameEnded: false,
    gameStarted: false,
  });
  const [gameBets, setGameBets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const handleInit = async () => {
      const game = await fetch(
        `https://data.nba.net/10s/prod/v1/${gameDate}/${gameId}_boxscore.json`
      ).then((res) => res.json());
      setGameData({
        ...gameData,
        startTimeUTC: game.basicGameData.startTimeUTC,
        hTeamTriCode: game.basicGameData.hTeam.triCode,
        vTeamTriCode: game.basicGameData.vTeam.triCode,
        hTeamScore: game.basicGameData.hTeam.score,
        vTeamScore: game.basicGameData.vTeam.score,
        hTeamQ1Score: game.basicGameData.hTeam.linescore[0].score,
        hTeamQ2Score: game.basicGameData.hTeam.linescore[1].score,
        hTeamQ3Score: game.basicGameData.hTeam.linescore[2].score,
        hTeamQ4Score: game.basicGameData.hTeam.linescore[3].score,
        vTeamQ1Score: game.basicGameData.vTeam.linescore[0].score,
        vTeamQ2Score: game.basicGameData.vTeam.linescore[1].score,
        vTeamQ3Score: game.basicGameData.vTeam.linescore[2].score,
        vTeamQ4Score: game.basicGameData.vTeam.linescore[3].score,
        hTeamRecord:
          game.basicGameData.hTeam.win + "-" + game.basicGameData.hTeam.loss,
        vTeamRecord:
          game.basicGameData.vTeam.win + "-" + game.basicGameData.vTeam.loss,
      });

      if (game.basicGameData.isGameActivated === true) {
        setGameData({
          ...gameData,
          startTimeUTC: game.basicGameData.startTimeUTC,
          gameStarted: true,
          hTeamTriCode: game.basicGameData.hTeam.triCode,
          vTeamTriCode: game.basicGameData.vTeam.triCode,
          hTeamScore: game.basicGameData.hTeam.score,
          vTeamScore: game.basicGameData.vTeam.score,
          hTeamQ1Score: game.basicGameData.hTeam.linescore[0].score,
          hTeamQ2Score: game.basicGameData.hTeam.linescore[1].score,
          hTeamQ3Score: game.basicGameData.hTeam.linescore[2].score,
          hTeamQ4Score: game.basicGameData.hTeam.linescore[3].score,
          vTeamQ1Score: game.basicGameData.vTeam.linescore[0].score,
          vTeamQ2Score: game.basicGameData.vTeam.linescore[1].score,
          vTeamQ3Score: game.basicGameData.vTeam.linescore[2].score,
          vTeamQ4Score: game.basicGameData.vTeam.linescore[3].score,
          hTeamRecord:
            game.basicGameData.hTeam.win + "-" + game.basicGameData.hTeam.loss,
          vTeamRecord:
            game.basicGameData.vTeam.win + "-" + game.basicGameData.vTeam.loss,
        });
      }
      if (new Date(game.basicGameData.endTimeUTC) < new Date()) {
        setGameData({
          ...gameData,
          startTimeUTC: game.basicGameData.startTimeUTC,
          hTeamTriCode: game.basicGameData.hTeam.triCode,
          vTeamTriCode: game.basicGameData.vTeam.triCode,
          hTeamScore: game.basicGameData.hTeam.score,
          vTeamScore: game.basicGameData.vTeam.score,
          hTeamQ1Score: game.basicGameData.hTeam.linescore[0].score,
          hTeamQ2Score: game.basicGameData.hTeam.linescore[1].score,
          hTeamQ3Score: game.basicGameData.hTeam.linescore[2].score,
          hTeamQ4Score: game.basicGameData.hTeam.linescore[3].score,
          vTeamQ1Score: game.basicGameData.vTeam.linescore[0].score,
          vTeamQ2Score: game.basicGameData.vTeam.linescore[1].score,
          vTeamQ3Score: game.basicGameData.vTeam.linescore[2].score,
          vTeamQ4Score: game.basicGameData.vTeam.linescore[3].score,
          hTeamRecord:
            game.basicGameData.hTeam.win + "-" + game.basicGameData.hTeam.loss,
          vTeamRecord:
            game.basicGameData.vTeam.win + "-" + game.basicGameData.vTeam.loss,
          gameEnded: true,
          gameStarted: true,
        });
      }

      const allOpenBets = await contract.get_bets_by_game_id({
        game_id: gameId,
      });
      setGameBets(allOpenBets);
    };
    handleInit();
  }, [gameDate, gameId, contract]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-row items-center lg:w-1/2 w-11/12 bg-gray-200 py-2 ">
        <div className="lg:basis-1/3 basis-1/2 pr-2">
          <p
            className={`float-right text-2xl ${
              parseInt(gameData.vTeamScore) > parseInt(gameData.hTeamScore) &&
              "text-gray-500"
            }`}
          >
            {gameData.hTeamScore}{" "}
            {parseInt(gameData.vTeamScore) < parseInt(gameData.hTeamScore) && (
              <MdArrowLeft className="float-right mt-1" />
            )}
          </p>
          <img
            src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${gameData.hTeamTriCode.toLocaleLowerCase()}.png`}
            alt={`${gameData.hTeamTriCode} Team Logo`}
            width="50"
            className="float-right"
          />
          <div className="float-right">
            <p className="text-lg ">{gameData.hTeamTriCode}</p>
            <p className="text-sm float-right">{gameData.hTeamRecord}</p>
          </div>
        </div>
        {width > 768 && (
          <div className="flex flex-col basis-1/5 items-center px-2">
            <p>{gameData.gameEnded ? "Final" : "Not Final"}</p>
            <table className="table-auto text-sm border-collapse border-gray-400">
              <thead className="border-collapse border border-gray-400">
                <tr>
                  <th className="lg:pr-24"></th>
                  <th className="lg:px-4">1</th>
                  <th className="lg:px-4">2</th>
                  <th className="lg:px-4 text-center">3</th>
                  <th className="lg:px-4 text-center">4</th>
                  <th className="text-center">T</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{gameData.hTeamTriCode}</td>
                  <td className="text-center">{gameData.hTeamQ1Score}</td>
                  <td className="text-center">{gameData.hTeamQ2Score}</td>
                  <td className="text-center">{gameData.hTeamQ3Score}</td>
                  <td className="text-center">{gameData.hTeamQ4Score}</td>
                  <td className="text-center">{gameData.hTeamScore}</td>
                </tr>
                <tr>
                  <td>{gameData.vTeamTriCode}</td>
                  <td className="text-center">{gameData.vTeamQ1Score}</td>
                  <td className="text-center">{gameData.vTeamQ2Score}</td>
                  <td className="text-center">{gameData.vTeamQ3Score}</td>
                  <td className="text-center">{gameData.vTeamQ4Score}</td>
                  <td className="text-center">{gameData.vTeamScore}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="lg:basis-1/3 basis-1/2 pl-2">
          <p
            className={`float-left text-2xl ${
              parseInt(gameData.vTeamScore) < parseInt(gameData.hTeamScore) &&
              "text-gray-500"
            }`}
          >
            {parseInt(gameData.vTeamScore) > parseInt(gameData.hTeamScore) && (
              <MdArrowRight className="float-left mt-1" />
            )}{" "}
            {gameData.vTeamScore}
          </p>
          <img
            src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${gameData.vTeamTriCode.toLocaleLowerCase()}.png`}
            alt={`${gameData.vTeamTriCode} Team Logo`}
            width="50"
            className="float-left"
          />
          <div className="float-left">
            <p className="text-lg">{gameData.vTeamTriCode}</p>
            <p className="text-sm float-left">{gameData.vTeamRecord}</p>
          </div>
        </div>
      </div>
      <button
        className="text-xl my-2 bg-gray-300 rounded p-1"
        onClick={() => setModalVisible(true)}
      >
        Add a bet on this game
      </button>
      <div className="text-2xl mb-5">
        Bets on {gameData.hTeamTriCode} vs {gameData.vTeamTriCode}
      </div>
      <div className="grid lg:grid-cols-[repeat(auto-fit,_16.666666%)] lg:w-3/4 w-11/12 py-2 m-auto justify-center ">
        {gameBets.map((bet) => (
          <div
            key={bet.id}
            className="lg:col-span-2 rounded-md bg-gray-100 border-2 border-black px-2 m-auto my-2"
          >
            <p className="mx-auto">
              Initiated by: {capitalizeFirstLetter(bet.market_maker_id)}
            </p>
            <p className="mx-auto">
              Bet:{" "}
              <span className="font-bold italic underline">
                {" "}
                {formatNearAmount(bet.better_deposit, 2)} N
              </span>{" "}
              on {bet.bidder_team} to win{" "}
              <span className="font-bold italic underline">
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
              </span>{" "}
            </p>

            <p className="mx-auto">
              Odds:{" "}
              <span className="font-bold italic underline">
                {americanOddsCalculator(
                  parseInt(bet.better_deposit),
                  parseInt(bet.better_deposit) +
                    parseInt(bet.market_maker_deposit)
                )}
              </span>
            </p>
          </div>
        ))}
      </div>
      <GameBetsModal
        visible={modalVisible}
        onClose={handleModalClose}
        contract={contract}
        gameData={gameData}
      />
    </div>
  );
};

export default GameBets;
