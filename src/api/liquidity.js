import request from "@utils/request";
function getLiquidityXY({ tokenA, tokenB }) {
  let params = {
    id: 101,
    jsonrpc: "2.0",
    method: "contract.get_resource",
    params: [
      process.env.VUE_APP_CONTRACTS_ADDRESS, //合约地址
      `${process.env.VUE_APP_CONTRACTS_ADDRESS}::SwapPair::SwapPair<${tokenA}, ${tokenB}>`,
    ],
  };

  return request({
    headers: {
      "content-type": "application/json",
    },
    url: process.env.VUE_APP_CONTRACTS_SERVE_URL,
    method: "post",
    data: JSON.stringify(params),
  });
}

// 获取用户所有流动池LP-TOKEN
function getAllPoolListByUser(account) {
  let params = {
    id: 101,
    jsonrpc: "2.0",
    method: "state.list_resource",
    params: [account, { decode: true }],
  };
  return request({
    headers: {
      "content-type": "application/json",
    },
    url: process.env.VUE_APP_CONTRACTS_SERVE_URL,
    method: "post",
    data: JSON.stringify(params),
  });
}

// 获取流动性记录
function getLiquidityHistory(params) {
  return request({
    url:
      "/v1/swap/userLiquidityRecord/getAllByPage?userAddress=" +
      params.userAddress +
      "&pageSize=" +
      params.pageSize +
      "&nextId=" +
      params.nextId,
    method: "GET",
  });
}

// 获取LP流动池总量
function getTotalAmountWithLPToken(tokenA, tokenB) {
  let params = {
    id: 101,
    jsonrpc: "2.0",
    method: "contract.get_resource",
    params: [
      process.env.VUE_APP_CONTRACTS_ADDRESS, //合约地址
      `0x00000000000000000000000000000001::Token::TokenInfo<${process.env.VUE_APP_CONTRACTS_ADDRESS}::SwapPair::LPToken<${tokenA}, ${tokenB}>>`,
    ],
  };
  return request({
    headers: {
      "content-type": "application/json",
    },
    url: process.env.VUE_APP_CONTRACTS_SERVE_URL,
    method: "post",
    data: JSON.stringify(params),
  });
}

export default {
  getLiquidityXY,
  getAllPoolListByUser,
  getLiquidityHistory,
  getTotalAmountWithLPToken,
};
