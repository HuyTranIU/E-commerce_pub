"use strict";

const express = require("express");
const { apiKey, checkPermission } = require("../auth/checkAuth");
const router = express.Router();

// Check apiKey
router.use(apiKey);

// Check premissions
router.use(checkPermission("0000"));

router.use("", require("./access"));
router.use("", require("./product"));

module.exports = router;
