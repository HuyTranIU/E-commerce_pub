"use strict";
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 360000;

// Count connection
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log("Number of connections::", numConnection);
};

// Check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    console.log("Active connections::", numConnection);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
    // Example maxinum number of connections based on number of cores
    const maxConnections = numCores * 6;
    if (numConnection > maxConnections) {
      console.log("Connections overload detected!!");
      //   notify.send()
    }
  }, _SECONDS);
};

module.exports = { countConnect, checkOverLoad };
