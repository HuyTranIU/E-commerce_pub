"use strict";

const { BadRequestError } = require("../core/error.reponse");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { DiscountService } = require("../services/discount.service");

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
}

module.exports = CheckoutService;
