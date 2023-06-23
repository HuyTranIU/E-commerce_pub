"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();

router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.deleteItem));
router.post("/update", asyncHandler(cartController.update));
router.get("", asyncHandler(cartController.getListCart));

module.exports = router;
