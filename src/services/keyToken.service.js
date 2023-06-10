"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString(); // publicKey được tạo bởi thuật toán bất đối xứng nên có dạng là Buffer nên chuyển thành toString mới cớ thể lưu vào trong database
      console.log("publicKeyString KeyTokenService::", publicKeyString);
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
