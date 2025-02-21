const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");

const logger = require("../utils/logger")("Skill");
const { isUndefined, isNotValidString } = require("../utils/validators");

router.get("/skill", async (req, res, next) => {
  try {
    const skills = await dataSource.getRepository("Skill").find({
      select: ["id", "name"],
    });

    res.json({
      status: "success",
      data: skills,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.post("/skill", async (req, res, next) => {
  const { name } = req.body;
  try {
    if (isUndefined(name) || isNotValidString(name)) {
      return res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
      });
    }
    const skills = await dataSource.getRepository("Skill");
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
    logger.error(error);
    next(error);
  }
});

router.delete("/skill/:skillId", async (req, res, next) => {
  try {
    const { skillId } = req.params;
    if (isUndefined(skillId) || isNotValidString(skillId)) {
      return res.status(400).json({
        status: "failed",
        message: "ID錯誤",
      });
    }

    const skills = await dataSource.getRepository("Skill");

    const result = await skills.delete(skillId);

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
});

module.exports = router;
