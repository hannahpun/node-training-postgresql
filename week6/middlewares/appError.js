const appError = (httpStatus, errMsg, next) => {
  const err = new Error(errMsg);
  err.status = httpStatus;
  return err;
};

module.exports = appError;
