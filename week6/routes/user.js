const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const { dataSource } = require("../db/data-source");

const logger = require("../utils/logger")("User");
const { isUndefined, isNotValidString } = require("../utils/validators");

router.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  try {
    const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}/;
    if (
      isUndefined(name) ||
      isNotValidString(name) ||
      isUndefined(email) ||
      isNotValidString(email) ||
      isUndefined(password) ||
      isNotValidString(password)
    ) {
      logger.warn("欄位未填寫正確");
      return res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
      });
    }

    if (!passwordPattern.test(password)) {
      logger.warn(
        "建立使用者錯誤: 密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"
      );
      return res.status(400).json({
        status: "failed",
        message:
          "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字",
      });
    }

    const users = await dataSource.getRepository("User");

    const existUser = await users.findOne({
      where: {
        email,
      },
    });

    if (existUser) {
      logger.warn("建立使用者錯誤: Email 已被使用");
      return res.status(409).json({
        status: "failed",
        message: "Email 已被使用",
      });
    }

    // create user
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await users.create({
      name,
      email,
      role: "USER",
      password: hashPassword,
    });

    const result = await users.save(newUser);

    return res.json({
      status: "success",
      data: {
        user: {
          id: result.id,
          name: result.name,
        },
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

module.exports = router;
