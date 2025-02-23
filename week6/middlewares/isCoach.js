const appError = require("./appError");

module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== "COACH") {
    next(appError(401, "Permission denied"));
    return;
  }
  next();
};
