const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(400).send({ message: err.message });
};

export default errorHandler;
