const months = [
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

  formatDate: function (dateString) {
    const date = new Date(dateString);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime + " on " + months[date.getMonth()] + " " + date.getDate();
  },
};
