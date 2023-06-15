"use strict";

const { BadRequestError } = require("../core/error.reponse");
const { product, clothing, electronic } = require("../models/product.model");

// Define factory class to create product
class ProductFactory {
  static async createProduct(type, payload) {
    console.log(`type::${type}`);
    switch (type) {
      case "Electronics":
        return new Electronics(payload).createElectronics();
      case "Clothing":
        return new Clothing(payload).createClothing();
      default:
        throw new BadRequestError(`Invalid Product Type ${type}`);
    }
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
  async createProduct() {
    console.log("Create Product::", this);
    return await product.create(this);
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createClothing() {
    const newClothing = await clothing.create(this.product_attributes);
    console.log("newClothing::", newClothing);
    if (!newClothing) throw new BadRequestError("Create new Clothing error!!");

    const newProduct = await super.createProduct();
    if (!newProduct)
      throw new BadRequestError("Create new Product Clothing error!!");

    return newProduct;
  }
}

class Electronics extends Product {
  async createElectronics() {
    const newElectronic = await electronic.create(this.product_attributes);
    if (!newElectronic)
      throw new BadRequestError("Create new electronic error!!");

    const newProduct = await super.createProduct();
    if (!newProduct)
      throw new BadRequestError("Create new Product electronic error!!");

    return newProduct;
  }
}

module.exports = ProductFactory;
