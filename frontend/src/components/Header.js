import { useState } from "react";
import * as nearAPI from "near-api-js";
import { GiHamburgerMenu, GiBasketballBall } from "react-icons/gi";
const {
  utils: {
    format: { formatNearAmount },
  },
} = nearAPI;

const Header = ({ currentUser, signIn, signOut }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const logout = <button onClick={signOut}>LOGOUT</button>;

  const login = <button onClick={signIn}>LOGIN</button>;

  return (
    <nav className="relative mb-3 flex flex-wrap items-center justify-between bg-blue-500 px-2 py-3">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4">
        <a
          href="/"
          className="flex flex-row rounded-full text-2xl font-bold  text-white"
          // className=" flex w-full flex-row text-2xl font-bold text-white lg:static lg:block lg:w-auto lg:justify-start"
        >
          <GiBasketballBall className="mt-1 mr-1" color="EA8500" />{" "}
          DecentraHoops
        </a>
        <button
          className="block cursor-pointer rounded border border-solid border-transparent bg-transparent px-3 py-1 text-xl leading-none text-white outline-none focus:outline-none lg:hidden"
          type="button"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          <GiHamburgerMenu />
        </button>

        <div
          className={
            "flex-grow items-center lg:flex" +
            (navbarOpen ? " flex flex-col" : " hidden")
          }
        >
          <ul className="list-reset flex flex-col lg:ml-auto lg:flex-row">
            <li className="nav-item">
              <a
                className="flex items-center justify-end rounded-full px-3 py-2 text-xs font-bold uppercase leading-snug text-white hover:bg-blue-700"
                href="/games"
              >
                Games
              </a>
            </li>
            <li className="nav-item">
              <a
                className="flex items-center rounded-full px-3 py-2 text-xs font-bold uppercase leading-snug text-white hover:bg-blue-700 hover:opacity-75"
                href="/open_bets"
              >
                Open Bets
              </a>
            </li>
            <li className="nav-item">
              <a
                className="flex items-center rounded-full px-3 py-2 text-xs font-bold uppercase leading-snug text-white hover:bg-blue-700"
                href="/users_bets"
              >
                Your Bets
              </a>
            </li>
          </ul>

          <ul className="flex list-none flex-col justify-end px-3 lg:ml-auto lg:flex-row lg:px-0">
            <li className="nav-item">
              <div className="flex items-center px-3 py-2 text-xs font-bold uppercase leading-snug text-white  lg:pl-1">
                {currentUser
                  ? "Your Balance: " + formatNearAmount(currentUser.balance, 2)
                  : ""}{" "}
                N
              </div>
            </li>
            <li className="nav-item">
              <div className="flex items-center py-2 pr-3 text-xs font-bold uppercase leading-snug text-white hover:opacity-75">
                {currentUser ? logout : login}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
