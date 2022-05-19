import moment from "moment";

export const timestampToDateString = (timestamp) => {
  const tsDate = timestamp.toDate();
  const dateString = moment(tsDate).locale("de").format("dddd, Do MMMM YYYY");
  return dateString;
};

export const todayToString = () => {
  const today = new Date(moment().startOf("day")).getTime().toString();
  return today;
};
