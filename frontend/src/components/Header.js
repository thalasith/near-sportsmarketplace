import { useState } from "react";
import * as nearAPI from "near-api-js";
const {
  utils: {
    format: { formatNearAmount },
  },
} = nearAPI;

const Header = ({ currentUser, signIn, signOut }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const logout = (
    <div>
      {currentUser ? currentUser.accountId : ""}
      {currentUser ? formatNearAmount(currentUser.balance, 2) : ""} N
      <button onClick={signOut}>LOGOUT</button>
    </div>
  );

  const login = <button onClick={signIn}>LOGIN</button>;

  return (
    <nav className="relative mb-3 flex flex-wrap items-center justify-between bg-black px-2 py-3">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4">
        <div className="relative flex w-full justify-between text-white lg:static lg:block lg:w-auto lg:justify-start">
          NBA Sports Marketplace
        </div>
        <button
          className="block cursor-pointer rounded border border-solid border-transparent bg-transparent px-3 py-1 text-xl leading-none text-white outline-none focus:outline-none lg:hidden"
          type="button"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          Menu
        </button>
        <div
          className={
            "flex-grow items-center lg:flex" +
            (navbarOpen ? " flex" : " hidden")
          }
          id="example-navbar-danger"
        >
          <ul className="flex list-none flex-col lg:ml-auto lg:flex-row">
            <li className="nav-item">
              <a
                className="flex items-center px-3 py-2 text-xs font-bold uppercase leading-snug text-white hover:opacity-75"
                href="/games"
              >
                <span className="ml-2">Games</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="flex items-center px-3 py-2 text-xs font-bold uppercase leading-snug text-white hover:opacity-75"
                href="/open_bets"
              >
                <span className="ml-2">Open Bets</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="flex items-center px-3 py-2 text-xs font-bold uppercase leading-snug text-white hover:opacity-75"
                href="/users_bets"
              >
                <span className="ml-2">Your Bets</span>
              </a>
            </li>
            <li className="nav-item">
              <div className="flex items-center px-3 py-2 text-xs font-bold uppercase leading-snug text-white hover:opacity-75">
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
