const sessionsToUserMap = new Map();

function setUser(sessionID, user) {
  sessionsToUserMap[sessionID] = user;
}

function getUser(sessionID) {
  return sessionsToUserMap[sessionID];
}

module.exports = {
  setUser,
  getUser,
};
