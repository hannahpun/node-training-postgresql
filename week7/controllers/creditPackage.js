const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("CreditPackage");
const {
  isUndefined,
  isNotValidString,
  isNotValidInteger,
} = require("../utils/validators");

const getAll = async (req, res, next) => {
  try {
    const creditPackages = await dataSource
      .getRepository("CreditPackage")
      .find({
        select: ["id", "name", "price", "credit_amount"],
      });

    res.json({
      status: "success",
      data: creditPackages,
    });
  } catch (error) {
    logger.error(error);
    // res.status(500).json({
    //   status: "error",
    //   message: "伺服器錯誤",
    // });
    next(error);
  }
};

const post = async (req, res, next) => {
  try {
    const { name, credit_amount, price } = req.body;
    if (
      isUndefined(name) ||
      isNotValidString(name) ||
      isUndefined(credit_amount) ||
      isNotValidInteger(credit_amount) ||
      isUndefined(price) ||
      isNotValidInteger(price)
    ) {
      return res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
      });
    }
    const creditPackages = await dataSource.getRepository("CreditPackage");

    const existPackages = await creditPackages.find({
      where: {
        name,
      },
    });

    if (existPackages.length > 0) {
      res.status(409).json({
        status: "failed",
        message: "名稱重複",
      });
    }

    const newPackage = await creditPackages.create({
      name,
      credit_amount,
      price,
    });

    const result = await creditPackages.save(newPackage);

    res.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const deletePackage = async (req, res, next) => {
  try {
    const { creditPackageId } = req.params;
    if (isUndefined(creditPackageId) || isNotValidString(creditPackageId)) {
      return res.status(400).json({
        status: "failed",
        message: "ID錯誤",
      });
    }

    const creditPackages = await dataSource.getRepository("CreditPackage");

    const result = await creditPackages.delete(creditPackageId);

    if (result.affected === 0) {
      return res.status(400).json({
        status: "failed",
        message: "ID錯誤",
      });
    }

    return res.json({
      status: "success",
    });
  } catch (err) {
    logger.error(error);
    next(error);
  }
};

module.exports = {
  getAll,
  post,
  deletePackage,
};
