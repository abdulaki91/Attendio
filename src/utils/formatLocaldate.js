import moment from "moment";

const formatLocaldate = (dateStr) => {
  return moment(dateStr).format("ddd MMM D, YYYY");
};

export default formatLocaldate;
