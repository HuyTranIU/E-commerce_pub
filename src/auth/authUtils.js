"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.reponse");
const { findByUserId } = require("../services/keyToken.service");

const HEADERS = {
  API_KEY: "x-api-key",
  CLINET_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
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
  if (!userId) throw new AuthFailureError("Invalida Request x-client-id!!");

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found KeyStore!!");

  const accessToken = req.headers[HEADERS.AUTHORIZATION];
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

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
  	1. Check userId missing?
    2. get accessToken
    3. VerifyToke
    4. Check user in dbs
    5. Check keyStore with this useId
    6. Oke all -> return next()
  */
  const userId = req.headers[HEADERS.CLINET_ID];
  if (!userId) throw new AuthFailureError("Invalida Request x-client-id!!");

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found KeyStore!!");

  const refreshToken = req.headers[HEADERS.REFRESHTOKEN];
  if (refreshToken) {
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid User!!");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const accessToken = req.headers[HEADERS.AUTHORIZATION];
  if (!accessToken)
    throw new AuthFailureError("Invalida Request Authorization!!");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid User!!");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const verifyJwt = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokensPair,
  authentication,
  verifyJwt,
  authenticationV2,
};
