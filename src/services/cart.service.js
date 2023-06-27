"use strict";

const { NotFoundError } = require("../core/error.reponse");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

class CartService {
  static async createUserCart({ userId, product }) {
    const { productId } = product;
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Not found Product!!");
    const query = { cart_userId: userId, cart_state: "active" };

    const updateOrInsert = {
      $addToSet: {
        cart_products: {
          ...product,
          name: foundProduct.product_name,
          price: foundProduct.product_price,
        },
      },
    };
    const options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    };

    const updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };
    const options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateSet, options);
  }

  static async addToCart({ userId, product = {} }) {
    const { productId } = product;
    // Check xem cart ton tai hay khong
    const userCart = await cart.findOne({ cart_userId: userId });

    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Not found Product!!");

    if (!userCart) {
      // create cart for user
      return await CartService.createUserCart({ userId, product });
    }

    // Neu co cart nhung chua co san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products = [
        {
          ...product,
          name: foundProduct.product_name,
          price: foundProduct.product_price,
        },
      ];
      return await userCart.save();
    }

    // Gio hang ton tai va co san pham nay thi update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  // Update
  static async updateCountToCart({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Not found Product!!");
    if (
      foundProduct.product_shop.toString() !==
      shop_order_ids[0]?.item_products[0].shopId
    ) {
      throw new NotFoundError("Product do not belong to the shop!!");
    }

    if (quantity === 0) {
      // delete
      return await CartService.deleteItemUserCart({ userId, productId });
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteItemUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };

    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
