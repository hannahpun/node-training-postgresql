require("dotenv").config();
const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
app.use(bodyParser.json());

const AppDataSource = require("./db");

// Validation functions
function isUndefined(value) {
  return value === undefined;
}

function isNotValidString(value) {
  return typeof value !== "string" || value.trim().length === 0 || value === "";
}

function isNotValidInteger(value) {
  return typeof value !== "number" || value < 0 || value % 1 !== 0;
}

app.get("/api/credit-package", async (req, res) => {
  try {
    const creditPackages = await AppDataSource.getRepository(
      "CreditPackage"
    ).find({
      select: ["id", "name", "price", "credit_amount"],
    });

    res.json({
      status: "success",
      data: creditPackages,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "伺服器錯誤",
    });
  }
});

app.post("/api/credit-package", async (req, res) => {
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
    const creditPackages = await AppDataSource.getRepository("CreditPackage");

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
    res.status(500).json({
      status: "error",
      message: "伺服器錯誤",
    });
  }
});

app.delete("/api/credit-package/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isUndefined(id) || isNotValidString(id)) {
      return res.status(400).json({
        status: "failed",
        message: "ID錯誤",
      });
    }

    const creditPackages = await AppDataSource.getRepository("CreditPackage");

    const result = await creditPackages.delete(id);

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
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "伺服器錯誤",
    });
  }
});

app.get("/api/coaches/skill", async (req, res) => {
  try {
    const skills = await AppDataSource.getRepository("Skill").find({
      select: ["id", "name"],
    });

    res.json({
      status: "success",
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "伺服器錯誤",
    });
  }
});

app.post("/api/coaches/skill", async (req, res) => {
  const { name } = req.body;
  try {
    if (isUndefined(name) || isNotValidString(name)) {
      return res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
      });
    }
    const skills = await AppDataSource.getRepository("Skill");
    const existSkills = await skills.find({
      where: {
        name,
      },
    });
    if (existSkills.length > 0) {
      return res.status(409).json({
        status: "failed",
        message: "資料重複",
      });
    }

    const newSkill = await skills.create({
      name,
    });

    const result = await skills.save(newSkill);

    res.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "伺服器錯誤",
    });
  }
});

app.delete("/api/coaches/skill/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isUndefined(id) || isNotValidString(id)) {
      return res.status(400).json({
        status: "failed",
        message: "ID錯誤",
      });
    }

    const skills = await AppDataSource.getRepository("Skill");

    const result = await skills.delete(id);

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
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "伺服器錯誤",
    });
  }
});

async function startServer() {
  await AppDataSource.initialize();
  console.log("資料庫連接成功");
  app.listen(process.env.PORT);
  console.log(`伺服器啟動成功, port: ${process.env.PORT}`);
  // return app;
}

module.exports = startServer();
