const jwt = require("jsonwebtoken");
const config = require("../config.json");

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    config.JWTSECRETKEY,
  );
}

function getUser(token) {
  if (!token) {
    return null;
  }
  return jwt.verify(token, config.JWTSECRETKEY);
}

module.exports = {
  setUser,
  getUser,
};
