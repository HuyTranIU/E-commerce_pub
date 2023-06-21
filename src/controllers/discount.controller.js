"use strict";

const { SuccessResponse } = require("../core/success.response");
const { DiscountService } = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Discount code created successfully!!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  // Update discount
  updateDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: "Update discount success!!",
      metadata: await DiscountService.updateDisCountCode(
        req.params.discountId,
        { ...req.body }
      ),
    }).send(res);
  };

  getAllDiscountCodesByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Discount code by shop successfully!!",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Discount Amount successfully!!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getDiscountCodesWithProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Discount code with Product successfully!!",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  };

  deleteDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete Discount code successfully!!",
      metadata: await DiscountService.deleteDiscountCode({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
