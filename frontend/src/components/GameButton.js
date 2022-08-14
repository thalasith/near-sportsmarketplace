import React, { useState } from "react";
import useHover from "../utils/useHover";

const GameButton = ({
  gameId,
  gameDate,
  hTeam,
  vTeam,
  hTeamScore,
  vTeamScore,
}) => {
  const [hoverRef, isHovering] = useHover();

  return (
    <a
      className="grid grid-cols-2 grid-rows-2 w-48 mx-2 my-2 hover:bg-gray-200 rounded"
      ref={hoverRef}
      href={`/games/${gameDate}/${gameId}`}
    >
      <div className="float-left w-5/8 pl-2 pt-1">
        <img
          src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${hTeam.toLowerCase()}.png`}
          width="25"
          className="float-left"
        />
        {hTeam}
      </div>
      <div className="text-right w-2/8 pr-2 pt-1">{hTeamScore}</div>
      <div className="float-left w-5/8 pl-2 pb-1">
        <img
          src={`http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/${vTeam.toLowerCase()}.png`}
          width="25"
          className="float-left"
        />
        {vTeam}
      </div>
      <div className="text-right w-2/8 pr-2 pb-1">{vTeamScore}</div>
    </a>
  );
};

export default GameButton;
