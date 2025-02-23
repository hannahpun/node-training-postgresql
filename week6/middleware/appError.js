const PERMISSION_DENIED_STATUS_CODE = 401;
const BAD_REQUEST_STATUS_CODE = 400;

const appError = (httpStatus, errMsg, next) => {
  const err = new Error(errMsg);
  err.status = httpStatus;
  return err;
};

module.exports = appError;
