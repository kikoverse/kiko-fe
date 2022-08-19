import * as types from "../../types/NFT/blindbox.js";
import blindboxApi from "@api/nft/blindbox";
import commonApi from "@api/common";
import Wallet from "@wallet";
import utilsTool from "@utils/tool.js";
import dayjs from "dayjs";
import NFT_CONSTANTS from "@constants/nft.js";
import utilsFormat from "@utils/format";

/* eslint-disable*/
const INIT_QUERY_PARAMS = {
  pageSize: 20,
  pageNum: 1,
};
const INIT_LIST_STATUS = {
  hasMore: true,
  isLoading: false,
};

const StoreBlindBox = {
  namespaced: true,
  moduleName: "StoreBlindBox",
  state: {
    blindBoxData: null,
    isShowBuyModal: false,
    isShowImportModal: false,
    buyStatus: "ongoing",
    remainQuantity: null, // 剩余购买量
    listData: [],
    firstLoading: true,
    queryParams: INIT_QUERY_PARAMS,
    listStatus: INIT_LIST_STATUS,
    dialogParams: NFT_CONSTANTS.INIT_DIALOG_PARAMS,
    soldDialogParams: NFT_CONSTANTS.INIT_SOLD_DIALOG_PARAMS,
  },
  mutations: {
    [types.SET_SOLD_DIALOG_PARAMS](state, payload) {
      state.soldDialogParams = Object.assign(
        {},
        state.soldDialogParams,
        payload
      );
    },
    [types.CLEAR_DATA](state) {
      state.queryParams = INIT_QUERY_PARAMS;
      state.listData = [];
      state.listStatus = INIT_LIST_STATUS;
      state.firstLoading = true;
    },
    [types.SET_BLINDBOX_LIST](state, payload) {
      const { data, hasMore, type } = payload;
      if (type === "init") {
        state.firstLoading = false;
        state.listData = data;
      }
      if (type === "scroll") {
        if (state.listData && state.listData.length > 0 && data) {
          state.listData = state.listData.concat(data);
        }
      }
      state.listStatus = Object.assign({}, state.listStatus, {
        hasMore: hasMore,
        isLoading: false,
      });
    },
    [types.SET_BLINDBOX_DATA](state, payload) {
      state.blindBoxData = payload;
    },
    [types.CHANGE_BUY_MODAL_STATUS](state, payload) {
      state.isShowBuyModal = payload;
    },
    [types.SET_IMPORT_MODAL_STATUS](state, payload) {
      state.isShowImportModal = payload;
    },
    [types.CHANGE_BUY_CB_MODAL_STATUS](state, payload) {
      state.dialogParams = Object.assign({}, state.dialogParams, payload);
    },
    [types.SET_BLINDBOX_REMAIN_QUANTITIY](state, payload) {
      state.remainQuantity = payload;
    },
    [types.CHANGE_LIST_STATUS](state, payload) {
      state.listStatus = Object.assign({}, state.listStatus, payload);
    },
    [types.CHANGE_QUERY_PARAMS](state, payload) {
      state.queryParams = Object.assign({}, state.queryParams, payload);
    },
  },
  getters: {
    productStatus: (state) => {
      // sellout 售罄 ongoing能购买  未开始 unopened
      let flag = "";
      if (
        state.blindBoxData &&
        state.blindBoxData.sellingTime &&
        state.remainQuantity
      ) {
        if (dayjs().isAfter(state.blindBoxData.sellingTime)) {
          if (state.remainQuantity && Number(state.remainQuantity) <= 0) {
            flag = "sellout";
          } else {
            flag = "ongoing";
          }
        } else {
          flag = "unopened";
        }
      }
      return flag;
    },
  },
  actions: {
    async buyBlindbox(
      { rootState, dispatch, commit, state },
      { tyArgs, args, boxToken }
    ) {
      if (!boxToken) return;
      const isExistedBox = await blindboxApi.getOfferingAmount(boxToken);
      if (isExistedBox.result && isExistedBox.result.value) {
        const amount =
          isExistedBox.result.value[0][1]["Struct"]["value"][0][1]["U128"];
        if (String(amount) === "0") {
          commit(
            "CHANGE_BUY_CB_MODAL_STATUS",
            NFT_CONSTANTS.INIT_DIALOG_PARAMS
          );
          // 此时没有了
          commit("SET_SOLD_DIALOG_PARAMS", {
            isShow: true,
            text: utilsFormat.computedLangCtx("购买失败"),
            subText: utilsFormat.computedLangCtx("已经被抢光了"),
            btnText: utilsFormat.computedLangCtx("确认"),
          });
          return;
        }
        if (Number(args[0]) > Number(amount)) {
          commit(
            "CHANGE_BUY_CB_MODAL_STATUS",
            NFT_CONSTANTS.INIT_DIALOG_PARAMS
          );
          commit("SET_SOLD_DIALOG_PARAMS", {
            isShow: true,
            text: utilsFormat.computedLangCtx("平台剩余数量不足"),
            btnText: utilsFormat.computedLangCtx("确认"),
          });
          return;
        }
      }
      const params = {
        provider: rootState.StoreWallet.stcProvider,
        type: "BUY_FROM_OFFERING",
        tyArgs,
        args,
      };
      console.time("===购买盲盒合约===");
      console.time("===购买盲盒合约gas计算===");
      const txnHash = await Wallet.blindBoxContractCall(params);
      console.timeEnd("===购买盲盒合约gas计算===");
      if (txnHash !== "error") {
        commit("CHANGE_BUY_CB_MODAL_STATUS", {
          phase1: "success",
        });
        utilsTool.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            // 查询到信息
            dispatch("getOfferingAmount", {
              boxToken: state.blindBoxData.boxToken,
              type: "detail",
            });
            commit("CHANGE_BUY_CB_MODAL_STATUS", {
              phase2: "success",
            });
            console.timeEnd("===购买盲盒合约===");
            setTimeout(() => {
              commit("CHANGE_BUY_CB_MODAL_STATUS", {
                dialogStatus: "success",
                dialogText: "购买成功",
              });
            }, 4000);
          } else {
            console.timeEnd("===购买盲盒合约===");
            commit("CHANGE_BUY_CB_MODAL_STATUS", {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("购买失败"),
            });
          }
        });
      } else {
        dispatch("getOfferingAmount", {
          boxToken: state.blindBoxData.boxToken,
          type: "detail",
        });
        commit("CHANGE_BUY_MODAL_STATUS", false);
        commit("CHANGE_BUY_CB_MODAL_STATUS", {
          dialogStatus: "failed",
          dialogText: "购买失败",
        });
      }
    },

    async importBlindBoxGallery(
      { rootState, commit, dispatch },
      { tyArgs, type, account }
    ) {
      const res = await commonApi.getUserResourceList(account);
      if (res && res.result && res.result.resources) {
        let matchString = "";
        if (type === "blindbox") {
          matchString = tyArgs[0];
        } else {
          matchString = `NFTGallery::NFTGallery<${tyArgs[0]}, ${tyArgs[1]}>`;
        }
        for (let [k, v] of Object.entries(res.result.resources)) {
          if (k.includes(matchString)) {
            commit("CHANGE_BUY_CB_MODAL_STATUS", {
              isShow: true,
              dialogStatus: "success",
              dialogText: utilsFormat.computedLangCtx("已导入"),
              successBtnText: "",
            });
            return false;
          }
        }
      }
      commit("CHANGE_BUY_CB_MODAL_STATUS", {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("导入中"),
      });
      const params = {
        provider: rootState.StoreWallet.stcProvider,
        type: type === "blindbox" ? "ACCEPT_TOKEN" : "ACCEPT",
        tyArgs,
      };
      let txnHash = null;
      if (type === "blindbox") {
        txnHash = await Wallet.importBlindBox(params);
      } else {
        txnHash = await Wallet.importGallery(params);
      }
      if (txnHash !== "error") {
        commit("CHANGE_BUY_CB_MODAL_STATUS", {
          phase1: "success",
        });
        utilsTool.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            // 查询到信息
            dispatch("getOfferingList", {
              type: "init",
            });
            commit("CHANGE_BUY_CB_MODAL_STATUS", {
              phase2: "success",
            });
            setTimeout(() => {
              commit("CHANGE_BUY_CB_MODAL_STATUS", {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("导入成功"),
                successBtnText: "",
              });
            }, 4000);
          } else {
            commit("CHANGE_BUY_CB_MODAL_STATUS", {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("导入失败"),
              successBtnText: "",
            });
          }
        });
      } else {
        dispatch("getOfferingList", {
          type: "init",
        });
        commit("SET_IMPORT_MODAL_STATUS", false);
        commit("CHANGE_BUY_CB_MODAL_STATUS", {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("导入失败"),
        });
      }
    },
    async getOfferingList({ commit, dispatch, state }, payload) {
      const { type } = payload;
      let res;
      if (type === "init") {
        res = await blindboxApi.getOfferingList(state.queryParams);
      } else if (type === "scroll") {
        if (!state.listStatus.hasMore) return;
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
        res = await blindboxApi.getOfferingList(queryParams);
      }
      if (res.code === 200) {
        let data = res.data;
        if (data && data.length) {
          // const tokens = data.map((d) => d.boxToken);
          // const amountArr = tokens.map(async (boxToken, index) => {
          //   const amount = await dispatch("getOfferingAmount", {
          //     boxToken,
          //     type: "list",
          //   });
          //   return { amount: amount || 0, index };
          // });
          // for (const item of amountArr) {
          //   const itmeRes = await item;
          //   data[itmeRes.index].amount = await itmeRes.amount;
          // }
          data = data.map((d) => {
            let sellType = "sellout";//selling
            if (Number(d.amount) <= 0) {
              sellType = "sellout";
            } else {
              if (d.sellingTime && dayjs().isBefore(d.sellingTime)) {
                sellType = "willsell";
              }
            }
            return {
              ...d,
              type: sellType,
            };
          });
        }
        if (type === "scroll") {
          data = state.listData.concat(data)
        }
        commit(types.SET_BLINDBOX_LIST, {
          data: data || [],
          hasMore: res.hasNext,
          type,
        });
        return data;
      }
    },
    async getOfferingAmount({ commit }, { boxToken, type }) {
      const res = await blindboxApi.getOfferingAmount(boxToken);
      if (res.result && res.result.value) {
        const amount = res.result.value[0][1]["Struct"]["value"][0][1]["U128"];
        if (type !== "list") {
          commit(types.SET_BLINDBOX_REMAIN_QUANTITIY, String(amount));
        } else {
          return String(amount);
        }
      } else {
        if (type !== "list") {
          commit(types.SET_BLINDBOX_REMAIN_QUANTITIY, "0");
        }
      }
    },
    async getOfferingBoxData({ commit, dispatch }, { id }) {
      const res = await blindboxApi.getOfferingBoxData(id);
      if (res.code === 200) {
        const {
          cnDescription,
          enDescription,
          cnRuleDesc,
          enRuleDesc,
          cnCreatorDesc,
          enCreatorDesc,
          boxToken,
        } = res.data;
        if (boxToken) {
          dispatch("getOfferingAmount", { boxToken, type: "detail" });
        }
        const payload = {
          introduces: [
            {
              title: "商品描述",
              cnDesc: cnDescription,
              enDesc: enDescription,
            },
            {
              title: "规则介绍",
              cnDesc: cnRuleDesc,
              enDesc: enRuleDesc,
            },
            {
              title: "关于艺术家",
              cnDesc: cnCreatorDesc,
              enDesc: enCreatorDesc,
            },
          ],
          ...res.data,
        };
        commit(types.SET_BLINDBOX_DATA, payload);
      }
    },
  },
};

export default StoreBlindBox;
