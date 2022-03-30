const moment = require("moment");

const timestampToDateString = (timestamp) => {
  const tsDate = timestamp.toDate();
  const dateString = moment(tsDate).locale("de").format("dddd, Do MMMM YYYY");
  return dateString;
};

module.exports = { timestampToDateString };
