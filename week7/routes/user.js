const express = require("express");
const router = express.Router();
const { dataSource } = require("../db/data-source");
const config = require("../config/index");
const auth = require("../middlewares/auth")({
  secret: config.get("secret").jwtSecret,
  userRepository: dataSource.getRepository("User"),
});
const users = require("../controllers/user");

router.post("/signup", users.postSignup);

router.post("/login", users.postLogin);

router.get("/profile", auth, users.getProfile);

router.put("/profile", auth, users.putProfile);

module.exports = router;
