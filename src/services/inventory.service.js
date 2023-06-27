"use strict";

const { BadRequestError } = require("../core/error.reponse");
const { inventory } = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "11, Nguyen Trai, Ha Noi",
  }) {
    const product = await getProductById(productId);
    if (!product) {
      throw new BadRequestError("The product does not exists!!");
    }

    const query = {
      inven_shopId: shopId,
      inven_productId: productId,
    };
    const updateSet = {
      $inc: {
        inven_stock: stock,
      },
      $set: {
        inven_location: location,
      },
    };
    const option = { upsert: true, new: true };

    return await inventory.findOneAndUpdate(query, updateSet, option);
  }

  /**
   * Query Orders [User]
   */
  static async getOrdersByUser() {}

  /**
   * Query Order using ID [User]
   */
  static async getOneOrdersByUser() {}

  /**
   * Cancel Orders [User]
   */
  static async cancelOrderByUser() {}

  /**
   * Update Order Status [Admin | Shop]
   */
  static async updateOrdersStatusByShop() {}
}

module.exports = InventoryService;
