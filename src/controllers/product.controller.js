"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create product success!!",
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // PUT
  publistProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish by shop success!!",
      metadata: await ProductFactory.publishProductShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublistProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish by shop success!!",
      metadata: await ProductFactory.unPublishProductShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // QUERY
  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @returns {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Drafts success!!",
      metadata: await ProductFactory.findAllDraftsForshop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Publish success!!",
      metadata: await ProductFactory.findAllPublishForshop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search User success!!",
      metadata: await ProductFactory.searchProductsUser(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list findAllProducts success!!",
      metadata: await ProductFactory.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list findProduct success!!",
      metadata: await ProductFactory.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  // End Query
}

module.exports = new ProductController();
