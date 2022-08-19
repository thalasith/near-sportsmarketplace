module.exports = {
  americanOddsCalculator: function (amount, total) {
    if (total / amount - 1 >= 2) {
      return (
        "+" +
        ((total / amount - 1) * 100).toLocaleString("en-US", {
          useGrouping: false,
        })
      );
    } else {
      return (
        "-" +
        (100 / (total / amount - 1)).toLocaleString("en-US", {
          useGrouping: false,
        })
      );
    }
  },

  payOutFromAmericanOdds: function (amount, odds) {
    if (odds > 0) {
      return (odds / 100 + 1) * amount;
    } else {
      return (100 / -odds + 1) * amount;
    }
  },
};
