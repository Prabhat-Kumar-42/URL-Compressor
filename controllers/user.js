const { USER } = require("../models/user.js");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const { setUser } = require("../service/user.js");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).render("signup", {
      status: false,
      msg: "name, email and password are requierd field",
    });
  }
  // TODO: need to add strong password checker
  try {
    const user = await USER.create({
      name: name,
      email: email,
      password: password,
    });
    console.log("successfully created");
    console.log(user);
    return res.status(201).render("login", {
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("singup", {
      status: false,
      msg: "server error",
    });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render("login", {
      status: false,
      msg: "email and password are requierd field",
    });
  }
  try {
    const user = await USER.findOne({ email: email, password: password });
    if (!user) {
      return res.status(400).render("login", {
        status: false,
        msg: "wrong email or password",
      });
    }

    const sessionID = uuidv4();
    setUser(sessionID, user);
    res.cookie("sessionID", sessionID);
    return res.status(400).render("home", {
      status: true,
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("login", {
      status: false,
      msg: "server error",
    });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
