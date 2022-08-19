import request from "@utils/request";

// NFT质押列表
function getStakeNFTList(address) {
  return request({
    url: "/v1/mining/nft/staking/list",
    method: "GET",
    params: {
      address,
    },
  });
}

// 获取挖矿收益
function drawMiningReward(signature) {
  return request({
    url: `/v1/mining/nft/reward/harvest?signature=${signature}`,
    method: "POST",
    data: {
      signature,
    },
  });
}

// 数据看板
function getMiningData(address) {
  return request({
    url: "/v1/mining/nft/market",
    method: "GET",
    params: {
      address,
    },
  });
}

// 获取个人所有可质押的nft
function getUserNFTList(address) {
  return request({
    url: "/v1/nft/unused/list",
    method: "GET",
    params: {
      address,
    },
  });
}

// 收益提取费用

function getNFTfee() {
  return request({
    url: "/v1/mining/nft/fee",
    method: "GET",
  });
}

export default {
  getStakeNFTList,
  drawMiningReward,
  getMiningData,
  getUserNFTList,
  getNFTfee,
};
