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

  const logout = (
    <button onClick={signOut} className="uppercase">
      Disconnect Your Wallet
    </button>
  );

  const login = (
    <button onClick={signIn} className="uppercase">
      Connect Your Near Wallet
    </button>
  );

  return (
    <nav className="relative mb-3 flex flex-wrap items-center justify-between bg-blue-500 px-2 py-3">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4">
        <a
          href="/"
          className="flex flex-row rounded-full text-2xl font-bold  text-white hover:text-orange-500"
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
          <ul
            className={
              "list-reset flex w-full flex-col justify-end justify-items-stretch lg:ml-auto lg:w-1/3  lg:flex-row"
            }
          >
            <li className="nav-item ">
              <a
                className="grid rounded-full px-3 py-2 text-right text-xs font-bold uppercase leading-snug text-white hover:bg-blue-700 lg:text-center"
                href="/games"
              >
                Games
              </a>
            </li>
            <li className="nav-item">
              <a
                className="grid rounded-full px-3 py-2 text-right text-xs font-bold uppercase leading-snug text-white hover:bg-blue-700 lg:text-center"
                href="/open_bets"
              >
                Open Bets
              </a>
            </li>
            <li className="nav-item">
              <a
                className="grid rounded-full px-3 py-2 text-right text-xs font-bold uppercase leading-snug text-white hover:bg-blue-700 lg:text-center"
                href="/users_bets"
              >
                Your Bets
              </a>
            </li>
          </ul>

          <ul className="flex list-none flex-col justify-end px-3 lg:ml-auto lg:flex-row lg:px-0">
            <li className="nav-item">
              <div className="mt-2 flex items-center px-3 py-2 text-xs font-bold uppercase leading-snug text-white lg:mt-0">
                {currentUser
                  ? "Your Balance: " +
                    formatNearAmount(currentUser.balance, 2) +
                    " NEAR"
                  : ""}
              </div>
            </li>
            <li className="nav-item">
              <div className="mt-2 grid border-separate items-center rounded-lg border-2 bg-white px-3 py-1 text-xs font-bold uppercase leading-snug text-blue-500 hover:bg-gray-200 lg:mt-0.5">
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
