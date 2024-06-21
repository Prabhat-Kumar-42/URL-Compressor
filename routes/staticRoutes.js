const express = require("express");
const router = express.Router();

const {
  handleCreateShortURLStatic,
  handleAnalyticsStatic,
} = require("../controllers/urlsStatic.js");

router
  .route("/")
  .get((req, res) => {
    return res.status(200).render("home");
  })
  .post(handleCreateShortURLStatic);

router.route("/analytics/:shortUrl?").get(handleAnalyticsStatic);

module.exports = router;
