const { URL } = require("../models/urls.js");
const shortid = require("shortid");
const express = require("express");

async function handleCreateShortURLStatic(req, res) {
  const url = req.body.url;
  if (!url) {
    return res.status(400).render("home", {
      status: "failed",
      msg: "url is required",
    });
  }
  try {
    const shortUrl = shortid();
    const result = await URL.create({
      url: url,
      shortUrl: shortUrl,
      visitHistory: [],
    });
    console.log("Created Successfully");
    console.log(result);
    return res.status(201).render("home", {
      id: shortUrl,
    });
  } catch (err) {
    return res.status(500).render("home", {
      status: "false",
      msg: "something went wrong",
    });
  }
}

async function handleAnalyticsStatic(req, res) {
  const shortUrl = req.query.shortUrl;
  if (!shortUrl) {
    const result = await URL.find();
    for (documents of result) {
      const numOfUrlHits = documents.visitHistory.length;
      documents.numOfUrlHits = numOfUrlHits;
    }
    return res.render("home", {
      urls: result,
    });
  }
  try {
    const result = await URL.findOne({ shortUrl: shortUrl });
    if (!result) {
      return res.status(400).render("home", {
        status: "failed",
        msg: "invalid url",
      });
    }
    const numOfUrlHits = result.visitHistory.length;
    result.numOfUrlHits = numOfUrlHits;
    const urls = [result];
    return res.status(200).render("home", {
      urls: urls,
    });
  } catch (err) {
    return res.status(500).render("home", {
      status: "failed",
      msg: "something went wrong",
    });
  }
}

module.exports = {
  handleCreateShortURLStatic,
  handleAnalyticsStatic,
};
