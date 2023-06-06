const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

// init middlewares
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());

// init db

// init router
app.get("/", (req, res, next) => {
  const str = "Helllo Nodejs";
  return res.status(200).json({
    message: "success",
    metadata: str.repeat(1000000),
  });
});

// handling error

module.exports = app;
