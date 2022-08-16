import React, { useState, useEffect } from "react";
import { MdArrowForwardIos, MdArrowBackIosNew } from "react-icons/md";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import GameButton from "./GameButton";

const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const date_to_string = (date) => {
  const year = date.getFullYear().toString();
  const month =
    date.getMonth() < 9
      ? "0" + (date.getMonth() + 1).toString()
      : (date.getMonth() + 1).toString();
  const day =
    date.getDate() < 9
      ? "0" + (date.getDate() + 1).toString()
      : date.getDate().toString();
  return year + month + day;
};

const Games = () => {
  const [shownDay, setShownDay] = useState(new Date("2021-12-25T01:24:00"));
  const [shownDates, setShownDates] = useState([]);
  const [shownGames, setShownGames] = useState([]);
  const [parent] = useAutoAnimate(/* optional config */);

  useEffect(() => {
    const handleInit = async () => {
      const dates = nextWeek(shownDay);

      setShownDates(dates);
      const games = await fetch(
        `https://data.nba.net/10s/prod/v1/${date_to_string(
          shownDay
        )}/scoreboard.json`
      ).then((res) => res.json());
      setShownGames(games.games);
    };
    handleInit();
  }, [shownDay]);

  const previousWeek = (date) => {
    const newDates = [];
    for (let i = 0; i < 7; i++) {
      newDates.push(new Date(date.getTime() - i * 24 * 60 * 60 * 1000));
    }
    return newDates.reverse();
  };

  const handleSetDay = async (date) => {
    setShownDay(date);
    setShownDates(nextWeek(date));
    const games = await fetch(
      `https://data.nba.net/10s/prod/v1/${date_to_string(date)}/scoreboard.json`
    ).then((res) => res.json());
    setShownGames(games.games);
  };

  const handlePreviousWeek = () => {
    const newShownDay = new Date(shownDay.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newDates = previousWeek(newShownDay);
    setShownDates(newDates);
    setShownDay(newShownDay);
  };

  const handleNextWeek = () => {
    const newShownDay = new Date(shownDay.getTime() + 7 * 24 * 60 * 60 * 1000);
    const newDates = nextWeek(newShownDay);
    setShownDates(newDates);
    setShownDay(newShownDay);
  };

  const nextWeek = (date) => {
    const nextFiveDays = [];
    for (let i = 0; i < 7; i++) {
      nextFiveDays.push(new Date(date.getTime() + i * 24 * 60 * 60 * 1000));
    }
    return nextFiveDays;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-row items-center" ref={parent}>
        <button className="hover:bg-gray-200">
          <MdArrowBackIosNew onClick={handlePreviousWeek} />
        </button>
        {shownDates.map((date) => {
          return (
            <button
              key={date.getDay()}
              className={
                date.getDay() === shownDay.getDay()
                  ? "float-left mx-4 hover:bg-gray-200 lg:w-12 w-4 font-bold"
                  : "float-left mx-4 hover:bg-gray-200 lg:w-12 w-4"
              }
              onClick={() => handleSetDay(date)}
            >
              <p className="flex flex-col items-center lg:text-lg text-base">
                {weekday[date.getDay()]}
              </p>
              <p className="flex flex-col items-center text-xs">
                {" "}
                {monthNames[date.getMonth()]} {date.getDate()}
              </p>
            </button>
          );
        })}
        <button>
          <MdArrowForwardIos onClick={handleNextWeek} />
        </button>
      </div>
      <div className="grid lg:grid-cols-3 py-5 ">
        {shownGames.map((game) => {
          return (
            <GameButton
              key={game.gameId}
              gameId={game.gameId}
              gameDate={game.homeStartDate}
              hTeam={game.hTeam.triCode}
              vTeam={game.vTeam.triCode}
              hTeamScore={game.hTeam.score}
              vTeamScore={game.vTeam.score}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Games;
