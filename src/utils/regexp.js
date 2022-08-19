// 正整数
const isInteger = (val) => new RegExp(/(^[1-9]\d*$)/g).test(val);

// 中文
const isChinese = (val) => new RegExp(/[\u4e00-\u9fa5]/).test(val);

export default {
  isInteger,
  isChinese,
};
