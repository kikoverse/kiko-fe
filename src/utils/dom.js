const getScrollTop = () => {
  return document.documentElement.scrollTop || document.body.scrollTop;
};

const getViewPortHeight = () => {
  return document.documentElement.clientHeight || document.body.clientHeight;
};

let vendor = (() => {
  let element = document.createElement("div");
  element.style.display = "none";
  let transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform",
    standard: "transform",
  };
  for (let key in transformNames) {
    if (element.style[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();

const prefixStyle = (style) => {
  if (vendor === false) {
    return false;
  }

  if (vendor === "standard") {
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substring(1);
};

/**
 * 元素可视区范围
 * @param {*} element
 * @returns
 */
const isInViewPort = (element) => {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left } = element.getBoundingClientRect();

  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
};

export default { getScrollTop, getViewPortHeight, prefixStyle, isInViewPort };
