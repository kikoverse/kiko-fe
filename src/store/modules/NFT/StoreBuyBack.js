import * as types from "../../types/NFT/buyBack";
import buyBackApi from "@api/nft/buyback";
import commonApi from "@/api/common";
import Wallet from "@wallet";
import NFT_CONSTANTS from "@constants/nft.js";
import utilsTool from "@utils/tool";
import utilsFormat from "@utils/format";
/* eslint-disable */

const INIT_QUERY_PARAMS = {
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
const StoreBuyBack = {
  namespaced: true,
  moduleName: "StoreBuyBack",
  state: {
    buyBackList: null,
    confirm_type: "secondConfirm",
    confirm_text: "",
    buyBackDetail: null,
    seriesList: [],
    groupId: "",
    firstLoading: true,
    noData: false,
    dialogParams: NFT_CONSTANTS.INIT_DIALOG_PARAMS,
    queryParams: INIT_QUERY_PARAMS,
    listStatus: INIT_LIST_STATUS,
  },
  mutations: {
    [types.CLEAR_PARAMS_DATA](state) {
      state.listStatus = INIT_LIST_STATUS;
      state.firstLoading = true;
      state.buyBackList = null;
      state.queryParams = INIT_QUERY_PARAMS;
      state.buyBackList = null;
    },
    [types.SET_INIT_STATUS](state) {
      state.listStatus = INIT_LIST_STATUS;
      state.buyBackList = null;
      state.firstLoading = true;
    },
    [types.SET_BUYBACK_LIST](state, { type, data, hasMore }) {
      if (type === "init") {
        state.buyBackList = data;
        state.firstLoading = false;
      } else if (type === "scroll") {
        if (data && data.length) {
          state.buyBackList = state.buyBackList.concat(data);
        }
      }
      state.listStatus = Object.assign({}, state.listStatus, {
        hasMore: hasMore,
        isLoading: false,
      });
    },
    [types.SET_BUYBACKINFO_DETAIL](state, data) {
      state.buyBackDetail = data;
    },
    [types.SET_SERIES_LIST](state, list) {
      state.seriesList = list.map((item) => {
        return {
          ...item,
          active: list.indexOf(item) === 0 ? true : false,
        };
      });
      state.groupId = list[0].groupId;
    },
    [types.CHANGE_DIALOG_STATUS](state, payload) {
      state.dialogParams = Object.assign({}, state.dialogParams, payload);
    },
    [types.CHANGE_QUERY_PARAMS](state, payload) {
      state.queryParams = Object.assign({}, state.queryParams, payload);
    },
    [types.CHANGE_LIST_STATUS](state, payload) {
      state.listStatus = Object.assign({}, state.listStatus, payload);
    },
  },
  actions: {
    async buyBackFunc({ commit, rootState }, payload) {
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("获取收益中"),
      });
      const params = {
        provider: rootState.StoreWallet.stcProvider,
        tyArgs: payload.tyArgs,
        args: payload.args,
        type: "BUY_BACK_SELL",
      };
      console.time("===回购合约===");
      console.time("===回购合约gas计算===");
      const txnHash = await Wallet.nftContractCall(params);
      console.timeEnd("===回购合约gas计算===");
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTool.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            console.timeEnd("===回购合约===");
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("接受报价收益成功", {
                  currency: payload.currency,
                  price: payload.price,
                }),
              });
            }, 5000);
          } else {
            console.timeEnd("===回购合约===");
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("获取收益失败"),
            });
          }
        });
      } else {
        console.timeEnd("===回购合约===");
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("获取收益失败"),
        });
      }
    },

    async changeListQuery({ commit, state, dispatch }, payload) {
      commit(
        types.CHANGE_QUERY_PARAMS,
        Object.assign({}, state.INIT_QUERY_PARAMS, {
          pageNum: 1,
          ...payload,
        })
      );
      commit(types.SET_INIT_STATUS);
      dispatch("getBuyBacklist", { type: "init" });
    },
    // 获取平台回购列表
    async getBuyBacklist({ commit, state }, { type }) {
      let res;
      if (type === "init") {
        res = await buyBackApi.getBuyBacklist(state.queryParams);
      } else if (type === "scroll") {
        if (state.listStatus && !state.listStatus.hasMore) {
          return;
        } else {
          commit(
            types.CHANGE_LIST_STATUS,
            Object.assign({}, state.listStatus, {
              isLoading: true,
            })
          );
          let { pageNum } = state.queryParams;
          const queryParams = Object.assign({}, state.queryParams, {
            pageNum: pageNum + 1,
          });
          commit(types.CHANGE_QUERY_PARAMS, queryParams);
          res = await buyBackApi.getBuyBacklist(state.queryParams);
        }
      }
      if (res.code == 200) {
        commit(types.SET_BUYBACK_LIST, {
          data: res.data.map((d) => {
            return {
              ...d,
              nftMeta: d.metaData,
              type: d.nftType,
            };
          }),
          hasMore: res.hasNext,
          type,
        });
      }
      // let res = await buyBackApi.getBuyBacklist(params);
      // if (res.code === 200) {
      //   // const data = res.data.map((d) => {
      //   //   return {
      //   //     ...d,
      //   //     nftMeta: d.metaData,
      //   //     type: "nft",
      //   //   };
      //   // });
      //   // commit(types.SET_BUYBACK_LIST, data);
      // }
    },

    // 获取NFT/盲盒系列列表
    async getSeriesList({ commit }) {
      let res = await buyBackApi.getSeriesList();
      if (res.code === 200) {
        let result = [];
        for (let i = res.data.length - 1; i >= 0; i--) {
          result.push(res.data[i]);
        }
        result.unshift({
          groupId: "",
          groupName: "默认",
          seriesName: "默认",
        });
        commit(types.SET_SERIES_LIST, result);
      }
    },

    async getDetailData({ commit }, { groupId, token, id, account }) {
      if (account) {
        Promise.allSettled([
          buyBackApi.getDetailInfo({ groupId, token, id }),
          buyBackApi.getNFTDetail(id),
        ]).then(async ([a, b]) => {
          let resA = {},
            resB = {};
          if (a.status === "fulfilled" && a.value && a.value.code === 200) {
            resA = a.value.data;
          }
          if (b.status === "fulfilled" && b.value && b.value.code === 200) {
            resB = b.value.data;
          }
          const result = Object.assign({}, resA, resB);
          result.userHoldAmount = 0;
          const res = await commonApi.getUserResourceList(account);
          if (res && res.result && res.result.resources) {
            const nftId = result.nftId;
            const matchString = `NFTGallery::NFTGallery<${result.nftMeta}, ${result.nftBody}>`;
            for (let [k, v] of Object.entries(res.result.resources)) {
              if (k.includes(matchString)) {
                const amountArr = v.json.items.filter((d) => d.id === nftId);
                if (amountArr && amountArr.length) {
                  result.userHoldAmount = 1;
                } else {
                  result.userHoldAmount = 0;
                }
              }
            }
            commit(types.SET_BUYBACKINFO_DETAIL, result);
          } else {
            result.userHoldAmount = 0;
            commit(types.SET_BUYBACKINFO_DETAIL, result);
          }
        });
      }
    },
  },
};

export default StoreBuyBack;
