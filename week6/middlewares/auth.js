const jwt = require("jsonwebtoken");
const appError = require("./appError");

const verifyJWT = (token, secret) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });

module.exports = ({ secret, userRepository }) => {
  if (!secret) {
    throw new Error("secret is required");
  }
  if (!userRepository) {
    throw new Error("userRepository is required");
  }
  return async (req, res, next) => {
    if (
      !req.headers ||
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return next(appError(401, "請先登入"));
    }

    const [, token] = req.headers.authorization.split(" ");
    if (!token) {
      next(appError(401, "請先登入"));
      return;
    }
    try {
      const verifyResult = await verifyJWT(token, secret);
      console.log("verifyResult: ", verifyResult);
      const user = await userRepository.findOneBy({
        id: verifyResult.id,
      });

      if (!user) {
        next(appError(404, "No user found."));
      }
      req.user = user;
      next();
    } catch (err) {
      return next(err);
    }
  };
};
