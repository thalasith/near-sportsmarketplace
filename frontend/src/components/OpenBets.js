import React, { useState, useEffect } from "react";
import * as nearAPI from "near-api-js";
import Big from "big.js";
const {
  utils: {
    format: { formatNearAmount },
  },
} = nearAPI;
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const OpenBets = ({ currentUser, contract }) => {
  const [openBets, setOpenBets] = useState([]);

  useEffect(() => {
    const getBets = async () => {
      const allOpenBets = await contract.get_all_open_bets();
      setOpenBets(allOpenBets);
    };
    getBets();
  }, [contract, currentUser]);

  const acceptBet = async (betId, deposit) => {
    await contract.accept_bet_index({ id: betId }, BOATLOAD_OF_GAS, deposit);
    const newOpenBets = openBets.filter((bet) => bet.id !== betId);
    setOpenBets(newOpenBets);
  };
  return (
    <div>
      <h1>Bets Component</h1>
      <table>
        <thead>
          <tr>
            <th>Bet ID</th>
            <th>Market Maker</th>
            <th>Bet Amount</th>
            <th>Market maker Team</th>
            <th>Betting Team</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {openBets.map((bet) => (
            <tr key={bet.id}>
              <td>{bet.id}</td>
              <td>{bet.market_maker_id}</td>
              <td>{formatNearAmount(bet.better_deposit)} N</td>
              <td>{bet.market_maker_team}</td>
              <td>{bet.bidder_team}</td>
              <td>
                <button
                  className="mx-1 px-1 rounded-md bg-gray-600 text-white"
                  onClick={() => acceptBet(bet.id, bet.better_deposit)}
                >
                  Accept
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  //     <div>
  //     <h1>Bets Component</h1>
  //     <table>
  //       <thead>
  //         <tr>
  //           <th>Bet ID</th>
  //           <th>Market Maker</th>
  //           <th>Bet Amount</th>
  //           <th>Market maker Team</th>
  //           <th>Betting Team</th>
  //           <th> </th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {openBets.map((bet) => (
  //           <tr key={bet.id}>
  //             <td>{bet.id}</td>
  //             <td>{bet.market_maker_id}</td>
  //             <td>{formatNearAmount(bet.better_deposit)} N</td>
  //             <td>{bet.market_maker_team}</td>
  //             <td>{bet.bidder_team}</td>
  //             <td>
  //               <button
  //                 className="mx-1 px-1 rounded-md bg-gray-600 text-white"
  //                 onClick={() => acceptBet(bet.id, bet.better_deposit)}
  //               >
  //                 Accept
  //               </button>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>;
};

export default OpenBets;
