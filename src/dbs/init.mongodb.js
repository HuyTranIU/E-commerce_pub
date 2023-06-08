"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    const connectUrl =
      process.env.URI_MONGODB || "mongodb://localhost:27017/shopDEV"; // Thay đổi URI kết nối tới MongoDB tại đây
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectUrl, options)
      .then(() => {
        countConnect();
        console.log("Connected to MongoDB Success Pro!!");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
