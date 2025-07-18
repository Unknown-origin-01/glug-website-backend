const express = require("express");
const memberController = require("./../controllers/memberController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.route("/").get(authController.protect, memberController.getAllMembers);

module.exports = router;
