"use strict";

const mongoose = require("mongoose");

const connectUrl =
  process.env.URI_MONGODB || "mongodb://localhost:27017/shopDEV";

mongoose
  .connect(connectUrl)
  .then((_) => console.log("Connect mongodb success!!"))
  .catch((err) => console.log("Error connect:", err));

if (1 === 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
