const express = require("express");
const router = express.Router();
const course = require("../controllers/course");

router.get("/", course.getAll);

module.exports = router;
