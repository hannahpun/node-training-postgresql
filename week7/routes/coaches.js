const express = require("express");
const router = express.Router();
const coaches = require("../controllers/coaches");

router.get("/", coaches.getAll);

router.get("/:coachId", coaches.getCoachDetail);

module.exports = router;
