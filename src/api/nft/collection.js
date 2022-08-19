/* eslint-disable */
import request from "../../utils/request";

//获取盲盒详情
function getBoxDetail(boxToken, userAddress) {
  return request({
    url: `/v1/nft/box/info`,
    method: "GET",
    params: {
      boxToken,
      userAddress,
    },
  });
}

// 获取我的NFT销售中nft详情
function getSellingNftDetail(infoId) {
  return request({
    url: `/v1/nft/nft/info/${infoId}`,
    method: "GET",
  });
}

// 获取我的NFT销售中盲盒详情
function getSellingBoxDetail(groupId, chainId) {
  return request({
    url: `/v1/nft/box/info/${groupId}/${chainId}`,
    method: "GET",
  });
}

//获取未出售nft详情
function getNftDetail(nftMeta, nftBody, nftId) {
  return request({
    url: `/v1/nft/nft/info`,
    method: "GET",
    params: {
      nftMeta,
      nftBody,
      nftId,
    },
  });
}

function getMySeries() {
  return request({
    url: "/v1/nft/series/list",
    method: "GET",
    params: {
      all: true,
    },
  });
}

function groupList() {
  return request({
    url: "/v1/nft/group/list",
    method: "GET",
  });
}
//出售中
function getSellingData(userAddress) {
  return request({
    url: "/v1/nft/store/selling",
    method: "GET",
    params: {
      userAddress, //钱包地址
    },
  });
}

function getPurchaseHistory(payload) {
  return request({
    url: "/v1/nft/store/records",
    method: "GET",
    params: {
      direction: "buy",
      pageSize: 20,
      address: payload.address,
      pageNum: payload.pageNum,
    },
  });
}

function getSalesHistory(payload) {
  return request({
    url: "/v1/nft/store/records",
    method: "GET",
    params: {
      direction: "sell",
      pageSize: 20,
      address: payload.address,
      pageNum: payload.pageNum,
    },
  });
}

// 我的未出售
function getUnSellingData(address) {
  return request({
    url: "/v1/nft/unsell/list",
    method: "GET",
    params: {
      address, //钱包地址
    },
  });
}

export default {
  getBoxDetail, //盲盒详情
  getNftDetail, //nft详情
  getMySeries,
  groupList,
  getSellingData, //出售中列表
  getSellingBoxDetail,
  getSellingNftDetail,
  getPurchaseHistory,
  getSalesHistory,
  getUnSellingData,
};
