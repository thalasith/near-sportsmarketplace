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
    <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-black mb-3">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start text-white">
          NBA Sports Marketplace
        </div>
        <button
          className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
          type="button"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          Menu
        </button>
        <div
          className={
            "lg:flex flex-grow items-center" +
            (navbarOpen ? " flex" : " hidden")
          }
          id="example-navbar-danger"
        >
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
            <li className="nav-item">
              <a
                className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                href="/"
              >
                <span className="ml-2">Open Bets</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                href="/users_bets"
              >
                <span className="ml-2">Your Bets</span>
              </a>
            </li>
            <li className="nav-item">
              <div className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
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
