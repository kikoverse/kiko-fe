import * as types from "../types/swap.js";
import i18n from "../../i18n";
import utilsFormat from "@utils/format";
import utilsNumber from "@utils/number";
import { has, get, isNil, cloneDeep } from "lodash";
import swapApi from "@api/swap.js";
import Wallet from "../../wallet/index";
let count = -1;
let arr = [];
const StoreSwap = {
  namespaced: true,
  moduleName: "StoreSwap",
  state: {
    from: {
      currency: "STC",
      amount: "",
      inputVal: "",
      balance: null,
      exchangePrecision: 0, // 交易精度
      displayPrecision: 0, // 展示精度
      token: "",
      address: "",
    },
    to: {
      currency: "",
      amount: "",
      inputVal: "",
      balance: null,
      exchangePrecision: 0, // 交易精度
      displayPrecision: 0, // 展示精度
      token: "",
      address: "",
    },
    isShowCalcalatorCard: false,
    swapCalcalatorData: null,
    focusType: null,
    isShowConfirm: false,
    totalSwapList: [],
  },
  mutations: {
    [types.CLEAR_SWAP_DATA](state) {
      state.isShowCalcalatorCard = false;
      state.swapCalcalatorData = null;
      state.focusType = null;
      state.from = {};
      state.to = {};
    },
    [types.SET_CALCALATOR_SWAP_DATA](state, payload) {
      state.swapCalcalatorData = payload;
      if (payload) {
        state.isShowCalcalatorCard = true;
      } else {
        state.isShowCalcalatorCard = false;
        state.to.inputVal = "";
        state.from.inputVal = "";
      }
    },
    [types.CHANGE_CONFIRM_VISIBLE](state, payload) {
      state.isShowConfirm = payload;
    },
    [types.TRANSFROM_CURRENCY](state) {
      const from = cloneDeep(state.from);
      const to = cloneDeep(state.to);
      state.from = to;
      state.to = from;
      if (state.focusType === "from") {
        state.focusType = "to";
        return;
      }
      if (state.focusType === "to") {
        state.focusType = "from";
      }
    },
    [types.CHANGE_INPUTVALUE](state, payload) {
      const { value, type } = payload;
      state[type].inputVal = value;
      if (!state.to.currency || !state.from.currency) {
        type === "from" ? (state.to.inputVal = "") : (state.from.inputVal = "");
      }
      if (!payload.automatic) {
        state.focusType = type;
      }
    },
    [types.SHOW_CALCALATOR_CARD](state, payload) {
      state.isShowCalcalatorCard = payload;
    },
    [types.SET_CURRENCY_INFO](state, payload) {
      if (payload.type === "from") {
        state.from = Object.assign({}, state.from, payload);
      }
      if (payload.type === "to") {
        state.to = Object.assign({}, state.to, payload);
      }
    },
    [types.SET_EXCHANGE_TOTAL_HISTORY](state, payload) {
      state.totalSwapList.push(...payload);
    },
  },
  getters: {
    formatFrom:
      (state, getters, rootState) => (walletStatus, currency, token) => {
        const balances = rootState.StoreWallet.balances;
        if (walletStatus === "unConnected" && !currency) {
          return {
            disPlayCurrency: i18n.global.t("选择币种"),
            disPlayBalance: null,
          };
        }
        if (walletStatus === "unConnected" && currency) {
          return { disPlayCurrency: currency, disPlayBalance: null };
        }
        if (walletStatus === "connected" && !currency) {
          return {
            disPlayCurrency: i18n.global.t("选择币种"),
            disPlayBalance: null,
          };
        }
        if (walletStatus === "connected" && currency) {
          let amount = has(balances, token) ? get(balances, token) : 0;
          return {
            disPlayCurrency: currency,
            disPlayBalance: utilsNumber.formatNumberMeta(
              utilsFormat.formatBalance(amount, 9),
              {
                precision: state.from.displayPrecision,
                trailingZero: false,
                round: "floor",
              }
            ).text,
          };
        }
      },
    formatTo:
      (state, getters, rootState) => (walletStatus, currency, token) => {
        const balances = rootState.StoreWallet.balances;
        if (walletStatus === "unConnected" && !currency) {
          return {
            disPlayCurrency: i18n.global.t("选择币种"),
            disPlayBalance: null,
          };
        }
        if (walletStatus === "unConnected" && currency) {
          return { disPlayCurrency: currency, disPlayBalance: null };
        }
        if (walletStatus === "connected" && !currency) {
          return {
            disPlayCurrency: i18n.global.t("选择币种"),
            disPlayBalance: null,
          };
        }
        if (walletStatus === "connected" && currency) {
          let amount = has(balances, token) ? get(balances, token) : 0;
          return {
            disPlayCurrency: currency,
            disPlayBalance: utilsNumber.formatNumberMeta(
              utilsFormat.formatBalance(amount, 9),
              {
                precision: state.to.displayPrecision,
                trailingZero: false,
                round: "floor",
              }
            ).text,
          };
        }
      },
  },
  actions: {
    async transfromCurrencySelect({ commit, rootState, state }, payload) {
      count++;
      if (payload.isTransfer) {
        commit(types.TRANSFROM_CURRENCY);
      }

      // const val = (payload.focusType && state[payload.focusType].inputVal) || 0;
      // if (!val || isNil(val) || utilsNumber.bigNum(val).lte(0)) {
      //   commit(types.SET_CALCALATOR_SWAP_DATA, null);
      //   return;
      // }

      let params = {
        tokenA: state.from.address,
        tokenB: state.to.address,
        slippageTolerance: utilsNumber
          .bigNum(rootState.StoreApp.settings.slippageTolerance)
          .div(100)
          .toString(),
        multiMode: rootState.StoreApp.settings.switchSlippage,
      };
      let res;
      if (state.focusType === "from") {
        // 换入
        if (state.from.inputVal) {
          res = await swapApi.exchangeIn(
            Object.assign({}, params, {
              tokenAmount: state.from.inputVal,
            })
          );
        } else {
          commit(types.CHANGE_INPUTVALUE, {
            value: "",
            type: state.focusType === "to" ? "from" : "to",
            automatic: true,
          });
          arr[count] = null;
          return;
        }
      }
      if (state.focusType === "to") {
        // 换出
        if (state.to.inputVal) {
          res = await swapApi.exchangeOut(
            Object.assign({}, params, {
              tokenAmount: state.to.inputVal,
            })
          );
        } else {
          commit(types.CHANGE_INPUTVALUE, {
            value: "",
            type: state.focusType === "to" ? "from" : "to",
            automatic: true,
          });
          arr[count] = null;
          return;
        }
      }

      arr[count] = res;
      if (count + 1 < arr.length) {
        return;
      }
      if (res && res.code === 200) {
        if (res.data === null) {
          commit(types.CHANGE_INPUTVALUE, {
            value: "",
            type: state.focusType === "to" ? "from" : "to",
            automatic: true,
          });
          return;
        }
        const {
          exchangeAmount,
          avgPriceA,
          avgPriceB,
          priceImpact,
          path,
          payAmount,
          fullPath,
        } = res.data;
        let obj = {
          exchangeAmount,
          payAmount,
          avgPriceA,
          avgPriceB,
          priceImpact:
            utilsNumber.formatNumberMeta(
              utilsNumber.bigNum(priceImpact).times(100).toString(),
              {
                precision: 2,
              }
            ).text + "%",
          path,
          fullPath,
          currency: "",
        };

        if (state.focusType === "from") {
          obj.minReceived = utilsNumber.formatNumberMeta(
            utilsNumber.bigNum(res.data.minReceived),
            {
              precision: state.to.displayPrecision,
              trailingZero: false,
              round: "floor",
            }
          ).text;
          obj.avgPriceB = utilsNumber.formatNumberMeta(
            utilsNumber.bigNum(avgPriceB),
            {
              precision: state.from.displayPrecision,
              trailingZero: false,
              round: "floor",
            }
          ).text;
          obj.priceFormatStr = `${obj.avgPriceB} ${state.from.currency} per ${state.to.currency}`;
          obj.exchangeAmount = utilsNumber.formatNumberMeta(
            utilsNumber.bigNum(exchangeAmount),
            {
              precision: state.to.exchangePrecision,
              trailingZero: false,
              round: "floor",
            }
          ).text;
          obj.currency = state.to.currency;
        }
        if (state.focusType === "to") {
          obj.maxSold = utilsNumber.formatNumberMeta(
            utilsNumber.bigNum(res.data.maxSold),
            {
              precision: state.from.displayPrecision,
              trailingZero: false,
              round: "floor",
            }
          ).text;
          obj.avgPriceB = utilsNumber.formatNumberMeta(
            utilsNumber.bigNum(avgPriceB),
            {
              precision: state.from.displayPrecision,
              trailingZero: false,
              round: "floor",
            }
          ).text;
          obj.priceFormatStr = `${obj.avgPriceB} ${state.from.currency} per ${state.to.currency}`;
          obj.payAmount = utilsNumber.formatNumberMeta(
            utilsNumber.bigNum(payAmount),
            {
              precision: state.from.exchangePrecision,
              trailingZero: false,
              round: "floor",
            }
          ).text;
          obj.currency = state.from.currency;
        }
        if (state.isTransfer) {
          commit(types.CHANGE_INPUTVALUE, {
            value:
              state.focusType === "to" ? obj.payAmount : obj.exchangeAmount,
            type: state.focusType,
            automatic: true,
          });
        } else {
          commit(types.CHANGE_INPUTVALUE, {
            value:
              state.focusType === "to" ? obj.payAmount : obj.exchangeAmount,
            type: state.focusType === "to" ? "from" : "to",
            automatic: true,
          });
        }
        commit(types.SET_CALCALATOR_SWAP_DATA, obj);
      }
    },
    async setSelectCurrencyInfo(
      { commit, state, dispatch, rootState },
      payload
    ) {
      const walletStatus = rootState.StoreWallet.walletStatus;
      if (walletStatus === "connected") {
        // 连接钱包自动获取余额
        let params = {
          provider: rootState.StoreWallet.stcProvider,
          account: rootState.StoreWallet.accounts[0],
        };
        if (payload.token) {
          params.token = payload.token;
        }
        const balance = await Wallet.getAccountBalance(params);
        if (!isNil(balance)) {
          commit(
            "StoreWallet/SET_WALLET_BALANCE",
            {
              [payload.token]: balance,
            },
            { root: true }
          );
        }
      }
      // 整合展示数据
      // 币种都选择且任一input有值
      // 缺少一个逻辑
      // 当选的币种已经是被选了
      // 相当于是做了一个切换
      const dir = payload.type === "to" ? "from" : "to";
      if (state[dir].currency === payload.currency) {
        commit(types.TRANSFROM_CURRENCY);
      }
      commit(types.SET_CURRENCY_INFO, payload);

      if (state.focusType && state.to.currency && state.from.currency) {
        dispatch("transfromCurrencySelect", {
          transfer: false,
          focusType: state.focusType,
        });
      }
    },
    async getExchangeHistoryList({ commit }, params) {
      let res = await swapApi.getExchangeHistory(params);
      let list = [];
      if (res.code === 200) {
        if (res.data && res.data.length) {
          //  res.data =
          list = res.data.map((d) => {
            return {
              ...d,
              tokenCodeX: d.tokenCodeX.split("::")[2],
              tokenCodeY: d.tokenCodeY.split("::")[2],
            };
          });
        }
        commit(types.SET_EXCHANGE_TOTAL_HISTORY, list);
      }
    },
  },
};

export default StoreSwap;
