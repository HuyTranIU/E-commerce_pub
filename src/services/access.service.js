"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokensPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "00001",
  WRITER: "00002",
  EDITOR: "00003",
  ADMIN: "00004",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const hodlerShop = await shopModel.findOne({ email }).lean();
      console.log("hodlerShop::", hodlerShop);
      if (hodlerShop) {
        return {
          code: "xxx",
          message: "Shop already registered!!",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        // Tạo cặp privateKey, publicKey
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs8",
        //     format: "pem",
        //   },
        // });
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
          return { code: "xxx", message: "Create KeyStore failed!!" };
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
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
