/* eslint-disable */
import request from "@/utils/request";

// swap 交易矿池list
function getTradingPoolList(payload) {
  // return request({
  //   url: "/v1/mining/trading/pool/list",
  //   method: "GET",
  //   params: {
  // userAddress: payload
  // }
  // });
  return {
    code: 200,
    msg: "OK",
    timeStamp: 1636424698607,
    data: [
      {
        id: 10000,
        pairName: "BTC_USDT",
        tokenA: "0x1::BTC::BTC",
        tokenB: "0x1::USDT::USDT",
        allocationMultiple: 25, // 分配系数
        currentTradingAmount: 21321321, // 当前交易额
        totalTradingAmount: 2198, // 总交易额
        allocatedRewardAmount: 499.99998902, // 已分配奖励
        createTime: 0,
        updateTime: 0,
        weight: 0,
        apy: 120, // 年化收益
        tradingAmount: 4.48, // 交易额
        currentReward: 0.006092256, // 待领取收益
        totalReward: 0.00507688, // 总收益
        tokenIconA:
          "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/3bfe4edc-b91a-429a-eb5c-0a529fbb2200/public",
        tokenIconB:
          "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/771fed83-9d98-4be2-162d-b8639dfa6800/public",
      },
    ],
  };
}

// swapfarm 数据看班
function getTradingMarket(payload) {
  // return request({
  //   url: "/v1/mining/trading/market",
  //   method: "GET",
  //   params: {
  // userAddress: payload
  // }
  // });
  return {
    code: 200,
    msg: "ok",
    timeStamp: 1234567890123,
    data: {
      totalTradingAmount: 123456.123, // 总交易额
      currentTradingAmount: 12345.123, // 当前交易额
      userCurrentTradingAmount: 123.123, // 我的交易额
      dailyTotalOutput: 100, // 每日产出
      dailyUserReward: 10, // 每日收益
    },
  };
}
// swap farm 个人受益
function getTradingReward(payload) {
  // return request({
  //   url: "/v1/mining/trading/reward",
  //   method: "GET",
  //   params: {
  //     userAddress: payload,
  //   },
  // });
  return {
    code: 200,
    msg: "ok",
    timeStamp: 1234567890123,
    data: {
      currentReward: 0.0006, // 待领取收益
      lockedReward: 12345.123, // 锁仓收益
      freedReward: 123.123, // 已释放收益
    },
  };
}

// swap farm 提前当前收益
function getPersonCurrReward(payload) {
  // return request({
  //   url: "/v1/mining/trading/currentReward/harvest",
  //   method: "GET",
  //   params: {
  //     userAddress: payload,
  //   },
  // });
  return {
    code: 200,
    msg: "ok",
    timeStamp: 1234567890123,
    data: {
      transactionHash:
        "0x13b80d11761b0a2aa1c4c977efc91f9760b8bd29c0f605bae090b08a37885e31", // 交易哈希
    },
  };
}
// swap farm 提取锁仓收益
function getPersonLockedReward(payload) {
  // return request({
  //   url: "/v1/mining/trading/freedReward/harvest",
  //   method: "GET",
  //   params: {
  //     userAddress: payload,
  //   },
  // });
  return {
    code: 200,
    msg: "ok",
    timeStamp: 1234567890123,
    data: {
      transactionHash:
        "0x13b80d11761b0a2aa1c4c977efc91f9760b8bd29c0f605bae090b08a37885e31", // 交易哈希
    },
  };
}
// 提取费用
function getSwapMiningDrawGas() {
  // return request({
  //   url: "/v1/mining/trading/fee",
  //   method: "GET",
  // });
  return {
    code: 200,
    msg: "ok",
    timeStamp: 1234567890123,
    data: 0.0001, // 手续费(kiko)
  };
}

// ============================流动性挖矿============================

// 获取流动性可提取kiko
function getLiquidityKikoReward({ userAddress, poolId }) {
  // return request({
  //   url: "/v1/mining/trading/reward",
  //   method: "GET",
  //   params: {
  //     userAddress,
  //     poolId
  //   },
  // });
  return {
    code: 200,
    msg: "ok",
    timeStamp: 1234567890123,
    data: {
      currentReward: 0.0006, // 待领取收益
    },
  };
}

function getLpTotalStakeAmount() {
  // return request({
  //   url: "/v1/mining/lp/market",
  //   method: "GET",
  // });
  return {
    code: 200,
    msg: "ok",
    timeStamp: 1234567890123,
    data: {
      totalStakingAmount: 123456.123, // 总质押额
    },
  };
}

function getLpPoolList() {
  // return request({
  //   url: "/v1/mining/lp/pool/list",
  //   method: "GET",
  // });
  return {
    code: 200,
    msg: "OK",
    timeStamp: 1636424698607,
    data: [
      {
        id: 10000,
        pairName: "BTC_USDT",
        tokenA: "0x5b876a58b0e1cff855b6489cd8cf3bec::DummyToken::BTC",
        tokenB: "0x5b876a58b0e1cff855b6489cd8cf3bec::DummyToken::USDT",
        tokenIconA: "https://photo.16pic.com/00/68/78/16pic_6878865_b.png",
        tokenIconB: "https://photo.16pic.com/00/68/78/16pic_6878865_b.png",
        dailyTotalOutput: 123.123, // 每日产出
        apy: 999999, // 年化收益
        totalStakingAmount: 10000.123, // 总质押
        userStakingAmount: 1000.123, // 个人质押
        userReward: 0.006092256, // 待领取收益
      },
    ],
  };
}

// 提取 流动性收益

function drawLiquidityKIKOProfit(userAddress) {
  // return request({
  //   url: "/v1/mining/lp/reward/harvest",
  //   method: "POST",
  //   data: {
  //     userAddress,
  //   },
  // });
  return {
    code: 200,
    msg: "ok",
    timeStamp: 1234567890123,
    data: {
      transactionHash: "0xABCD1234", // 交易哈希
    },
  };
}

export default {
  getTradingPoolList,
  getTradingMarket,
  getTradingReward,
  getPersonCurrReward,
  getSwapMiningDrawGas,
  getPersonLockedReward,
  // 流动性
  getLpTotalStakeAmount,
  getLpPoolList,
  getLiquidityKikoReward,
  drawLiquidityKIKOProfit,
};
