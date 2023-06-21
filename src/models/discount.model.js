"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      require: true,
    },
    discount_description: {
      type: String,
      require: true,
    },
    // Loaij hinh giam gia so tien co dinh or % giam gia
    discount_type: {
      type: String,
      default: "fixed_amount",
    },
    discount_value: {
      type: Number,
      require: true,
    },
    discount_max_value: {
      type: Number,
      require: true,
    },
    // Discount Code
    discount_code: {
      type: String,
      require: true,
    },
    // Ngay bat dau
    discount_start_date: {
      type: Date,
      require: true,
    },
    // Ngay ket thuc
    discount_end_date: {
      type: Date,
      require: true,
    },
    // So luong discount duoc su dung
    discount_max_uses: {
      type: Number,
      require: true,
    },
    // So discount da su dung
    discount_uses_count: {
      type: Number,
      require: true,
    },
    // User da su dung
    discount_users_used: {
      type: Array,
      default: [],
    },
    // So luong cho phep toi da moi user duoc su dung
    discount_max_uses_per_user: {
      type: Number,
      require: true,
    },
    // Gia tri don hang toi thieu
    discount_min_order_value: {
      type: Number,
      require: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    // Trang thai cua discount
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    // Ap dung dicount nay cho nhung san pham nao
    discount_applies_to: {
      type: String,
      require: true,
      enum: ["all", "specific"],
    },
    // San pham da duoc ap dung discount
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
