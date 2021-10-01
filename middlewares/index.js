const authMiddleware = require("./authMiddleware");
const adminMiddleware = require("./adminMiddleware");
const adminOrSelfMiddleware = require("./adminOrSelfMiddleware");

module.exports = { authMiddleware, adminMiddleware, adminOrSelfMiddleware };
