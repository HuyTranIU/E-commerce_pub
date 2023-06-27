"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokensPair, verifyJwt } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.reponse");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "00001",
  WRITER: "00002",
  EDITOR: "00003",
  ADMIN: "00004",
};

class AccessService {
  static handlerRefreshToken = async (refreshToken) => {
    // Check token này đã được sử dụng chưa
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    console.log("find foundToken::", foundToken);
    if (foundToken) {
      const { userId, email } = await verifyJwt(
        refreshToken,
        foundToken.privateKey
      );
      console.log("Decode [1]::", { userId, email });
      // Xóa tất cả token trong keyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happend!! Please relogin");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop not registered 1!!");
    console.log("Find holderToken::", holderToken);

    // verifyToken
    const { userId, email } = await verifyJwt(
      refreshToken,
      holderToken.privateKey
    );
    console.log("Decode [2]::", { userId, email });
    // Check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not register 2!!");

    // Tạo cặp tokens mới
    const tokens = await createTokensPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // Update lại token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken, // thêm refresh đã được sử dụng để lấy token mới
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happend!! Please relogin");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Shop not registered 1!!");
    }

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not register 2!!");

    // Tạo cặp tokens mới
    const tokens = await createTokensPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // Update lại token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken, // thêm refresh đã được sử dụng để lấy token mới
      },
    });

    return {
      user,
      tokens,
    };
  };

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    // 1. Check email in dbs
    const foundShop = await findByEmail({ email });
    console.log("foundShop::", foundShop);
    if (!foundShop) throw new BadRequestError("Shop not Registered!!");

    // 2. Check password
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Authentication Error!!");
    }

    const { _id: userId } = foundShop;
    // 3. Tạo privateKey và publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    // 4. Tạo access token và refresh token
    const tokens = await createTokensPair(
      { userId, email },
      publicKey,
      privateKey
    );

    // 5. Lưu vào trong dbs
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const hodlerShop = await shopModel.findOne({ email }).lean();
    console.log("hodlerShop::", hodlerShop);
    if (hodlerShop) {
      throw new BadRequestError("Error: Shop already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      console.log({ privateKey, publicKey });

      // Lưu userId và publicKey vào trong db
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: Create KeyStore failed!!");
      }
      // Tạo ra cặp access token và refresh token cho shop
      const tokens = await createTokensPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log("Create tokens success::", tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
