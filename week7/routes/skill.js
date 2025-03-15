const express = require("express");

const router = express.Router();
const skill = require("../controllers/skill");

router.get("/skill", skill.getAll);

router.post("/skill", skill.post);

router.delete("/skill/:skillId", skill.deleteSkill);

module.exports = router;
