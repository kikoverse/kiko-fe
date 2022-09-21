import commonApi from "@api/common";
import dayjs from "dayjs";
const JWT = require("jsonwebtoken");
// import NFT_CONSTANTS from "@constants/nft.js";
// import { findIndex } from "lodash";

import * as isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import * as duration from "dayjs/plugin/duration";
dayjs.extend(isSameOrAfter);
dayjs.extend(duration);

const openNewWindow = (url) => {
  window.open(url, "_blank");
};

/**
 *
 * @param {16string} hexCharCodeStr
 * @returns
 */
const hexCharCodeToStr = (hexCharCodeStr) => {
  let trimedStr = hexCharCodeStr.trim();
  let rawStr =
    trimedStr.substr(0, 2).toLowerCase() === "0x"
      ? trimedStr.substr(2)
      : trimedStr;
  let len = rawStr.length;
  if (len % 2 !== 0) {
    return "";
  }
  let curCharCode;
  let resultStr = [];
  for (let i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
};

/**
 * 轮询查上链信息
 * @param {txnHash, delay}
 * @returns
 */
const pollingTxnInfo = ({ txnHash, delay = 1000 } = {}) => {
  // 考虑一定次数后仍然拿不到信息直接reject？?
  return new Promise((resolve) => {
    commonApi.getTransactionInfo(txnHash).then((res) => {
      console.log("链上结果：", res);
      if (res.result) {
        if (res.result.status === "Executed") {
          resolve(res.result.status);
        } else {
          resolve("failed");
          console.error("合约失败:", res.result);
          // const { MoveAbort } = res.result?.status;
          // const { address, name } = MoveAbort?.location?.Module;
          // console.log("MoveAbort", MoveAbort);
          // console.log("address", address, "name", name);
          // const index = findIndex(
          //   NFT_CONSTANTS.NFT_ERROR_CODES,
          //   (d) => String(d.code) === String(MoveAbort.abort_code)
          // );
          // console.log("===index-===", index);
          // if (
          //   index > -1 &&
          //   address === process.env.VUE_APP_NFT_ADDRESS &&
          //   name === process.env.VUE_APP_NFT_MARKET_ID
          // ) {
          //   resolve("NoExisted");
          // }
        }
      } else {
        setTimeout(() => {
          resolve(pollingTxnInfo({ txnHash }));
        }, delay);
      }
    });
  });
};

const getOpenBoxIdByHash = ({ txnHash, boxToken } = {}) => {
  return new Promise((resolve) => {
    commonApi.getOpenBoxIdByHash(txnHash).then((res) => {
      console.log("盲盒开启id查询", res);
      if (res.result && res.result.length > 0) {
        const k = res.result.filter((d) => d.type_tag.includes(boxToken));
        if (k && k.length) {
          const id = k[0].decode_event_data.id;
          resolve(String(id));
        }
      } else {
        setTimeout(() => {
          resolve(getOpenBoxIdByHash({ txnHash, boxToken }));
        }, 1000);
      }
    });
  });
};

/**
 * 轮询查上链event信息
 * @param {txnHash, delay}
 * @returns
 */
const getChainEventsByTxnHash = ({
  txnHash,
  handlerFunc = null,
  delay = 1000,
} = {}) => {
  return new Promise((resolve) => {
    commonApi.getChainEventsByTxnHash(txnHash).then((res) => {
      if (res.result && res.result.length > 0) {
        if (typeof handlerFunc === "function") {
          // data => { data:  ,status: 'Executed'}
          const data = handlerFunc(res.result);
          resolve(data);
        }
      } else {
        setTimeout(() => {
          resolve(getChainEventsByTxnHash({ txnHash, handlerFunc }));
        }, delay);
      }
    });
  });
};

/**
 * 轮询查上链hash信息
 * @param {txnHash, delay}
 * @returns
 */
const getChainTransactionInfo = ({
  txnHash,
  handlerFunc = null,
  delay = 1000,
} = {}) => {
  return new Promise((resolve) => {
    commonApi.getTransactionInfo(txnHash).then((res) => {
      console.log("=======getChainTransactionInfo=======", res);
      if (res.result && res.result.status === "Executed") {
        if (typeof handlerFunc === "function") {
          const data = handlerFunc(res.result);
          // data => { data:  ,status: 'Executed'}
          resolve(data);
        } else {
          resolve({ status: "Executed" });
        }
      } else {
        setTimeout(() => {
          resolve(getChainTransactionInfo({ txnHash, handlerFunc }));
        }, delay);
      }
    });
  });
};
/**
 * 隐藏nft-image地址
 * @param {*} path
 * @returns
 */
const getImgTruePath = (path) => {
  if (!path) return;
  const isNeedProxy = process.env.VUE_APP_IS_NEED_PROXY_IMG_PATH;
  if (isNeedProxy) {
    // 本地代理使用
    path = path.match(/v1(.*)/g)?.[0];
  }
  return new Promise((resolve) => {
    commonApi.getImgTruePath(path).then((res) => {
      if (res.code === 200) {
        resolve(res.data);
      }
    });
  });
};

const setJWT = () => {
  const token = JWT.sign(
    { iss: "kiko", exp: dayjs().add(10, "m").valueOf() },
    "4858BAe65490df199FE8D76aC9087620",
    {
      algorithm: "HS256",
    }
  );
  return token;
};

/**农场调试的时候去掉这两个方法了 */
const encodeQueryURL = (code) => {
  //对字符串进行加密
  var c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  }
  return escape(c);
};

