"use strict";

const { unGetSelectData, getSelectData } = require("../../utils");

const findAllDiscountCodeUnSelect = async ({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();

  return products;
};

const findAllDiscountCodeSelect = async ({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};

const updateDiscountById = async ({
  discountId,
  payload,
  model,
  isNew = true,
}) => {
  console.log("Update Discount by Id::", { discountId, payload, model });
  return await model.findByIdAndUpdate(discountId, payload, {
    new: isNew,
  });
};

module.exports = {
  findAllDiscountCodeUnSelect,
  findAllDiscountCodeSelect,
  checkDiscountExists,
  updateDiscountById,
};
