const validator = require("validator");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateJWT");
const { dataSource } = require("../db/data-source");
const appError = require("../middlewares/appError");
const config = require("../config/index");
const logger = require("../utils/logger")("User");
const { isUndefined } = require("../utils/validators");

const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}/;

const postSignup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;

  if (!name || !email || !password) {
    return next(appError(400, "請確保所有欄位皆填寫"));
  }

  if (!validator.matches(password, passwordPattern)) {
    return next(
      appError(
        400,
        "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"
      )
    );
  }
  try {
    const users = await dataSource.getRepository("User");

    const existUser = await users.findOne({
      where: {
        email,
      },
    });

    if (existUser) {
      logger.warn("建立使用者錯誤: Email 已被使用");
      return next(appError(409, "Email 已被使用"));
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
};

const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    logger.warn("欄位未填寫正確");
    return next(appError(400, "欄位未填寫正確"));
  }
  if (!validator.matches(password, passwordPattern)) {
    return next(
      appError(
        400,
        "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"
      )
    );
  }
  try {
    const userRepository = dataSource.getRepository("User");
    const existingUser = await userRepository.findOne({
      select: ["id", "name", "password"],
      where: { email },
    });

    if (!existingUser) {
      return next(appError(400, "使用者不存在或密碼輸入錯誤"));
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return next(appError(400, "使用者不存在或密碼輸入錯誤"));
    }
    const token = await generateJWT(
      {
        id: existingUser.id,
      },
      config.get("secret.jwtSecret"),
      {
        expiresIn: `${config.get("secret.jwtExpiresDay")}`,
      }
    );

    res.status(201).json({
      status: "success",
      data: {
        token,
        user: {
          name: existingUser.name,
        },
      },
    });
  } catch (error) {
    logger.error("登入錯誤:", error);
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const userRepository = dataSource.getRepository("User");
    const user = await userRepository.findOne({
      select: ["name", "email", "role"],
      where: { id },
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    logger.error("取得使用者資料錯誤:", error);
    next(error);
  }
};

const putProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name } = req.body;
    if (isUndefined(name) || isNotValidSting(name)) {
      logger.warn("欄位未填寫正確");
      res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
      });
      return;
    }
    const userRepository = dataSource.getRepository("User");
    const user = await userRepository.findOne({
      select: ["name"],
      where: {
        id,
      },
    });
    if (user.name === name) {
      res.status(400).json({
        status: "failed",
        message: "使用者名稱未變更",
      });
      return;
    }
    const updatedResult = await userRepository.update(
      {
        id,
        name: user.name,
      },
      {
        name,
      }
    );
    if (updatedResult.affected === 0) {
      res.status(400).json({
        status: "failed",
        message: "更新使用者資料失敗",
      });
      return;
    }
    const result = await userRepository.findOne({
      select: ["name"],
      where: {
        id,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        user: result,
      },
    });
  } catch (error) {
    logger.error("取得使用者資料錯誤:", error);
    next(error);
  }
};

module.exports = {
  postSignup,
  postLogin,
  getProfile,
  putProfile,
};
