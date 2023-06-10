"use strict";

const JWT = require("jsonwebtoken");

const createTokensPair = async (payload, publicKey, privateKey) => {
  try {
    console.log("privateKey AuthUtils::", privateKey);
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 day",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
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
