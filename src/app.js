const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { checkOverLoad } = require("./helpers/check.connect");
const router = require("./routers");
require("dotenv").config();
const app = express();

// init middlewares
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
require("./dbs/init.mongodb");
checkOverLoad();

// init router
app.use("", router);

// handling error

module.exports = app;
