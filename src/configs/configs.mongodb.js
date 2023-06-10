"use strict";

const dotenv = process.env;
const dev = {
  app: {
    port: dotenv.DEV_APP_PORT || 3055,
    type: "dev",
  },
  db: {
    uri: dotenv.URI_MONGODB_DEV || "mongodb://localhost:27017/shopDEV",
  },
};

const production = {
  app: {
    port: dotenv.PROD_APP_PORT || 3046,
    type: "Production",
  },
  db: {
    uri: dotenv.URI_MONGODB_PRO || "mongodb://localhost:27017/shopPRO",
  },
};

const config = { dev, production };
const env = dotenv.NODE_ENV || "dev";
console.log(config[env], env);
module.exports = config[env];
