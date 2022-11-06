import React from "react";
import { MdArrowRight } from "react-icons/md";

const GameButton = ({
  gameId,
  gameDate,
  hTeam,
  vTeam,
  hTeamScore,
  vTeamScore,
  status,
}) => {
  const date = new Date(gameDate);
  // console.log(Date.parse(new Date()));
  const GameDiv = () => {
    return (
      <a
        className="mx-2 my-2 grid w-48 grid-cols-2 grid-rows-2 rounded hover:bg-gray-200"
        href={`/games/${gameDate}/${gameId}`}
      >
        <div className="w-5/8 float-left pl-2 pt-1">
          <img
            src={`/teams/${vTeam.toLowerCase()}.png`}
            alt={`${vTeam} Team Logo`}
            width="25"
            className="float-left"
          />
          {vTeam}
        </div>

        <div
          className={`w-2/8 place-items-end justify-self-end pr-2 pt-1 text-gray-500 ${
            parseInt(hTeamScore) < parseInt(vTeamScore) &&
            "font-semibold text-black"
          }`}
        >
          {parseInt(hTeamScore) < parseInt(vTeamScore) && (
            <MdArrowRight className="float-left pt-1" size={22} />
          )}
          {vTeamScore}
        </div>
        <div className="w-5/8 float-left pl-2 pb-1">
          <img
            src={`/teams/${hTeam.toLowerCase()}.png`}
            alt={`${hTeam} Team Logo`}
            width="25"
            className="float-left"
          />
          {hTeam}
        </div>
        <div
          className={`w-2/8 place-items-end justify-self-end pr-2 pt-1 text-gray-500 ${
            parseInt(hTeamScore) > parseInt(vTeamScore) &&
            "font-semibold text-black"
          }`}
        >
          {parseInt(hTeamScore) > parseInt(vTeamScore) && (
            <MdArrowRight className="float-left pt-1" size={22} />
          )}
          {hTeamScore}
        </div>
      </a>
    );
  };

  const GameNotStarted = () => {
    return (
      <div className="mx-2 my-2 grid w-48 grid-cols-2 grid-rows-2 rounded hover:bg-gray-200">
        <div className="w-5/8 float-left pl-2 pt-1">
          <img
            src={`/teams/${hTeam.toLowerCase()}.png`}
            alt={`${hTeam} Team Logo`}
            width="25"
            className="float-left"
          />
          {hTeam}
        </div>

        <div className="w-2/8 row-span-2 my-auto pr-2 pt-1 text-right text-sm">
          Tip Off: <br /> <span className="font-bold">{status}</span>
        </div>
        <div className="w-5/8 float-left pl-2 pb-1">
          <img
            src={`/teams/${vTeam.toLowerCase()}.png`}
            alt={`${vTeam} Team Logo`}
            width="25"
            className="float-left"
          />
          {vTeam}
        </div>
      </div>
    );
  };

  return (
    <div>
      {date + Date.parse(new Date()) < 0 ? <GameDiv /> : <GameNotStarted />}
    </div>
  );
};

export default GameButton;
