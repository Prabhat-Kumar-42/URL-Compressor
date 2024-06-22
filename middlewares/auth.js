const { getUser } = require("../service/user");

// utility
function redirectTOLogin(res) {
  return res.status(401).render("login", {
    status: false,
    msg: "login requierd",
  });
}
function AuthenticatedLoginOnly(req, res, next) {
  const sessionID = req.cookie?.sessionID;
  if (!sessionID) {
    return redirectTOLogin(res);
  }
  const user = getUser(sessionID);
  if (!user) {
    return redirectTOLogin(res);
  }
  req.user = user;
  next();
}

function checkAuth(req, res, next) {
  const sessionID = req.cookies?.sessionID;
  const user = getUser(sessionID);
  req.user = user;
  next();
}

module.exports = {
  AuthenticatedLoginOnly,
  checkAuth,
};
