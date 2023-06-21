"use strict";

const { BadRequestError } = require("../core/error.reponse");
const { product, clothing, electronic } = require("../models/product.model");
const { inserInventory } = require("../models/repositories/inventory.repo");
const {
  findAllDraftsForshop,
  findAllPublishForshop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const {
  removeObjectUndefinded,
  updateNestedObjectParser,
} = require("../utils");

// Define factory class to create product
class ProductFactory {
  static productRegistry = {};

  static registryProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    console.log("productClass:::", productClass);
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  // static async createProduct(type, payload) {
  //   console.log(`type::${type}`);
  //   switch (type) {
  //     case "Electronics":
  //       return new Electronics(payload).createElectronics();
  //     case "Clothing":
  //       return new Clothing(payload).createClothing();
  //     default:
  //       throw new BadRequestError(`Invalid Product Type ${type}`);
  //   }
  // }

  // PUT
  static async publishProductShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  // END PUT

  // QUERY
  static async findAllDraftsForshop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForshop({ query, limit, skip });
  }

  static async findAllPublishForshop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForshop({ query, limit, skip });
  }

  static async searchProductsUser({ keySearch }) {
    return searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    return findProduct({ product_id, unSelect: ["__v"] });
  }
}

// Define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  //   Create new product
  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      // add product_stock in inventory collection
      await inserInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }

    return newProduct;
  }

  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new Clothing error!!");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct)
      throw new BadRequestError("Create new Product Clothing error!!");

    return newProduct;
  }

  async updateProduct(productId) {
    // 1. Remove attr has undefind, null
    console.log(`[1]::`, this);
    const objectParams = removeObjectUndefinded(this);
    console.log(`[2]::`, objectParams);

    // 2. Check update
    if (objectParams.product_attributes) {
      const updateProductAttr = removeObjectUndefinded(
        objectParams.product_attributes
      );
      // update child
      await updateProductById({
        productId,
        payload: updateNestedObjectParser(updateProductAttr),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new electronic error!!");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct)
      throw new BadRequestError("Create new Product electronic error!!");

    return newProduct;
  }
}

ProductFactory.registryProductType("Electronics", Electronics);
ProductFactory.registryProductType("Clothing", Clothing);

module.exports = ProductFactory;
