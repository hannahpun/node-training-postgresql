const express = require("express");
const router = express.Router();
const creditPackage = require("../controllers/creditPackage");

router.get("/", creditPackage.getAll);

router.post("/", creditPackage.post);

router.delete("/:creditPackageId", creditPackage.deletePackage);

module.exports = router;
