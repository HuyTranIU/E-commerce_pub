"use strict";

const { SuccessResponse } = require("../core/success.response");
const cartService = require("../services/cart.service");

class CartController {
  // Create
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new cart success!!",
      metadata: await cartService.addToCart(req.body),
    }).send(res);
  };

  //   Update + -
  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Update count cart success!!",
      metadata: await cartService.updateCountToCart(req.body),
    }).send(res);
  };

  // Delete
  deleteItem = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete cart success!!",
      metadata: await cartService.deleteItemUserCart(req.body),
    }).send(res);
  };

  // Delete
  getListCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list cart success!!",
      metadata: await cartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
