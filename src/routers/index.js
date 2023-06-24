"use strict";

const express = require("express");
const { apiKey, checkPermission } = require("../auth/checkAuth");
const router = express.Router();

// Check apiKey
router.use(apiKey);

// // Check premissions
router.use(checkPermission("0000"));

router.use("/checkout", require("./checkout"));

router.use("/discount", require("./discount"));
router.use("/inventory", require("./inventory"));
router.use("/cart", require("./cart"));
router.use("/product", require("./product"));
router.use("", require("./access"));

module.exports = router;
