"use strict";

const { Create, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Get token success!!",
      metadata: await AccessService.handlerRefreshToken(req.refreshToken),
    }).send(res);
  };

  handleRefreshTokenV2 = async (req, res, next) => {
    new SuccessResponse({
      message: "Get token success!!",
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout Success!!",
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    console.log(`[P]::signUp::`, req.body);
    new Create({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
