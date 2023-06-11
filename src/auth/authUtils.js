"use strict";

const JWT = require("jsonwebtoken");

const createTokensPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 day",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 day",
    });

    // Verift Token
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = {
  createTokensPair,
};
