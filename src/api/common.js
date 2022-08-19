// 通用的API
import request from "../utils/request";

// swap 流动池币种列表
function getCurrency() {
  return request({
    url: "/v1/swap/coin/getAll",
    method: "GET",
  });
}

// 用户所有资产
function getUserResourceList(account) {
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

// nft历史记录
function getBoxHistoryRecord(params) {
  const { id, pageSize, nextId } = params;
  return request({
    url:
      `/v1/nft/operation/record?` +
      `&id=` +
      id +
      `&pageSize=` +
      pageSize +
      `&nextId=` +
      nextId,
    method: "GET",
  });
}

// 查询上链信息
function getTransactionInfo(txnHash) {
  let params = {
    id: 101,
    jsonrpc: "2.0",
    method: "chain.get_transaction_info",
    params: [txnHash],
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

function getOpenBoxIdByHash(hash) {
  let params = {
    id: 101,
    jsonrpc: "2.0",
    method: "chain.get_events_by_txn_hash",
    params: [hash, { decode: true }],
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

function getChainEventsByTxnHash(hash) {
  let params = {
    id: 101,
    jsonrpc: "2.0",
    method: "chain.get_events_by_txn_hash",
    params: [hash, { decode: true }],
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

function getImgTruePath(url) {
  return request({
    url,
    method: "GET",
    headers: {
      "X-Request-With": "XMLHttpRequest",
    },
  });
}

function getVolumeData() {
  return request({
    url: "/v1/swap/exchange/volumeInfo",
    method: "GET",
  });
  // return [
  //   {
  //     value: "31231213",
  //     desc: "Total Value Locked",
  //   },
  //   {
  //     value: "98321321",
  //     desc: "Total Trading Volume",
  //   },
  //   {
  //     value: "08732",
  //     desc: "Users",
  //   },
  // ];
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

// 获取nft系列
function getNFTSeriesList() {
  return request({
    url: "/v1/nft/series/list",
    method: "GET",
  });
}

export default {
  getCurrency,
  getUserResourceList,
  getBoxHistoryRecord,
  getTransactionInfo,
  getImgTruePath,
  getVolumeData,
  getAllPoolListByUser,
  getOpenBoxIdByHash,
  getChainEventsByTxnHash,
  getNFTSeriesList,
};
