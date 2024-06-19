const express = require("express");
const router = express.Router();
const {
  handleCreateShortURL,
  handleAnalytics,
} = require("../controllers/urls.js");

router.route("/").post(handleCreateShortURL);
router.route("/analytics/:shortUrl?").get(handleAnalytics);

module.exports = router;
