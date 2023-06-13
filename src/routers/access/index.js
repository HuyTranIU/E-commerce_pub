"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));

// Check Authentication
router.use(authenticationV2);

router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/handlerRefreshToken",
  asyncHandler(accessController.handleRefreshToken)
);
router.post(
  "/shop/handlerRefreshTokenv2",
  asyncHandler(accessController.handleRefreshTokenV2)
);

module.exports = router;
