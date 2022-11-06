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
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
};

const Games = () => {
  const [shownDay, setShownDay] = useState(new Date());
  const [shownDates, setShownDates] = useState([]);
  const [shownGames, setShownGames] = useState([]);
  const [parent] = useAutoAnimate(/* optional config */);

  useEffect(() => {
    const handleInit = async () => {
      const dates = nextWeek(shownDay);

      setShownDates(dates);
      const games = await fetch(
        `https://www.balldontlie.io/api/v1/games?dates[]=${date_to_string(
          shownDay
        )}`
      ).then((res) => res.json());
      console.log(games);
      setShownGames(games.data);
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
      `https://www.balldontlie.io/api/v1/games?dates[]=${date_to_string(
        shownDay
      )}`
    ).then((res) => res.json());
    setShownGames(games.data);
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
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-row items-center" ref={parent}>
        <button>
          <MdArrowBackIosNew onClick={handlePreviousWeek} />
        </button>
        {shownDates.map((date) => {
          return (
            <button
              key={date.getDay()}
              className={
                date.getDay() === shownDay.getDay()
                  ? "float-left mx-4 w-4 font-bold hover:rounded hover:bg-gray-200 lg:w-12"
                  : "float-left mx-4 w-4 hover:rounded hover:bg-gray-200 lg:w-12 "
              }
              onClick={() => handleSetDay(date)}
            >
              <p className="flex flex-col items-center text-base font-semibold lg:text-lg">
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
      {shownGames.length === 0 && (
        <div className="py-5 text-center text-2xl font-bold">
          No games played.
        </div>
      )}
      <div className="grid py-5 lg:grid-cols-3 ">
        {shownGames.map((game) => {
          return (
            <GameButton
              key={game.id}
              gameId={game.id}
              gameDate={game.date.slice(0, 10)}
              hTeam={game.home_team.abbreviation}
              vTeam={game.visitor_team.abbreviation}
              hTeamScore={game.home_team_score}
              vTeamScore={game.visitor_team_score}
              status={game.status}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Games;
