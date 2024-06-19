const { URL } = require("../models/urls.js");
const shortid = require("shortid");
const express = require("express");

async function handleCreateShortURL(req, res) {
  const url = req.body.url;
  if (!url) {
    return res.status(400).json({
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
    return res.status(201).json({
      status: "success",
      url: result.shortUrl,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      msg: "something went wrong",
    });
  }
}

async function handleAnalytics(req, res) {
  const shortUrl = req.params.shortUrl;
  if (!shortUrl) {
    const result = await URL.find();
    for (documents of result) {
      const numOfUrlHits = documents.visitHistory.length;
      documents.numOfUrlHits = numOfUrlHits;
    }
    return res.status(200).json({
      status: "success",
      urls: result,
    });
  }
  try {
    const result = await URL.findOne({ shortUrl: shortUrl });
    if (!result) {
      return res.status(400).json({
        status: "failed",
        msg: "invalid url",
      });
    }
    const numOfUrlHits = result.visitHistory.length;
    result.numOfUrlHits = numOfUrlHits;
    return res.status(200).json({
      status: "success",
      urlInfo: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      msg: "something went wrong",
    });
  }
}

module.exports = {
  handleCreateShortURL,
  handleAnalytics,
};
