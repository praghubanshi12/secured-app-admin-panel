const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.ROLES = ["ADMIN", "SUBSCRIBER"];
module.exports = db;
