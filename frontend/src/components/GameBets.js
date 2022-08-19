import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useWindowDimensions from "../utils/useWindowDimensions";
import GameBetsModal from "./GameBetsModal";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import getTeamFormatter from "../utils/getTeamFormatter";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Big from "big.js";
import IndividualBet from "./IndividualBet";

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const GameBets = ({ contract }) => {
  let { gameDate, gameId } = useParams();
  const { width } = useWindowDimensions();
  const [showOpenBets, setShowOpenBets] = useState(true);
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
  const [gameBetsShown, setGameBetsShown] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [parent] = useAutoAnimate(/* optional config */);

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
        gameUrlCode: game.basicGameData.gameUrlCode,
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
          gameUrlCode: game.basicGameData.gameUrlCode,
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
          gameUrlCode: game.basicGameData.gameUrlCode,
        });
      }

      const allOpenBets = await contract.get_bets_by_game_id({
        game_id: gameId,
      });
      setGameBets(allOpenBets);
      setGameBetsShown(allOpenBets.filter((bet) => bet.better_found === false));
    };
    handleInit();
  }, [gameDate, gameId, contract]);

  const acceptBet = async (betId, deposit) => {
    try {
      await contract.accept_bet_index({ id: betId }, BOATLOAD_OF_GAS, deposit);
      const newOpenBets = gameBets.filter((bet) => bet.id !== betId);
      setGameBets(newOpenBets);
    } catch (error) {
      alert("You have to login first!");
    }
  };
  const handleSetOpenBetsTrue = () => {
    const openBets = gameBets.filter((bet) => bet.better_found === false);
    setGameBetsShown(openBets);
    setShowOpenBets(true);
  };

  const handleSetOpenBetsFalse = () => {
    const acceptedBets = gameBets.filter((bet) => bet.better_found === true);
    setGameBetsShown(acceptedBets);
    setShowOpenBets(false);
  };

  return (
    <div className="flex w-full flex-col items-center" ref={parent}>
      <div className="flex w-11/12 flex-row items-center bg-gray-200 py-2 lg:w-7/12 ">
        <div className="basis-1/2 pr-2 lg:basis-1/3">
          <p
            className={`float-right text-2xl text-gray-500 ${
              parseInt(gameData.hTeamScore) < parseInt(gameData.vTeamScore) &&
              "font-bold text-black"
            }`}
          >
            {gameData.vTeamScore}{" "}
            {parseInt(gameData.hTeamScore) < parseInt(gameData.vTeamScore) && (
              <MdArrowLeft className="float-right mt-1" />
            )}
          </p>
          <img
            src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${gameData.vTeamTriCode.toLocaleLowerCase()}.png`}
            alt={`${gameData.vTeamTriCode} Team Logo`}
            width="50"
            className="float-right"
          />
          <div className="float-right">
            <p className="text-lg ">
              {width > 1600
                ? getTeamFormatter(gameData.vTeamTriCode)
                : gameData.vTeamTriCode}
            </p>
            <p className="float-right text-sm">{gameData.vTeamRecord}</p>
          </div>
        </div>
        {width > 768 && (
          <div className="flex basis-1/5 flex-col items-center px-2">
            <p>{gameData.gameEnded ? "Final" : "Not Final"}</p>
            <table className="table-auto border-collapse border-gray-400 text-sm">
              <thead className="border-b-1 border border-l-0  border-t-0 border-r-0  border-gray-400">
                <tr>
                  <th className="lg:pr-24"></th>
                  <th className="font-normal lg:px-4 ">1</th>
                  <th className="font-normal lg:px-4 ">2</th>
                  <th className="font-normal lg:px-4 ">3</th>
                  <th className="font-normal lg:px-4 ">4</th>
                  <th className="text-center">T</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{gameData.vTeamTriCode}</td>
                  <td className="text-center">{gameData.vTeamQ1Score}</td>
                  <td className="text-center">{gameData.vTeamQ2Score}</td>
                  <td className="text-center">{gameData.vTeamQ3Score}</td>
                  <td className="text-center">{gameData.vTeamQ4Score}</td>
                  <td className="text-center">{gameData.vTeamScore}</td>
                </tr>
                <tr>
                  <td>{gameData.hTeamTriCode}</td>
                  <td className="text-center">{gameData.hTeamQ1Score}</td>
                  <td className="text-center">{gameData.hTeamQ2Score}</td>
                  <td className="text-center">{gameData.hTeamQ3Score}</td>
                  <td className="text-center">{gameData.hTeamQ4Score}</td>
                  <td className="text-center">{gameData.hTeamScore}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="basis-1/2 pl-2 lg:basis-1/3">
          <p
            className={`float-left text-2xl text-gray-500 ${
              parseInt(gameData.hTeamScore) > parseInt(gameData.vTeamScore) &&
              "font-bold text-black"
            }`}
          >
            {parseInt(gameData.hTeamScore) > parseInt(gameData.vTeamScore) && (
              <MdArrowRight className="float-left mt-1" />
            )}{" "}
            {gameData.hTeamScore}
          </p>
          <img
            src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${gameData.hTeamTriCode.toLocaleLowerCase()}.png`}
            alt={`${gameData.hTeamTriCode} Team Logo`}
            width="50"
            className="float-left"
          />
          <div className="float-left">
            <p className="text-lg">
              {width > 1600
                ? getTeamFormatter(gameData.hTeamTriCode)
                : gameData.hTeamTriCode}
            </p>
            <p className="float-left text-sm">{gameData.hTeamRecord}</p>
          </div>
        </div>
      </div>
      <button
        className={
          "mt-5 mb-2 flex flex-col items-center justify-center rounded bg-blue-500 px-2 py-1 text-xl text-white hover:bg-blue-700 "
        }
        onClick={() => setModalVisible(true)}
      >
        Add a bet on this game
      </button>
      <div className="mb-5 text-2xl font-bold">
        Bets on{" "}
        {width > 768
          ? getTeamFormatter(gameData.vTeamTriCode)
          : gameData.vTeamTriCode}{" "}
        vs.{" "}
        {width > 768
          ? getTeamFormatter(gameData.hTeamTriCode)
          : gameData.hTeamTriCode}
      </div>
      <div className="flex w-11/12 flex-row lg:w-7/12">
        <button
          className={`w-1/2 bg-gray-200 text-center ${
            showOpenBets && "bg-blue-500 text-white"
          }`}
          onClick={() => handleSetOpenBetsTrue()}
        >
          Open Bets
        </button>
        <button
          className={`w-1/2 bg-gray-200 text-center ${
            !showOpenBets && "bg-blue-500 text-white"
          }`}
          onClick={() => handleSetOpenBetsFalse()}
        >
          Accepted Bets
        </button>
      </div>
      <div
        className="grid w-8/12 grid-cols-1 justify-center py-2 lg:w-3/4 lg:grid-cols-[repeat(auto-fit,_16.666666%)]"
        ref={parent}
      >
        {gameBetsShown.length === 0 &&
          showOpenBets &&
          "No open bets on this game"}
        {gameBetsShown.length === 0 &&
          !showOpenBets &&
          "Nobody has agreed on a bet on this game."}
        {gameBetsShown.map((bet) => (
          <IndividualBet
            bet={bet}
            key={bet.id}
            gameData={gameData}
            acceptBet={acceptBet}
          />
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
