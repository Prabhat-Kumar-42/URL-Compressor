const express = require("express");
const router = express.Router();
const { handleCreateShortURL } = require("../controllers/urls.js");

router.route("/").post(handleCreateShortURL);

module.exports = router;
