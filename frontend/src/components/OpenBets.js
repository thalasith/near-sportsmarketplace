import React, { useState, useEffect } from "react";
import * as nearAPI from "near-api-js";
import Big from "big.js";
const {
  utils: {
    format: { formatNearAmount, parseNearAmount },
  },
} = nearAPI;
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return (
    date.getMonth() +
    1 +
    "/" +
    date.getDate() +
    "/" +
    date.getFullYear() +
    "  " +
    strTime
  );
};

const OpenBets = ({ currentUser, contract }) => {
  const [openBets, setOpenBets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const getBets = async () => {
      const allOpenBets = await contract.get_all_open_bets();
      console.log("allOpenBets", allOpenBets);
      setOpenBets(allOpenBets);
    };
    getBets();
  }, [contract, currentUser]);

  const acceptBet = async (betId, deposit) => {
    try {
      await contract.accept_bet_index({ id: betId }, BOATLOAD_OF_GAS, deposit);
      const newOpenBets = openBets.filter((bet) => bet.id !== betId);
      setOpenBets(newOpenBets);
    } catch (error) {
      alert("You have to login first!");
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold">All Open Bets Below</h1>
    </div>
  );
};

export default OpenBets;
