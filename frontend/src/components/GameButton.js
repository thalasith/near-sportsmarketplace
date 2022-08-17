import React from "react";
import { MdArrowRight } from "react-icons/md";

const GameButton = ({
  gameId,
  gameDate,
  hTeam,
  vTeam,
  hTeamScore,
  vTeamScore,
}) => {
  const GameDiv = () => {
    return (
      <a
        className="grid grid-cols-2 grid-rows-2 w-48 mx-2 my-2 hover:bg-gray-200 rounded"
        href={`/games/${gameDate}/${gameId}`}
      >
        <div className="float-left w-5/8 pl-2 pt-1">
          <img
            src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${vTeam.toLowerCase()}.png`}
            alt={`${vTeam} Team Logo`}
            width="25"
            className="float-left"
          />
          {vTeam}
        </div>

        <div
          className={`place-items-end justify-self-end w-2/8 pr-2 pt-1 text-gray-500 ${
            parseInt(hTeamScore) < parseInt(vTeamScore) &&
            "text-black font-semibold"
          }`}
        >
          {parseInt(hTeamScore) < parseInt(vTeamScore) && (
            <MdArrowRight className="float-left pt-1" size={22} />
          )}
          {vTeamScore}
        </div>
        <div className="float-left w-5/8 pl-2 pb-1">
          <img
            src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${hTeam.toLowerCase()}.png`}
            alt={`${hTeam} Team Logo`}
            width="25"
            className="float-left"
          />
          {hTeam}
        </div>
        <div
          className={`place-items-end justify-self-end w-2/8 pr-2 pt-1 text-gray-500 ${
            parseInt(hTeamScore) > parseInt(vTeamScore) &&
            "text-black font-semibold"
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

  const GamePostponed = () => {
    return (
      <a
        className="grid grid-cols-2 grid-rows-2 w-48 mx-2 my-2 hover:bg-gray-200 rounded"
        href={`/games/${gameDate}/${gameId}`}
      >
        <div className="float-left w-5/8 pl-2 pt-1">
          <img
            src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${hTeam.toLowerCase()}.png`}
            alt={`${hTeam} Team Logo`}
            width="25"
            className="float-left"
          />
          {hTeam}
        </div>

        <div className="row-span-2 text-right my-auto w-2/8 pr-2 pt-1">
          Postponed
        </div>
        <div className="float-left w-5/8 pl-2 pb-1">
          <img
            src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${vTeam.toLowerCase()}.png`}
            alt={`${vTeam} Team Logo`}
            width="25"
            className="float-left"
          />
          {vTeam}
        </div>
        {/* <div className="text-right w-2/8 pr-2 pb-1">{vTeamScore}</div> */}
      </a>
    );
  };

  return (
    <div>{vTeamScore && hTeamScore ? <GameDiv /> : <GamePostponed />}</div>
  );
};

export default GameButton;
