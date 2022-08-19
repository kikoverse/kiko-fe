import * as types from "../../types/NFT/market";
import marketAPI from "@api/nft/market.js";
import Wallet from "@wallet";
import utilsNumber from "@utils/number";
import NFT_CONSTANTS from "@constants/nft.js";
import utilsTool from "@utils/tool.js";
import utilsFormat from "@utils/format";
// import { cloneDeep } from "lodash";

// const INIT_LIST_PARAMS = {
//   groupId: "",
//   currency: "",
//   open: "all", // box // nft
//   sort: 0, // 3稀有度
//   pageSize: 30,
//   pageNum: 1,
// };

const INIT_LIST_PARAMS = {
  sortRule: "ctime", // price ctime rarity
  groupId: 0,
  nftType: "", //nft 原生nft/ box盲盒/ composite_card/ composite_element素材/元素
  sort: 1, // 稀有度 1按照sortRule 字段，降序  2按照sortRule 字段，升序
  pageSize: 30,
  pageNum: 1,
};

const INIT_LIST_STATUS = {
  hasMore: true,
  isLoading: false,
};

/* eslint-disable */
const StoreNftMarket = {
  namespaced: true,
  moduleName: "StoreNftMarket",
  state: {
    change_confirm_visible: false,
    blind_box_detail: {},
    nft_box_detail: {},
    marketList: null,
    box_exit: null,
    firstLoading: true, // 只用作初始加载
    dialogParams: NFT_CONSTANTS.INIT_DIALOG_PARAMS,
    listParams: INIT_LIST_PARAMS,
    listStatus: INIT_LIST_STATUS,
    soldDialogParams: NFT_CONSTANTS.INIT_SOLD_DIALOG_PARAMS,
    isScrollLoad: false, // 防止多次加载
  },
  mutations: {
    [types.CHANGE_SOLD_DIALOG_PARAMS](state, payload) {
      state.soldDialogParams = Object.assign(
        {},
        NFT_CONSTANTS.INIT_SOLD_DIALOG_PARAMS,
        payload
      );
    },
    [types.CLEAR_DATA](state) {
      state.listStatus = INIT_LIST_STATUS;
      state.marketList = null;
      state.listParams = INIT_LIST_PARAMS;
      state.firstLoading = true;
      state.isScrollLoad = false;
    },
    [types.SET_INIT_STATUS](state) {
      state.listStatus = INIT_LIST_STATUS;
      state.marketList = null;
      state.firstLoading = true;
    },
    [types.CHANGE_CONFIRM_VISIBLE](state, change_confirm_visible) {
      state.change_confirm_visible = change_confirm_visible;
    },
    [types.MARKET_BLIND_LIST](state, { data, hasMore, type }) {
      if (type === "init") {
        state.marketList = data;
        state.firstLoading = false;
      } else if (type === "scroll") {
        if (
          data &&
          data.length &&
          state.marketList &&
          state.marketList.length
        ) {
          state.marketList = state.marketList.concat(data);
        }
      }
      state.listStatus = Object.assign({}, state.listStatus, {
        hasMore: hasMore,
        isLoading: false,
      });
    },
    [types.BLIND_BOX_DETAIL](state, blind_box_detail) {
      state.blind_box_detail = blind_box_detail;
    },
    [types.NFT_BOX_DETAIL](state, nft_box_detail) {
      state.nft_box_detail = nft_box_detail;
    },
    [types.BOX_EXIT](state, box_exit) {
      state.box_exit = box_exit;
    },
    [types.CHANGE_DIALOG_STATUS](state, payload) {
      state.dialogParams = Object.assign({}, state.dialogParams, payload);
    },
    [types.SET_LIST_PARAMS](state, payload) {
      state.listParams = Object.assign({}, state.listParams, payload);
    },
    [types.SET_LIST_STATUS](state, payload) {
      state.listStatus = Object.assign({}, state.listStatus, payload);
    },
    // [types.SET_MARKET_LIST_RULE](state, payload) {
    //   state.marketListRule = payload;
    //   let open = "";
    //   if (payload[0] === true) {
    //     open = "box";
    //   }
    //   if (payload[1] === true) {
    //     open = "nft";
    //   }
    //   if (payload[0] && payload[1]) {
    //     open = "all";
    //   }
    //   state.listParams = Object.assign({}, state.listParams, {
    //     open,
    //   });
    // },
    [types.SCROLLING_LOADED](state, payload) {
      state.isScrollLoad = payload;
    },
  },
  actions: {
    async changeListQuery({ commit, state, dispatch }, payload) {
      commit(
        types.SET_LIST_PARAMS,
        Object.assign({}, state.INIT_LIST_PARAMS, {
          pageNum: 1,
          ...payload,
        })
      );
      commit(types.SET_INIT_STATUS);
      dispatch("queryMarketList", { type: "init" });
    },
    // 获取市场列表
    async queryMarketList({ commit, state }, { type }) {
      let res;
      if (type === "init") {
        res = await marketAPI.getMarketList(state.listParams);
      } else if (type === "scroll") {
        console.log("=======yes====");
        if (state.listStatus && !state.listStatus.hasMore) {
          return;
        } else {
          if (state.isScrollLoad) return;
          // 防止scroll多次加载
          commit(types.SCROLLING_LOADED, true);
          commit(
            types.SET_LIST_STATUS,
            Object.assign({}, state.listStatus, {
              isLoading: true,
            })
          );
          let { pageNum } = state.listParams;
          const listParams = Object.assign({}, state.listParams, {
            pageNum: pageNum + 1,
          });
          commit(types.SET_LIST_PARAMS, listParams);
          res = await marketAPI.getMarketList(listParams);
        }
      }
      if (res.code == 200) {
        commit(types.MARKET_BLIND_LIST, {
          data: res.data,
          hasMore: res.hasNext,
          type,
        });
        commit(types.SCROLLING_LOADED, false);
      }
    },
    // 获取盲盒详情
    async queryBlindBoxDetail({ commit }, params) {
      const res = await marketAPI.getBlindBoxDetail(params);
      if (res.code == 200) {
        commit(types.BLIND_BOX_DETAIL, res.data);
      }
    },
    // 获取NFT详情
    async queryNFTDetail({ commit }, params) {
      const res = await marketAPI.getNFTDetail(params);
      if (res.code == 200) {
        commit(types.NFT_BOX_DETAIL, res.data);
      }
    },
    // 轮询盲盒是否已售卖接口
    async queryIsSelling({ commit }, params) {
      const res = await marketAPI.queryIsSelling(params);
      if (res.code == 200) {
        commit(types.BOX_EXIT, res.data);
      }
    },
    // 买入
    async purchaseFun({ commit, rootState }, params) {
      let onSell;
      if (params.contractType === "NFT") {
        const nftStatus = await marketAPI.getNFTDetail({ id: params.nftId });
        if (nftStatus.code === 200) {
          onSell = nftStatus.data.onSell;
        }
      } else if (params.contractType === "BLIND_BOX") {
        const boxStatus = await marketAPI.getBlindBoxDetail({
          groupId: params.groupId,
          chainId: params.chainId,
        });
        if (boxStatus.code === 200) {
          onSell = boxStatus.data.onSell;
        }
      }
      if (!onSell) {
        commit(types.CHANGE_SOLD_DIALOG_PARAMS, {
          isShow: true,
          text: utilsFormat.computedLangCtx("提交失败"),
          subText: utilsFormat.computedLangCtx("商品已被售出"),
          btnText: utilsFormat.computedLangCtx("确认"),
        });
        return;
      }
      const provider = rootState.StoreWallet.stcProvider;
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("购买中"),
      });
      let txnHash;
      if (params.contractType === "BLIND_BOX") {
        txnHash = await Wallet.blindBoxContractCall({
          provider: provider,
          args: [params.id],
          tyArgs: params.codes,
          type: params.sellType === 1 ? "FIX_PRICE_BUY" : "BID_PRICE_BUY",
        });
      } else {
        txnHash = await Wallet.nftContractCall({
          provider: provider,
          args: [params.id],
          tyArgs: params.codes,
          type: params.sellType === 1 ? "FIX_PRICE_BUY" : "BID_PRICE_BUY",
        });
      }
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTool.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            console.timeEnd("===market:买入合约===");
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("购买成功"),
              });
            }, 5000);
          } else {
            console.timeEnd("===market:买入合约===");
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("购买失败"),
            });
          }
        });
      } else {
        console.timeEnd("===market:买入合约===");
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("购买失败"),
        });
      }
    },
    // 出价
    async bidPrice({ commit, rootState }, params) {
      if (!params.offerPrice) return;
      let onSell;
      if (params.contractType === "NFT") {
        const nftStatus = await marketAPI.getNFTDetail({ id: params.nftId });
        if (nftStatus.code === 200) {
          onSell = nftStatus.data.onSell;
        }
      } else if (params.contractType === "BLIND_BOX") {
        const boxStatus = await marketAPI.getBlindBoxDetail({
          groupId: params.groupId,
          chainId: params.chainId,
        });
        if (boxStatus.code === 200) {
          onSell = boxStatus.data.onSell;
        }
      }
      if (!onSell) {
        commit(types.CHANGE_SOLD_DIALOG_PARAMS, {
          isShow: true,
          text: utilsFormat.computedLangCtx("提交失败"),
          subText: utilsFormat.computedLangCtx("商品已被售出"),
          btnText: utilsFormat.computedLangCtx("确认"),
        });
        return;
      }
      const provider = rootState.StoreWallet.stcProvider;
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("出价中"),
      });
      let txnHash;
      const price = utilsNumber
        .bigNum(params.offerPrice)
        .times(Math.pow(10, 9))
        .toString();
      if (params.contractType === "BLIND_BOX") {
        txnHash = await Wallet.blindBoxContractCall({
          provider,
          tyArgs: params.codes,
          type: "BID_PRICE_BUY",
          args: [String(params.id), price],
        });
      }
      if (params.contractType === "NFT") {
        txnHash = await Wallet.nftContractCall({
          provider,
          tyArgs: params.codes,
          args: [String(params.id), price],
          type: "BID_PRICE_BUY",
        });
      }
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTool.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("出价成功"),
              });
            }, 5000);
          } else {
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("出价失败"),
            });
          }
        });
      } else {
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("出价失败"),
        });
      }
    },
    // 更改报价
    async updatePrice({ commit, rootState }, params) {
      let onSell;
      if (params.contractType === "NFT") {
        const nftStatus = await marketAPI.getNFTDetail({ id: params.nftId });
        if (nftStatus.code === 200) {
          onSell = nftStatus.data.onSell;
        }
      } else if (params.contractType === "BLIND_BOX") {
        const boxStatus = await marketAPI.getBlindBoxDetail({
          groupId: params.groupId,
          chainId: params.chainId,
        });
        if (boxStatus.code === 200) {
          onSell = boxStatus.data.onSell;
        }
      }
      if (!onSell) {
        commit(types.CHANGE_SOLD_DIALOG_PARAMS, {
          isShow: true,
          text: utilsFormat.computedLangCtx("提交失败"),
          subText: utilsFormat.computedLangCtx("商品已被售出"),
          btnText: utilsFormat.computedLangCtx("查看"),
        });
        return;
      }
      const provider = rootState.StoreWallet.stcProvider;

      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("出价中"),
      });
      const price = utilsNumber
        .bigNum(params.newPrice)
        .times(Math.pow(10, 9))
        .toString();
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("更改售价中"),
      });
      let txnHash;
      console.time("===market:更改报价合约===");
      console.time("===market:更改报价合约gas计算===");
      if (params.contractType === "BLIND_BOX") {
        txnHash = await Wallet.blindBoxContractCall({
          provider,
          args: [String(params.id), price],
          tyArgs: params.codes,
          type: "CHANGE_PRICE",
        });
      } else {
        txnHash = await Wallet.nftContractCall({
          provider,
          args: [String(params.id), price],
          tyArgs: params.codes,
          type: "CHANGE_PRICE",
        });
      }
      console.timeEnd("===market:更改报价合约gas计算===");
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTool.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            console.timeEnd("===market:更改报价合约===");
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("售价更改成功"),
                successBtnText: utilsFormat.computedLangCtx("确认"),
              });
            }, 5000);
          } else {
            console.timeEnd("===market:更改报价合约===");
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("售价更改失败"),
              failedBtnText: utilsFormat.computedLangCtx("确认"),
            });
          }
        });
      } else {
        console.timeEnd("===market:更改报价合约===");
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("售价更改失败"),
          failedBtnText: utilsFormat.computedLangCtx("确认"),
        });
      }
    },
    // 接受报价
    async acceptPrice({ commit, rootState }, params) {
      let onSell;
      if (params.contractType === "NFT") {
        const nftStatus = await marketAPI.getNFTDetail({ id: params.nftId });
        if (nftStatus.code === 200) {
          onSell = nftStatus.data.onSell;
        }
      } else if (params.contractType === "BLIND_BOX") {
        const boxStatus = await marketAPI.getBlindBoxDetail({
          groupId: params.groupId,
          chainId: params.chainId,
        });
        if (boxStatus.code === 200) {
          onSell = boxStatus.data.onSell;
        }
      }
      if (!onSell) {
        commit(types.CHANGE_SOLD_DIALOG_PARAMS, {
          isShow: true,
          text: utilsFormat.computedLangCtx("提交失败"),
          subText: utilsFormat.computedLangCtx("商品已被售出"),
          btnText: utilsFormat.computedLangCtx("查看"),
        });
        return;
      }
      const provider = rootState.StoreWallet.stcProvider;
      let txnHash;
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("获取收益中"),
      });
      console.time("===market:接受报价合约===");
      console.time("===market:接受报价合约gas计算===");
      if (params.contractType === "BLIND_BOX") {
        txnHash = await Wallet.blindBoxContractCall({
          provider,
          args: [String(params.id)],
          tyArgs: params.codes,
          type: "ACCEPT_PRICE",
        });
      } else {
        txnHash = await Wallet.nftContractCall({
          provider: provider,
          args: [String(params.id)],
          tyArgs: params.codes,
          type: "ACCEPT_PRICE",
        });
      }
      console.timeEnd("===market:接受报价合约gas计算===");
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTool.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            console.timeEnd("===market:接受报价合约===");
            // 查询到信息
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("接受报价收益成功", {
                  currency: params.currency,
                  price: params.price,
                }),
              });
            }, 5000);
          } else {
            console.timeEnd("===market:接受报价合约===");
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("获取收益失败"),
            });
          }
        });
      } else {
        console.timeEnd("===market:接受报价合约===");
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("获取收益失败"),
        });
      }
    },
    // 取消售出
    async cancelSell({ commit, rootState }, params) {
      let onSell;
      if (params.contractType === "NFT") {
        const nftStatus = await marketAPI.getNFTDetail({ id: params.nftId });
        if (nftStatus.code === 200) {
          onSell = nftStatus.data.onSell;
        }
      } else if (params.contractType === "BLIND_BOX") {
        const boxStatus = await marketAPI.getBlindBoxDetail({
          groupId: params.groupId,
          chainId: params.chainId,
        });
        if (boxStatus.code === 200) {
          onSell = boxStatus.data.onSell;
        }
      }
      if (!onSell) {
        commit(types.CHANGE_SOLD_DIALOG_PARAMS, {
          isShow: true,
          text: utilsFormat.computedLangCtx("提交失败"),
          subText: utilsFormat.computedLangCtx("商品已被售出"),
          btnText: utilsFormat.computedLangCtx("查看"),
        });
        return;
      }
      const provider = rootState.StoreWallet.stcProvider;
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("下架中"),
      });
      let txnHash;
      console.time("===market:取消出售合约===");
      console.time("===market:取消出售合约gas计算===");
      if (params.contractType === "BLIND_BOX") {
        txnHash = await Wallet.blindBoxContractCall({
          provider: provider,
          args: [String(params.id)],
          tyArgs: params.codes,
          type: "OFFLINE",
        });
      } else {
        txnHash = await Wallet.nftContractCall({
          provider: provider,
          args: [String(params.id)],
          tyArgs: params.codes,
          type: "OFFLINE",
        });
      }
      console.timeEnd("===market:取消出售合约gas计算===");
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTool.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            console.timeEnd("===market:取消出售合约===");
            // 查询到信息
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("商品下架成功"),
              });
            }, 5000);
          } else {
            console.timeEnd("===market:取消出售合约===");
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("商品下架失败"),
            });
          }
        });
      } else {
        console.timeEnd("===market:取消出售合约===");
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("商品下架失败"),
        });
      }
    },
  },
};

export default StoreNftMarket;
