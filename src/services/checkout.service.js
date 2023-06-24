"use strict";

const { BadRequestError } = require("../core/error.reponse");
const { order } = require("../models/order.model");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { DiscountService } = require("../services/discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // Check trong cart co ton tai san pham nao khong?
    const foundCart = findCartById(cartId);

    if (!foundCart) throw new BadRequestError("Cart does not exists!!");

    const checkout_order = {
      totalPrice: 0, // tong tien hang
      freeShip: 0, // phi van chuyen
      totalDiscount: 0, // tong tien discount giam gia
      totalCheckout: 0, // tong thang toan
    };
    const shop_order_ids_new = [];

    // Tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts, item_products } = shop_order_ids[i];
      //   Check product availabe
      const checkProductServer = await checkProductByServer(item_products);
      console.log("checkProductServer::", checkProductServer);
      if (!checkProductServer[0]) throw new BadRequestError("Order wrong!");
      // tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      //   Tong tien truoc khi xu ly
      checkout_order.totalPrice = +checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      //   Neu shop_discounts ton tai > 0 check xem co hop le hay khong
      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscountAmount({
            codeId: shop_discounts[0].codeId,
            userId,
            shopId,
            products: checkProductServer,
          });

        // tong cong discount giam gia
        checkout_order.totalDiscount = +discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      //   Tong thanh toan cuoi cung
      checkout_order.totalCheckout = +itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  // Order
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address,
    user_payment,
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log(`[1]::${products}`);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Mot so san pham da duoc cap nhat, vui long quay lai gio hang..."
      );
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    if (newOrder) {
      // remove product in cart
    }

    return newOrder;
  }
}

module.exports = CheckoutService;
