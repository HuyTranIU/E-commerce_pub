"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.reponse");
const discountModel = require("../models/discount.model");
const { product } = require("../models/product.model");
const {
  findAllDiscountCodeUnSelect,
  checkDiscountExists,
  findAllDiscountCodeSelect,
  updateDiscountById,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  convertToObjectIdMongodb,
  removeObjectUndefinded,
} = require("../utils");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_code,
      end_code,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
    } = payload;

    if (new Date(start_code) > new Date(end_code))
      throw new BadRequestError("Start date must be before end date");

    // Create index for discount code
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });
    if (foundDiscount && foundDiscount.discount_is_active)
      throw new BadRequestError("Discount exists!!");

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_max_value: max_value,
      discount_start_date: new Date(start_code),
      discount_end_date: new Date(end_code),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });
    return newDiscount;
  }

  static async updateDisCountCode(discountId, payload) {
    return await updateDiscountById({
      discountId,
      payload: removeObjectUndefinded(payload),
      model: discountModel,
    });
  }

  // Get all discount codes available with products
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    limit = 50,
    page = 1,
  }) {
    let products;
    // Create index for discout_code
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists!!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  // Get all discount by Shop
  static async getAllDiscountCodesByShop({ limit = 50, page = 1, shopId }) {
    const discounts = await findAllDiscountCodeSelect({
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      limit: +limit,
      page: +page,
      select: ["discount_code", "discount_name"],
      model: discountModel,
    });

    return discounts;
  }

  // Apply discount code
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount doesn't exists!!");

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError("Discount expried!!");
    if (!discount_max_uses) throw new NotFoundError("Discount are out!!");

    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > new Date(discount_end_date)
    // )
    //   throw new NotFoundError("Discount code has expried!!");

    // Check xem co set gia tri toi thieu hay khong?
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
    }
    console.log("totalOrder", totalOrder, discount_min_order_value);
    if (totalOrder < discount_min_order_value)
      throw new NotFoundError(
        `Discount requires a minium order value of ${discount_min_order_value}`
      );

    if (discount_max_uses_per_user > 0) {
      const userDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userDiscount) {
        // ...
      }
    }
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalProce: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });
    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError(`Discount doesn't exitst!!`);

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
    return result;
  }
}

module.exports = {
  DiscountService,
};
