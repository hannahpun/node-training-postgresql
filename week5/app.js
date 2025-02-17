const express = require("express");
const cors = require("cors");
const path = require("path");
const pinoHttp = require("pino-http");
const bodyParser = require("body-parser");

const logger = require("./utils/logger")("App");
const creditPackageRouter = require("./routes/creditPackage");
const skill = require("./routes/skill");
const user = require("./routes/user");
const admin = require("./routes/admin");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        req.body = req.raw.body;
        return req;
      },
    },
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/credit-package", creditPackageRouter);
app.use("/api/coaches", skill);
app.use("/api/users", user);
app.use("/api/admin", admin);
app.get("/error", (req, res, next) => {
  next(new Error("新增一個執行錯誤!"));
});

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "not found",
  });
});

app.use((err, req, res, next) => {
  req.log.error(err);
  res.status(500).json({
    status: "error",
    message: "伺服器錯誤",
  });
});

module.exports = app;
