const { URL } = require("../models/urls.js");
const shortid = require("shortid");
const express = require("express");

async function handleCreateShortURLStatic(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).render("login", {
      status: false,
      msg: "login required",
    });
  }
  const url = req.body.url;
  if (!url) {
    return res.status(400).render("home", {
      status: false,
      msg: "url is required",
    });
  }
  try {
    const shortUrl = shortid();
    const userID = user._id;
    const result = await URL.create({
      url: url,
      shortUrl: shortUrl,
      visitHistory: [],
      createdBy: userID,
    });
    console.log("Created Successfully");
    console.log(result);
    return res.status(201).render("home", {
      id: shortUrl,
    });
  } catch (err) {
    return res.status(500).render("home", {
      status: false,
      msg: "something went wrong",
    });
  }
}

async function handleAnalyticsStatic(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).render("login", {
      status: false,
      msg: "login required",
    });
  }
  const shortUrl = req.query.shortUrl;
  const userID = user._id;
  if (!shortUrl) {
    const result = await URL.find({ createdBy: userID });
    for (documents of result) {
      const numOfUrlHits = documents.visitHistory.length;
      documents.numOfUrlHits = numOfUrlHits;
    }
    return res.render("home", {
      urls: result,
    });
  }
  try {
    const result = await URL.findOne({ shortUrl: shortUrl, createdBy: userID });
    if (!result) {
      return res.status(400).render("home", {
        status: false,
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
      status: false,
      msg: "something went wrong",
    });
  }
}

module.exports = {
  handleCreateShortURLStatic,
  handleAnalyticsStatic,
};
