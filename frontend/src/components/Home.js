import React from "react";
import { BsPlayFill } from "react-icons/bs";

const Home = ({ currentUser, signIn }) => {
  return (
    <div className="mx-auto text-center ">
      {/* First Section */}
      <section className=" w-screen  ">
        <h1 className="font-display lg:pb-30 mx-auto max-w-4xl pt-40 text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
          A{" "}
          <span className="relative whitespace-nowrap text-blue-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span className="relative">decentralized</span>
          </span>{" "}
          method to {""}
          <span className="relative whitespace-nowrap text-blue-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span className="relative">head to head</span>
          </span>{" "}
          sports betting.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl px-2 text-lg tracking-tight text-slate-700">
          We leverage blockchain technology to provide a decentralized platform
          for sports betting. Set your own odds on any NBA game and see if
          anyone will take you up on it!
        </p>
        <div className="py-2 text-2xl font-bold text-slate-700">
          Become your own sportsbook today.
        </div>
        <div className="mt-5 flex justify-center gap-x-2 px-3 lg:gap-x-6">
          {currentUser && (
            <a
              href="/open_bets"
              className="rounded-full bg-blue-500 px-3 py-2 text-white hover:bg-blue-700"
            >
              View all open bets
            </a>
          )}
          {currentUser && (
            <a
              href="/games"
              className="rounded-full bg-blue-500 px-3 py-2 text-white hover:bg-blue-700"
            >
              Find a Game to Bet
            </a>
          )}
          {!currentUser && (
            <button
              className="flex flex-row rounded-full border bg-blue-500 px-3 py-2 font-bold uppercase text-white hover:bg-blue-700"
              onClick={signIn}
            >
              Connect your near wallet
            </button>
          )}
          <button className="flex flex-row rounded-full border border-gray-300 px-3 py-2 text-gray-500">
            <BsPlayFill className="mt-1" color="3B81F6" />
            Watch video
          </button>
        </div>
      </section>
      <p className="absolute inset-x-0 bottom-0 mx-auto my-7 max-w-2xl px-2 text-lg font-semibold tracking-tight text-slate-700">
        Powered by Near Protocol.
        <a href="https://near.org/" className="text-center">
          <svg
            height="50"
            width="50"
            xmlns="http://www.w3.org/2000/svg"
            x="0"
            y="0"
            enableBackground="new 0 0 90.1 90"
            version="1.1"
            viewBox="0 0 90.1 90"
            xmlSpace="preserve"
            className="m-auto mt-2"
          >
            <path d="M72.2 4.6L53.4 32.5c-1.3 1.9 1.2 4.2 3 2.6L74.9 19c.5-.4 1.2-.1 1.2.6v50.3c0 .7-.9 1-1.3.5l-56-67C17 1.2 14.4 0 11.5 0h-2C4.3 0 0 4.3 0 9.6v70.8C0 85.7 4.3 90 9.6 90c3.3 0 6.4-1.7 8.2-4.6l18.8-27.9c1.3-1.9-1.2-4.2-3-2.6l-18.5 16c-.5.4-1.2.1-1.2-.6V20.1c0-.7.9-1 1.3-.5l56 67c1.8 2.2 4.5 3.4 7.3 3.4h2c5.3 0 9.6-4.3 9.6-9.6V9.6c0-5.3-4.3-9.6-9.6-9.6-3.4 0-6.5 1.7-8.3 4.6z"></path>
          </svg>
        </a>
      </p>
    </div>
  );
};

export default Home;
