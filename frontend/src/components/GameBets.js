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
    gameId: "",
    startTimeUTC: "",
    hTeamTriCode: "",
    vTeamTriCode: "",
    hTeamScore: 0,
    vTeamScore: 0,
    gameStarted: false,
    gameEnded: false,
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
        `https://www.balldontlie.io/api/v1/games/${gameId}`
      ).then((res) => res.json());
      console.log(game);
      setGameData({
        ...gameData,
        gameId: game.id.toString(),
        gameDate: game.date,
        start_time_utc: game.status,
        startTimeUTC: game.status,
        hTeamTriCode: game.home_team.abbreviation,
        vTeamTriCode: game.visitor_team.abbreviation,
        hTeamScore: game.home_team_score,
        vTeamScore: game.visitor_team_score,
        gameUrlCode: game.id.toString(),
      });

      // if (game.basicGameData.isGameActivated === true) {
      //   setGameData({
      //     ...gameData,
      //     startTimeUTC: game.status,
      //     hTeamTriCode: game.home_team.abbreviation,
      //     vTeamTriCode: game.visitor_team.abbreviation,
      //     hTeamScore: game.home_team_score,
      //     vTeamScore: game.visitor_team_score,
      //   });
      // }
      // if (new Date(game.basicGameData.endTimeUTC) < new Date()) {
      //   setGameData({
      //     ...gameData,
      //     startTimeUTC: game.status,
      //     hTeamTriCode: game.home_team.abbreviation,
      //     vTeamTriCode: game.visitor_team.abbreviation,
      //     hTeamScore: game.home_team_score,
      //     vTeamScore: game.visitor_team_score,
      //   });
      // }

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
        <div className="basis-1/2 pr-2">
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
            src={`/teams/${gameData.vTeamTriCode.toLocaleLowerCase()}.png`}
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
          </div>
        </div>

        <div className="basis-1/2 pl-2">
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
            src={`/teams/${gameData.hTeamTriCode.toLocaleLowerCase()}.png`}
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
            hTeam={gameData.hTeamTriCode}
            vTeam={gameData.vTeamTriCode}
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
