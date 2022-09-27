const errorHandler = (err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode ?? 400;
  res.status(statusCode).send({ message: err.message });
};

export default errorHandler;
