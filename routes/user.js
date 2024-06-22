const express = require("express");
const router = express.Router();

const { handleUserSignup, handleUserLogin } = require("../controllers/user.js");

router.route("/signup").post(handleUserSignup);
router.route("/login").post(handleUserLogin);

module.exports = router;
