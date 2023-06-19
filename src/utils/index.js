"use strict";
const _ = require("lodash");
const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

// ['a', 'b', 'c'] => {a: 1, b: 1, c: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeObjectUndefinded = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  console.log(`updateNestedObjectParser [1]::`, obj);
  Object.keys(obj || {}).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  console.log(`updateNestedObjectParser [4]::`, final);
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeObjectUndefinded,
  updateNestedObjectParser,
};
