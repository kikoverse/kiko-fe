/*
 * @Descripttion:
 * @version:
 * @Author: xiaziheng
 * @Date: 2022-04-21 15:58:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-01 14:38:25
 */
/* eslint-disable */
import StarMaskOnboarding from "@starcoin/starmask-onboarding";
import utilsNumber from "@utils/number.js";
import { providers, utils, bcs } from "@starcoin/starcoin";
import { arrayify, hexlify } from "@ethersproject/bytes";
import CONSTANTS_STAR_MASK from "@constants/starmask";

/**
 * @name: xiaziheng
 * @msg: 初始化provider
 * @param {*}
 * @return {*}
 */
export const createStcProvider = async () => {
  let stcProvider;
  try {
    if (window.starcoin) {
      // We must specify the network as 'any' for starcoin to allow network changes
      stcProvider =await  new providers.Web3Provider(window.starcoin, "any");
    }
  } catch (error) {
    console.error(error);
  }
  return stcProvider;
};

/**
 * @name: xiaziheng
 * @msg: 获取Starmask插件是否安装 下载方法等 实例化
 * @param {*}
 * @return {*}
 */

export const createStarMaskOnboarding = () => {
  const currentUrl = new URL(window.location.href);
  const forwarderOrigin =
    currentUrl.hostname === "localhost" ? "http://localhost:9032" : undefined;

  let onboarding;
  try {
    onboarding = new StarMaskOnboarding({ forwarderOrigin });
  } catch (error) {
    console.error(error);
  }
  return onboarding;
};
 /**
  * @name: xiaziheng
  * @msg: 获取sign
  * @param {*}
  * @return {*}
  */
  export const getSign = async (account, message, networkId =1) => {
    try {
      const msg = `0x${Buffer.from(message, 'utf8').toString('hex') }`
      const extraParams = { networkId }
      const sign = await window.starcoin.request({
        method: 'personal_sign',
        params: [msg, account, extraParams],
      })
      return sign;
    } catch (err) {
      console.error(err);
      return '';
    }
  };
  

/**
 * @name: xiaziheng
 * @msg: 检测stamask是否安装
 * @param {*}
 * @return {*}
 */
export const checkStarMaskInstalled = () => {
  const { isStarMaskInstalled } = StarMaskOnboarding;
  return isStarMaskInstalled();
};

/**
 * @name: xiaziheng
 * @msg: 获取下载地址
 * @param {*}
 * @return {*}
 */
 export const getStarMaskInstallUrl = () => {

  return CONSTANTS_STAR_MASK.PLUGIN_URL;
};

/**
 * @name: xiaziheng
 * @msg: 连接钱包
 * @param {*}
 * @return {*}
 */

export const connectStarMask = async () => {
  let newAccounts = [];
  try {
    newAccounts = await window.starcoin.request({
      method: "stc_requestAccounts",
    });
  } catch (error) {
    throw {
      type:'StarMask',
      url:'https://chrome.google.com/webstore/detail/starmask/mfhbebgoclkghebffdldpobeajmbecfk',
      error
    };
  }
  return newAccounts;
};

/**
 * @name: xiaziheng
 * @msg: 获取chainid
 * @param {*}
 * @return {*}
 */
export const getSTCNetworkChainId = async () => {
  const chainInfo = await window.starcoin.request({
    method: "chain.id",
  });
  return `0x${chainInfo.id.toString(16)}`;
};

 /**
  * @name: xiaziheng
  * @msg: 获取账户
  * @param {*} provider
  * @param {*} account
  * @param {*} token
  * @return {*}
  */
 export const getSTCAccountBalance = async ({ provider, accounts, token }) => {
  let balance;
  try {
    const result = await provider.getBalance(
      accounts,
      token
    );
    if (result) {
      balance = utilsNumber.bigNum(result).toString();
      return balance;
    } else {
      balance = "0";
      return balance;
    }
  } catch (error) {
    console.error(error);
    return "0";
  }
};

 /**
  * @name: xiaziheng
  * @msg: 获取权限
  * @param {*}
  * @return {*}
  */
 export const setPermissions = async () => {
  let permissionsArray;
  try {
    permissionsArray = await window.starcoin.request({
      method: "wallet_requestPermissions",
      params: [{ stc_accounts: {} }],
    });
  } catch (err) {
    console.error(err);
  }
  return permissionsArray.map((perm) => perm.parentCapability);
};


 /**
  * @name: xiaziheng
  * @msg: 获取账号权限
  * @param {*}
  * @return {*}
  */
 export const getPermissions = async () => {
  let permissionsArray;
  try {
    permissionsArray = await window.starcoin.request({
      method: "wallet_getPermissions",
    });
  } catch (err) {
    console.error(err);
  }
  return permissionsArray.map((perm) => perm.parentCapability);
};




