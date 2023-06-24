"use strict";

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  addStockToInvenTory = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Add stock Inventory success!!",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
