const appError = (httpStatus, errMsg, next) => {
  const err = new Error(errMsg);
  err.status = httpStatus;
  error.isOperational = true;
  next(error);
};

module.exports = appError;
