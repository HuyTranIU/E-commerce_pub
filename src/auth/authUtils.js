"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.reponse");
const { findByUserId } = require("../services/keyToken.service");

const HEADERS = {
  API_KEY: "x-api-key",
  CLINET_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

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

const authentication = asyncHandler(async (req, res, next) => {
  /*
  	1. Check userId missing?
    2. get accessToken
    3. VerifyToke
    4. Check user in dbs
    5. Check keyStore with this useId
    6. Oke all -> return next()
  */
  const userId = req.headers[HEADERS.CLINET_ID];
  console.log("userId::", userId);
  if (!userId) throw new AuthFailureError("Invalida Request x-client-id!!");

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found KeyStore!!");

  const accessToken = req.headers[HEADERS.AUTHORIZATION];
  console.log("accessToken::", req.headers[HEADERS.AUTHORIZATION]);
  if (!accessToken)
    throw new AuthFailureError("Invalida Request Authorization!!");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid User!!");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log(error);
    throw error;
  }
});

module.exports = {
  createTokensPair,
  authentication,
};
