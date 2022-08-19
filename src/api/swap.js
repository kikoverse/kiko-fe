/* eslint-disable */
// 合约相关接口
import request from "@utils/request";

// 换入
function exchangeIn(params) {
  return request({
    url: "/v1/swap/exchange/in",
    method: "POST",
    data: params,
  });
}

// 换出
function exchangeOut(params) {
  return request({
    url: "/v1/swap/exchange/out",
    method: "POST",
    data: params,
  });
}

// 交易记录
function getExchangeHistory(params) {
  return request({
    url:
      "/v1/swap/userSwapRecord/getAllByPage?userAddress=" +
      params.userAddress +
      "&pageSize=" +
      params.pageSize +
      "&nextId=" +
      params.nextId,
    method: "GET",
  });
}

export default {
  exchangeIn,
  exchangeOut,
  getExchangeHistory,
};
