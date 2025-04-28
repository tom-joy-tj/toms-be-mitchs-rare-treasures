const data = require("./data/dev-data");
const seed = require("./seed");

const db = require("./connection.js");

seed(data).then(() => db.end());
