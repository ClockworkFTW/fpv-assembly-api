import config from "../config/variables.js";

const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(400).end();
};

export default errorHandler;
