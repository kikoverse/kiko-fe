import * as types from "../../types/NFT/collection";

import collectionApi from "@/api/nft/collection";
// import commonApi from "@/api/common";
import utilsTools from "@utils/tool";
import { cloneDeep } from "lodash";
import NFT_CONSTANTS from "@constants/nft.js";
import Wallet from "@wallet";
import utilsFormat from "@utils/format";

const StoreCollection = {
  namespaced: true,
  moduleName: "StoreCollection",
  state: {
    groupList: null,
    change_confirm_visible: false,
    show_rules: [true, true],
    // unsold_nft_data: [],
    // unsold_box_data: [],
    detail_info: null,
    detail_type: null,
    sellingData: null,
    isLoading: true,
    purchaseData: [],
    sellRecordData: [],
    dialogParams: NFT_CONSTANTS.INIT_DIALOG_PARAMS,
    secondDialogParams: NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS,
    bidPriceDialogParams: NFT_CONSTANTS.BID_PRICE_DIALOD_PARAMS,
    soldDialogParams: NFT_CONSTANTS.INIT_SOLD_DIALOG_PARAMS,
    onSellIsLoading: false,
    unSellData: false,
    purchaseQuery: {
      pageNum: 0,
      hasNext: true,
    },
    sellQuery: {
      pageNum: 0,
      hasNext: true,
    },
  },
  mutations: {
    [types.CHANGE_SOLD_DIALOG_PARAMS](state, payload) {
      state.soldDialogParams = Object.assign(
        {},
        state.soldDialogParams,
        payload
      );
    },
    [types.CHANGE_ON_SELL_IS_LOADING](state, payload) {
      state.onSellIsLoading = payload;
    },
    [types.SET_SALE_HISTORY_QUERY](state, payload) {
      state.sellQuery = payload;
    },
    [types.SET_PURCHASE_HISTORY_QUERY](state, payload) {
      state.purchaseQuery = payload;
    },
    [types.SET_SALE_HISTORY_DATA](state, payload) {
      const { data } = payload;
      state.sellRecordData = data;
      state.isLoading = false;
    },
    [types.SET_PURCHASE_HISTORY_DATA](state, payload) {
      const { data } = payload;
      state.purchaseData = data;
      state.isLoading = false;
    },
    [types.SET_SELLING_DATA](state, payload) {
      state.sellingData = payload;
      state.onSellIsLoading = false;
    },
    [types.SET_UNSELL_DATA](state, payload) {
      state.unSellData = payload;
      state.isLoading = false;
    },
    [types.SET_LOADING_STATUS](state, payload) {
      state.isLoading = payload;
    },
    [types.SET_DETAIL_TYPE](state, payload) {
      state.detail_type = payload;
    },
    [types.SET_DETAIL_INFO](state, payload) {
      state.detail_info = payload;
    },
    [types.SET_SHOW_RULES](state, payload) {
      state.show_rules = payload;
    },
    [types.SET_UNSOLD_NFT_DATA](state, data) {
      state.unsold_nft_data = data;
    },

    [types.SET_UNSOLD_BOX_DATA](state, data) {
      if (data && data.length) {
        state.unsold_box_data = state.unsold_box_data.concat(data);
      } else {
        state.unsold_box_data = [];
      }
    },
    [types.CHANGE_DIALOG_STATUS](state, payload) {
      state.dialogParams = Object.assign({}, state.dialogParams, payload);
    },
    [types.CHANGE_SECOND_DIALOG_STATUS](state, payload) {
      state.secondDialogParams = Object.assign(
        {},
        state.secondDialogParams,
        payload
      );
    },
    [types.CHANGE_BID_PRICE_DIALOG_PARAMS](state, payload) {
      state.bidPriceDialogParams = Object.assign(
        {},
        state.bidPriceDialogParams,
        payload
      );
    },
  },
  getters: {
    selling_data: (state) => {
      const rules = state.show_rules;
      let list = cloneDeep(state.sellingData || []);
      if (list && list.length > 0) {
        if (rules[0] && !rules[1]) {
          list = list.filter((d) => d.type === "box");
        }
        if (!rules[0] && rules[1]) {
          list = list.filter((d) => d.type === "nft");
        }
        if (!rules[0] && !rules[1]) {
          list = [];
        }
      }
      return list;
    },
    unsold_data: (state) => {
      let list = cloneDeep(state.unSellData);
      const rules = state.show_rules;
      if (rules[0] && !rules[1]) {
        // 只要box
        list = list.filter((d) => d.type === "box");
      }
      if (!rules[0] && rules[1]) {
        list = list.filter((d) => d.type !== "box");
      }
      if (!rules[0] && !rules[1]) {
        list = [];
      }
      return list;
    },
    tab_list(state) {
      return [
        {
          name: "我的系列",
          num: null,
          key: 0,
          showCount: true,
        },
        {
          name: "未出售",
          num: (state.unSellData && state.unSellData.length) || 0,
          key: 1,
          showCount: true,
        },
        {
          name: "销售中",
          num: (state.sellingData && state.sellingData.length) || 0,
          key: 2,
          showCount: true,
        },
        {
          name: "购买记录",
          key: 3,
          showCount: false,
        },
        {
          name: "出售记录",
          key: 4,
          showCount: false,
        },
      ];
    },
  },
  actions: {
    //获取未出售盲盒详情
    async getBoxDetail({ commit }, payload) {
      let res = await collectionApi.getBoxDetail(
        payload.boxToken,
        payload.userAddress
      );
      if (res.code === 200) {
        commit(types.SET_DETAIL_INFO, res.data);
        commit(types.SET_DETAIL_TYPE, "box");
      }
    },

    //未出售nft详情
    async getNftDetail({ commit }, payload) {
      const res = await collectionApi.getNftDetail(
        payload.nftMeta,
        payload.nftBody,
        payload.nftId,
        payload.payToken
      );
      if (res.code === 200) {
        commit(types.SET_DETAIL_INFO, res.data);
        commit(types.SET_DETAIL_TYPE, "nft");
      }
    },
    // 获取我的未出售数据
    /* eslint-disable-next-line*/
    async getUnSellingData({ commit }, userAddress) {
      let res = await collectionApi.getUnSellingData(userAddress);
      console.log("getUnSellingData", res);
      if (res.code === 200) {
        let data = [];
        if (res.data && res.data.length) {
          data = res.data.map((d) => {
            return {
              ...d,
              icon: d.imageLink,
              // isBox: d.collectionType === "box" ? true : false,
            };
          });
        }
        commit(types.SET_UNSELL_DATA, data);
      }
    },
    //获取出售中的列表
    async getSellingData({ commit }, userAddress) {
      commit(types.CHANGE_ON_SELL_IS_LOADING, true);
      const res = await collectionApi.getSellingData(userAddress);
      if (res.code === 200) {
        if (res.data && res.data.length) {
          res.data.reverse();
        }
        commit(types.SET_SELLING_DATA, res.data);
      }
    },
    //出售中nft详情
    async getSellingNftDetail({ commit }, infoId) {
      const res = await collectionApi.getSellingNftDetail(infoId);
      if (res.code === 200) {
        commit(types.SET_DETAIL_INFO, res.data);
        commit(types.SET_DETAIL_TYPE, "nft");
      }
    },
    //出售中盲盒详情
    async getSellingBoxDetail({ commit }, payload) {
      const res = await collectionApi.getSellingBoxDetail(
        payload.groupId,
        payload.chainId
      );
      if (res.code === 200) {
        commit(types.SET_DETAIL_INFO, res.data);
        commit(types.SET_DETAIL_TYPE, "box");
      }
    },
    async getPurchaseHistory({ commit, state }, payload) {
      let pageNum = 1;
      if (payload.type === "change") {
        commit(types.SET_PURCHASE_HISTORY_QUERY, {
          pageNum,
        });
      } else if (payload.type === "click") {
        pageNum = state.purchaseQuery.pageNum;
        if (payload.direction === "prev") {
          if (pageNum <= 1) return;
          pageNum = pageNum - 1;
        }
        if (payload.direction === "next") {
          if (!state.purchaseQuery.hasNext) return;

          pageNum = pageNum + 1;
        }
      }
      const res = await collectionApi.getPurchaseHistory({
        address: payload.address,
        pageNum,
      });
      if (res.code === 200) {
        commit(types.SET_PURCHASE_HISTORY_DATA, {
          data: res.data,
        });
        commit(types.SET_PURCHASE_HISTORY_QUERY, {
          hasNext: res.hasNext,
          pageNum,
        });
      }
    },
    async getSalesHistory({ commit, state }, payload) {
      let pageNum = 1;
      if (payload.type === "change") {
        commit(types.SET_SALE_HISTORY_QUERY, {
          pageNum,
        });
      } else if (payload.type === "click") {
        pageNum = state.sellQuery.pageNum;
        if (payload.direction === "prev") {
          if (pageNum <= 1) return;
          pageNum = pageNum - 1;
        }
        if (payload.direction === "next") {
          if (!state.sellQuery.hasNext) return;
          pageNum = pageNum + 1;
        }
      }
      const res = await collectionApi.getSalesHistory({
        address: payload.address,
        pageNum,
      });
      if (res.code === 200) {
        commit(types.SET_SALE_HISTORY_DATA, {
          data: res.data,
        });
        commit(types.SET_SALE_HISTORY_QUERY, {
          hasNext: res.hasNext,
          pageNum,
        });
      }
    },
    /* eslint-disable-next-line*/
    async getOpenBoxIdByHash({}, payload) {
      const res = await utilsTools.getOpenBoxIdByHash({
        txnHash: payload.txnHash,
        boxToken: payload.boxToken,
      });
      if (res.result && res.result.length > 0) {
        const k = res.result.filter((d) =>
          d.type_tag.includes(payload.boxToken)
        );
        if (k && k.length) {
          const id = k[0].decode_event_data.id;
          return String(id);
        }
      }
    },
    /* eslint-disable */
    async openBlindBoxCall({ rootState, commit, dispatch }, payload) {
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("开启中"),
      });
      const boxTokenArr = payload.boxTokenArr;
      const params = {
        provider: rootState.StoreWallet.stcProvider,
        blindboxId: `${boxTokenArr[0]}::${boxTokenArr[1]}`,
        type: "OPEN",
      };
      const txnHash = await Wallet.openBlindBox(params);
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTools.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            const boxToken = `${boxTokenArr[0]}::${boxTokenArr[1]}::BoxOpenEvent`;
            utilsTools
              .getOpenBoxIdByHash({ txnHash, boxToken })
              .then(async (id) => {
                const nftInfo = await collectionApi.getNftDetail(
                  payload.nftMeta,
                  payload.nftBody,
                  id
                );
                if (nftInfo.code === 200) {
                  commit(types.CHANGE_DIALOG_STATUS, {
                    phase2: "success",
                  });
                  setTimeout(() => {
                    commit(types.CHANGE_DIALOG_STATUS, {
                      title: nftInfo.data.name,
                      customImgUrl: nftInfo.data.imageLink, //
                      dialogStatus: "success",
                      dialogText: "",
                      successBtnText: utilsFormat.computedLangCtx("查看"),
                      isBlindBox: false,
                    });
                  }, 500);
                }
              });
          } else {
            console.timeEnd("===盲盒开启===");
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("开启失败"),
              customImgUrl: "",
            });
          }
        });
       
      } else {
        console.timeEnd("===盲盒开启===");
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("开启失败"),
          customImgUrl: "",
        });
      }
    },
    async sellContractsCall({ rootState, commit, state }, payload) {
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("上架中"),
      });
      const { type, args, tyArgs } = payload;
      let params = Object.assign(
        {},
        {
          args,
          tyArgs,
          provider: rootState.StoreWallet.stcProvider,
          type: "SELL",
        }
      );
      console.time("===出售合约===");
      console.time("===出售合约gas计算===");
      let txnHash =
        type === "box"
          ? await Wallet.blindBoxContractCall(params)
          : await Wallet.nftContractCall(params);
      console.timeEnd("===出售合约gas计算===");
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTools.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            console.timeEnd("===出售合约===");
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("商品上架成功"),
              });
            }, 5000);
          } else {
            console.timeEnd("===出售合约===");
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("商品上架失败"),
            });
          }
        });
      } else {
        console.timeEnd("===出售合约===");
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("商品上架失败"),
        });
      }
    },
    async cancelSellContractsCall({ rootState, commit }, payload) {
      let onSell;
      if (payload.type === "box") {
        const boxStatus = await collectionApi.getSellingBoxDetail(
          payload.groupId,
          payload.chainId
        );
        if (boxStatus.code === 200) {
          onSell = boxStatus.data.onSell;
        }
      } else {
        const nftStatus = await collectionApi.getSellingNftDetail(
          payload.infoId
        );
        if (nftStatus.code === 200) {
          onSell = nftStatus.data.onSell;
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
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("下架中"),
      });
      const { type, args, tyArgs } = payload;
      let params = Object.assign(
        {},
        {
          args,
          tyArgs,
          provider: rootState.StoreWallet.stcProvider,
          type: "OFFLINE",
        }
      );
      console.time("===collection:取消出售合约===");
      console.time("===collection:取消出售合约gas计算===");
      let txnHash =
        type === "box"
          ? await Wallet.blindBoxContractCall(params)
          : await Wallet.nftContractCall(params);
      console.timeEnd("===collection:取消出售合约gas计算===");
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTools.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            console.timeEnd("===collection:取消出售合约======");
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("商品下架成功"),
              });
            }, 5000);
          } else {
            console.timeEnd("===collection:取消出售合约======");
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("商品下架失败"),
            });
          }
        });
      } else {
        console.timeEnd("===collection:取消出售合约===");
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("商品下架失败"),
        });
      }
    },
    async acceptBidContractsCall({ rootState, commit }, payload) {
      let onSell;
      if (payload.type === "box") {
        const boxStatus = await collectionApi.getSellingBoxDetail(
          payload.groupId,
          payload.chainId
        );
        if (boxStatus.code === 200) {
          onSell = boxStatus.data.onSell;
        }
      } else {
        const nftStatus = await collectionApi.getSellingNftDetail(
          payload.infoId
        );
        if (nftStatus.code === 200) {
          onSell = nftStatus.data.onSell;
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
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("获取收益中"),
      });
      const { type, args, tyArgs } = payload;
      let params = Object.assign(
        {},
        {
          args,
          tyArgs,
          provider: rootState.StoreWallet.stcProvider,
          type: "ACCEPT_PRICE",
        }
      );
      console.time("===collection:接受报价合约===");
      console.time("===collection:接受报价合约gas计算===");
      let txnHash =
        type === "box"
          ? await Wallet.blindBoxContractCall(params)
          : await Wallet.nftContractCall(params);
      console.timeEnd("===collection:接受报价合约gas计算===");
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTools.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            console.timeEnd("===collection:接受报价合约===");
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                // dialogStatus: "success",
                // dialogText: utilsFormat.computedLangCtx("商品下架成功"),
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("接受报价收益成功", {
                  currency: payload.currency,
                  price: payload.price,
                }),
              });
            }, 5000);
          } else {
            console.timeEnd("===collection:接受报价合约===");
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("获取收益失败"),
            });
          }
        });
      } else {
        console.timeEnd("===collection:接受报价合约===");
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("获取收益失败"),
        });
      }
    },
    async updatePriceContractsCall({ rootState, commit }, payload) {
      let onSell;
      if (payload.type === "box") {
        const boxStatus = await collectionApi.getSellingBoxDetail(
          payload.groupId,
          payload.chainId
        );
        if (boxStatus.code === 200) {
          onSell = boxStatus.data.onSell;
        }
      } else {
        const nftStatus = await collectionApi.getSellingNftDetail(
          payload.infoId
        );
        if (nftStatus.code === 200) {
          onSell = nftStatus.data.onSell;
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
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("更改售价中"),
      });
      const { type, args, tyArgs } = payload;
      const provider = rootState.StoreWallet.stcProvider;
      console.time("===collection:更改售价合约===");
      console.time("===collection:更改售价合约gas计算===");
      const txnHash =
        type === "box"
          ? await Wallet.blindBoxContractCall({
              provider,
              args,
              tyArgs,
              type: "CHANGE_PRICE",
            })
          : await Wallet.nftContractCall({
              provider,
              args,
              tyArgs,
              type: "CHANGE_PRICE",
            });

      console.timeEnd("===collection:更改售价合约gas计算===");
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTools.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            console.timeEnd("===collection:更改售价合约===");
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
            console.timeEnd("===collection:更改售价合约===");
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("售价更改失败"),
            });
          }
        });
      } else {
        console.timeEnd("===collection:更改售价合约===");
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("售价更改失败"),
        });
      }
    },

    async sellBoxPrice({ commit, rootState }, payload) {
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("上架中"),
      });
      const params = {
        provider: rootState.StoreWallet.stcProvider,
        tyArgs: payload.tyArgs,
        args: payload.args,
        type: payload.sellType === 0 ? "FIX_PRICE_SELL" : "BID_PRICE_SELL",
      };
      const txnHash = await Wallet.sellboxPrice(params);
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTools.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("已上架"),
              });
            }, 5000);
          } else {
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("上架失败"),
            });
          }
        });
      } else {
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("上架失败"),
        });
      }
    },

    async sellNFTPrice({ commit, rootState }, payload) {
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("上架中"),
      });
      const params = {
        provider: rootState.StoreWallet.stcProvider,
        tyArgs: payload.tyArgs,
        args: payload.args,
        type: payload.sellType === 0 ? "FIX_PRICE_SELL" : "BID_PRICE_SELL",
      };
      const txnHash = await Wallet.sellNFTPrice(params);
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTools.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("已上架"),
              });
            }, 5000);
          } else {
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("上架失败"),
            });
          }
        });
      } else {
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("上架失败"),
        });
      }
    },
  },
};

export default StoreCollection;
