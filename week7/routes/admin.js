const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const admin = require("../controllers/admin");
const isCoach = require("../middlewares/isCoach");
const config = require("../config/index");
const auth = require("../middlewares/auth")({
  secret: config.get("secret").jwtSecret,
  userRepository: dataSource.getRepository("User"),
});

router.post("/coaches/courses", auth, isCoach, admin.postCourse);

router.put(
  "/coaches/courses/:courseId",
  auth,
  isCoach,
  admin.putCoachCourseDetail
);

router.post("/coaches/:userId", admin.postCoach);

module.exports = router;