const decodeQueryURL = (code) => {
  code = unescape(code);
  var c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
};

const getCountDown = (timestamp) => {
  if (dayjs().isSameOrAfter(dayjs(timestamp))) {
    return null;
  }
  const diffTime = dayjs.duration(timestamp - dayjs());
  let countdownStr = null;
  const day = diffTime.days();
  const hours =
    diffTime.hours() < 10 ? `0${diffTime.hours()}` : diffTime.hours(); //小时
  const minutes =
    diffTime.minutes() < 10 ? `0${diffTime.minutes()}` : diffTime.minutes(); //分钟
  const seconds =
    diffTime.seconds() < 10 ? `0${diffTime.seconds()}` : diffTime.seconds(); //秒
  countdownStr = `${day}D ${hours}:${minutes}:${seconds}`;
  return countdownStr;
};

const getCountDownDetails = (timestamp) => {
  let countdownStr = { day: "00", hours: "00", minutes: "00", seconds: "00" };
  if (dayjs().isSameOrAfter(dayjs(timestamp))) {
    return countdownStr;
  }
  const diffTime = dayjs.duration(timestamp - dayjs());
  const day = diffTime.days() < 10 ? `0${diffTime.days()}` : diffTime.days(); //小时 ;
  const hours =
    diffTime.hours() < 10 ? `0${diffTime.hours()}` : diffTime.hours(); //小时
  const minutes =
    diffTime.minutes() < 10 ? `0${diffTime.minutes()}` : diffTime.minutes(); //分钟
  const seconds =
    diffTime.seconds() < 10 ? `0${diffTime.seconds()}` : diffTime.seconds(); //秒
  countdownStr = {
    day,
    hours,
    minutes,
    seconds,
  };
  return countdownStr;
};

const imageisExist = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = function () {
      if (this.complete === true) {
        resolve(image);
      }
    };
    image.onerror = function () {
      reject("load failed");
    };
    image.src = url;
  });
};
/**
 * 多次调用函数返回最后值（未实验）
 * @param cb 执行的回调函数，和防抖使用方法一致
 * @returns
 */
const requestMoreFun = (cb) => {
  let count = -1;
  let arr = [];
  return async (...args) => {
    count++;
    let res = await cb(...args);
    arr[count] = res;
    return arr[arr.length - 1];
  };
};

const mergeArr = (arr1, arr2) => {
  const json1 = arr2Json(arr1, "year");
  const json2 = arr2Json(arr2, "year");
  const arr = [];
  for (const key in json1) {
    if (json2[key]) {
      json1[key] = {
        ...json1[key],
        honorGroups: mergeArrGroups(
          json1[key].honorGroups,
          json2[key].honorGroups
        ),
      };
      delete json2[key];
    }
    arr.push(json1[key]);
  }
  for (const key in json2) {
    arr.push(json2[key]);
  }
  return arr;
};
const mergeArrGroups = (arr1, arr2) => {
  const json1 = arr2Json(arr1, "id");
  const json2 = arr2Json(arr2, "id");
  const arr = [];
  for (const key in json1) {
    if (json2[key]) {
      json1[key] = { ...json1[key], isHas: true };
      delete json2[key];
    }
    arr.push(json1[key]);
  }
  for (const key in json2) {
    arr.push(json2[key]);
  }
  return arr;
};

const arr2Json = (arr, key) => {
  let newJson = {};
  for (const item of arr) {
    newJson[item[key]] = item;
  }
  return newJson;
};

export default {
  openNewWindow,
  hexCharCodeToStr,
  pollingTxnInfo,
  getImgTruePath,
  setJWT,
  getChainEventsByTxnHash,
  getOpenBoxIdByHash,
  encodeQueryURL,
  decodeQueryURL,
  getChainTransactionInfo,
  getCountDown,
  getCountDownDetails,
  imageisExist,
  requestMoreFun,
  mergeArr,
};
