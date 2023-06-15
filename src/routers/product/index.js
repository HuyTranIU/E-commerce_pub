"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = express.Router();

// Check Authentication
router.use(authenticationV2);

router.post("/product", asyncHandler(productController.createProduct));

module.exports = router;
