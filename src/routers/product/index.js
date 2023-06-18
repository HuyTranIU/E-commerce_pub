"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchUser)
);
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:product_id", asyncHandler(productController.findProduct));

// Check Authentication
router.use(authenticationV2);

router.post("", asyncHandler(productController.createProduct));
// PUT
router.post(
  "/publish/:id",
  asyncHandler(productController.publistProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublistProductByShop)
);

// QUERY //
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/publish/all",
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
