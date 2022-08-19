import * as types from "../types/liquidity.js";
import i18n from "../../i18n";
import utilsFormat from "@utils/format";
import utilsNumber from "@utils/number";
import { has, get, cloneDeep, isNil } from "lodash";
import Wallet from "../../wallet/index";
import liquidityApi from "@api/liquidity.js";
import utilsTool from "@utils/tool.js";
import { WALLET_DIALOG_PARAMS } from "@constants/dialog.js";
function formatLiquidityInfo(c1, c2, tokensInfo, fValue, tValue, flag) {
  let result = [];
  result[0] = {
    label: `${c2}/${c1}`,
  };
  result[1] = {
    label: `${c1}/${c2}`,
  };
  result[2] = {
    label: i18n.global.t("资金池中份额"),
  };
  if (flag) {
    const { x, y, xCurrency } = tokensInfo;

    // 有流动池
    result[0].data =
      utilsNumber.formatNumberMeta(utilsNumber.bigNum(y).div(x).toString(), {
        precision: 9,
        trailingZero: false,
      }).text || "-";
    result[1].data =
      utilsNumber.formatNumberMeta(utilsNumber.bigNum(x).div(y).toString(), {
        precision: 9,
        trailingZero: false,
      }).text || "-";
    let sharePool;
    if (x && y && fValue) {
      sharePool = utilsNumber.formatNumberMeta(
        xCurrency === c1
          ? utilsNumber
              .bigNum(fValue)
              .div(utilsNumber.bigNum(fValue).plus(x))
              .times(100)
              .toString()
          : utilsNumber
              .bigNum(fValue)
              .div(utilsNumber.bigNum(fValue).plus(y))
              .times(100)
              .toString(),
        {
          precision: 2,
          trailingZero: false,
          round: "floor",
        }
      ).text;
      if (utilsNumber.bigNum(sharePool).gte(99.99)) {
        sharePool = ">99.99%";
      } else if (utilsNumber.bigNum(sharePool).lte(0.01)) {
        sharePool = "<0.01%";
      } else {
        sharePool = sharePool + "%";
      }
    } else if (!x || !y) {
      sharePool = "0%";
    } else if ((x || y) && !fValue) {
      sharePool = "-";
    }
    result[2].data = sharePool;
  } else {
    // 无流动池
    result[0].data =
      fValue && tValue
        ? utilsNumber.bigNum(tValue).div(fValue).toString()
        : "-";
    result[1].data =
      fValue && tValue
        ? utilsNumber.bigNum(fValue).div(tValue).toString()
        : "-";
    result[2].data = fValue && tValue ? "100%" : "-";
  }

  return result;
}

function getOppositeValue(x, y, c1, c2, value, precision) {
  let oppositeValue = 0;
  if (c1 === c2) {
    oppositeValue = utilsNumber.bigNum(value).times(y).div(x).toString();
  } else {
    oppositeValue = utilsNumber.bigNum(value).times(x).div(y).toString();
  }
  return utilsNumber.formatNumberMeta(oppositeValue, {
    precision,
    trailingZero: false,
  }).text;
}

function decoratorXY({ state, commit, res, direction }) {
  const x = utilsFormat.formatBalance(res[2][1]["U128"], 9);
  const y = utilsFormat.formatBalance(res[3][1]["U128"], 9);
  if (direction === "from") {
    const xCurrency = state.from.currency;
    const yCurrency = state.to.currency;
    commit(types.ADD_TOKEN_INFO, {
      A: state.from.token,
      B: state.to.token,
      xCurrency,
      yCurrency,
    });
    return {
      x,
      y,
      xCurrency,
      yCurrency,
    };
  }
  if (direction === "to") {
    const xCurrency = state.to.currency;
    const yCurrency = state.from.currency;
    commit(types.ADD_TOKEN_INFO, {
      A: state.to.token,
      B: state.from.token,
      xCurrency,
      yCurrency,
    });
    return {
      x,
      y,
      xCurrency,
      yCurrency,
    };
  }
}

function noExistedXY({ commit, direction, state }) {
  commit(types.ADD_TOKEN_INFO, null);
  commit(types.SET_XY_INFO, null);
  commit(types.SET_CURRENCY_INFO, {
    type: "from",
    inputVal: "",
  });
  commit(types.SET_CURRENCY_INFO, {
    type: "to",
    inputVal: "",
  });
  if (direction === "from") {
    return {
      xCurrency: state.from.currency,
      yCurrency: state.to.currency,
      x: null,
      y: null,
    };
  }
  if (direction === "to") {
    return {
      xCurrency: state.to.currency,
      yCurrency: state.from.currency,
      x: null,
      y: null,
    };
  }
}
const StoreLiquidity = {
  namespaced: true,
  moduleName: "StoreLiquidity",
  state: {
    isShowSearchDialog: false, // 币种选择弹窗
    isShowHistoryRecordDialog: false, // 流水记录
    currencySelectType: null, // 币种设置方向 from to
    tokensXY: null, // 币种对的x、y、xCurrency, yCurrency
    focusType: null,
    poolList: null,
    from: {},
    to: {}, //currency inputVal balance amount
    hasLiquidity: false, // 用户是否有流动池记录
    poolType: "init", // init原始状态 add 添加状态 del 删除状态
    isShowConfirm: false,
    addToken: null, // 记录两次查找后的最终确定池子token
    delInpVal: "",
    lpDelInfo: null,
    totalLiquidityList: [],
    lpTokenAmount: null,
    walletDialogParams: {
      ...WALLET_DIALOG_PARAMS,
      dialogText: "正在添加流动性",
      successText: "流动性添加成功",
      failedText: "流动性添加失败",
    },
    loading: false,
  },
  mutations: {
    [types.SET_LPTOKEN_TOTAL_AMOUNT](state, payload) {
      state.lpTokenAmount = payload;
    },
    [types.CLEAR_DELETE_INFO](state) {
      state.delInpVal = "";
      state.tokensXY = null;
      state.lpDelInfo = null;
      state.poolType = "init";
      state.lpTokenAmount = null;
    },
    [types.SET_WALLET_DIALOG_PARAMS](state, payload) {
      state.walletDialogParams = Object.assign(
        {},
        state.walletDialogParams,
        payload
      );
    },
    [types.CLEAR_ADD_INFO](state) {
      state.addToken = null;
      state.from = {};
      state.to = {};
      state.tokensXY = null;
      state.focusType = null;
      state.currencySelectType = null;
      state.poolType = "init";
    },
    [types.ADD_TOKEN_INFO](state, payload) {
      state.addToken = payload;
    },
    [types.ADD_LOADING_INFO](state, payload) {
      state.loading = payload;
    },
    [types.SET_DEL_INPUT_VALUE](state, payload) {
      state.delInpVal = payload;
    },
    [types.CHANGE_CONFIRM_VISIBLE](state, payload) {
      state.isShowConfirm = payload;
    },
    [types.SET_POOLLIST_STATUS](state, payload) {
      state.poolList = payload;
      if (payload && payload.length) {
        state.hasLiquidity = true;
      } else {
        state.hasLiquidity = false;
      }
    },
    [types.SET_XY_INFO](state, payload) {
      if (payload) {
        state.tokensXY = Object.assign({}, state.tokensXY || {}, payload);
      } else {
        state.tokensXY = payload;
      }
    },
    [types.CHANGE_HISTORY_RECORD_VISIBLE](state, payload) {
      state.isShowHistoryRecordDialog = payload;
    },
    [types.SET_DEL_POOL_INFO](state, payload) {
      state.lpDelInfo = payload;
    },
    [types.SET_POOL_INFO](state, payload) {
      state.poolInfo = payload.poolInfo;
      // state.pollDetailData = payload.pollDetailData;
    },
    [types.SET_CURRENCY_INFO](state, payload) {
      if (payload.type === "from") {
        state.from = Object.assign({}, state.from, payload);
      }
      if (payload.type === "to") {
        state.to = Object.assign({}, state.to, payload);
      }
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
    [types.HANDLE_CURRENCY_SELECT_VISIBLE](state, payload) {
      state.isShowSearchDialog = payload.isShow;
      state.currencySelectType = payload.type;
    },
    [types.CHANGE_POOL_TYPE](state, payload) {
      state.poolType = payload;
    },
    [types.CHANGE_INPUTVALUE](state, payload) {
      const { value, type } = payload;
      state[type].inputVal = value;
      const opposite = type === "from" ? "to" : "from";
      if (!state.to.currency || !state.from.currency) {
        type === "from" ? (state.to.inputVal = "") : (state.from.inputVal = "");
      }
      if (!state[type].inputVal || utilsNumber.bigNum(value).lte(0)) {
        state[opposite].inputVal = "";
      }

      if (
        state[type].inputVal &&
        utilsNumber.bigNum(value).gt(0) &&
        state.tokensXY
      ) {
        const { x, y, xCurrency, yCurrency } = state.tokensXY;
        let oppositeValue;
        const c = type === "from" ? xCurrency : yCurrency;
        const precision = state[opposite].exchangePrecision;
        const m = type === "from" ? x : y;
        const n = type === "from" ? y : x;
        oppositeValue = getOppositeValue(
          m,
          n,
          c,
          state[type].currency,
          state[type].inputVal,
          precision
        );
        state[opposite] = Object.assign({}, state[opposite], {
          inputVal: oppositeValue,
        });
      }
      state.focusType = type;
    },
    [types.SET_LIQUIDITY_TOTAL_HISTORY](state, payload) {
      state.totalLiquidityList.push(...payload);
    },
  },
  getters: {
    pollDetailData: (state) => {
      // 当前的币种对存在流动池且有XY
      let res;
      if (state.from.currency && state.to.currency) {
        if (state.tokensXY) {
          res = formatLiquidityInfo(
            state.tokensXY.yCurrency,
            state.tokensXY.xCurrency,
            state.tokensXY,
            // state.tokensXY.x,
            // state.tokensXY.y,
            state.from.inputVal,
            state.to.inputVal,
            true
          );

          return res;
        }
        // 不存在流动池
        if (!state.tokensXY) {
          res = formatLiquidityInfo(
            state.from.currency,
            state.to.currency,
            // null,
            null,
            state.from.inputVal,
            state.to.inputVal,
            false
          );
          return res;
        }
      }
    },
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
              }
            ).text,
          };
        }
      },
  },
  actions: {
    async getLiquidityXYThrottle({ state, commit, dispatch }) {
      if (state.poolType === "delete") {
        if (
          state.lpDelInfo.A &&
          state.lpDelInfo.A.token &&
          state.lpDelInfo.B &&
          state.lpDelInfo.B.token
        ) {
          const res = await liquidityApi.getLiquidityXY({
            tokenA: state.lpDelInfo.A.token,
            tokenB: state.lpDelInfo.B.token,
          });
          if (res.result) {
            if (
              res.result.value[2][1]["U128"] !== "0" &&
              res.result.value[3][1]["U128"] !== "0"
            ) {
              let x = utilsFormat.formatBalance(
                res.result.value[2][1]["U128"],
                9
              );
              let y = utilsFormat.formatBalance(
                res.result.value[3][1]["U128"],
                9
              );
              commit(types.SET_XY_INFO, { x, y });
              if (state.delInpVal) {
                dispatch("setDelPoolTokenData", { value: state.delInpVal });
              }
            }
          }
        }
      }
      if (
        state.poolType === "add" &&
        state.to.currency &&
        state.from.currency
      ) {
        if (state.addToken) {
          const res = await liquidityApi.getLiquidityXY({
            tokenA: state.addToken.A,
            tokenB: state.addToken.B,
          });
          if (res.result) {
            if (
              res.result.value[2][1]["U128"] !== "0" &&
              res.result.value[3][1]["U128"] !== "0"
            ) {
              const direction =
                state.from.currency === state.addToken.xCurrency
                  ? "from"
                  : "to";
              const data = decoratorXY({
                state,
                commit,
                res: res.result.value,
                direction,
              });
              let x = data.x;
              let y = data.y;
              let oppositeValue, opposite;
              const active = state.focusType;
              if (x && y) {
                const { xCurrency, yCurrency } = state.addToken;
                commit(types.SET_XY_INFO, { x, y, xCurrency, yCurrency });
                if (active && state[active].inputVal) {
                  const c =
                    active === "from"
                      ? xCurrency
                      : active === "to"
                      ? yCurrency
                      : "";
                  opposite =
                    active === "from" ? "to" : active === "to" ? "from" : "";
                  const precision = state[opposite].exchangePrecision;
                  const m = active === "from" ? x : y;
                  const n = active === "from" ? y : x;
                  oppositeValue = getOppositeValue(
                    m,
                    n,
                    c,
                    state[active].currency,
                    state[active].inputVal,
                    precision
                  );
                }
              } else {
                commit(types.ADD_TOKEN_INFO, null);
              }
              if (oppositeValue && opposite) {
                commit(types.SET_CURRENCY_INFO, {
                  type: opposite,
                  inputVal: oppositeValue,
                });
              }
            }
          }
        }
      }
    },
    // 获取币种对x、y
    async getLiquidityXY({ state, commit }) {
      const res = await Promise.allSettled([
        liquidityApi.getLiquidityXY({
          tokenA: state.from.token,
          tokenB: state.to.token,
        }),
        liquidityApi.getLiquidityXY({
          tokenA: state.to.token,
          tokenB: state.from.token,
        }),
      ]);
      let x, y, xCurrency, yCurrency;
      if (res[0].status === "fulfilled" && res[0].value.result) {
        if (
          res[0].value.result.value[2][1]["U128"] !== "0" &&
          res[0].value.result.value[3][1]["U128"] !== "0"
        ) {
          const data = decoratorXY({
            state,
            commit,
            res: res[0].value.result.value,
            direction: "from",
          });
          x = data.x;
          y = data.y;
          xCurrency = data.xCurrency;
          yCurrency = data.yCurrency;
        } else if (
          res[0].value.result.value[2][1]["U128"] === "0" &&
          res[0].value.result.value[3][1]["U128"] === "0"
        ) {
          const data = noExistedXY({ commit, direction: "from", state });
          x = data.x;
          y = data.y;
          xCurrency = data.xCurrency;
          yCurrency = data.yCurrency;
        }
      }
      if (res[1].status === "fulfilled" && res[1].value.result) {
        if (
          res[1].value.result.value[2][1]["U128"] !== "0" &&
          res[1].value.result.value[3][1]["U128"] !== "0"
        ) {
          const data = decoratorXY({
            state,
            commit,
            res: res[1].value.result.value,
            direction: "to",
          });
          x = data.x;
          y = data.y;
          xCurrency = data.xCurrency;
          yCurrency = data.yCurrency;
        } else if (
          res[1].value.result.value[2][1]["U128"] === "0" &&
          res[1].value.result.value[3][1]["U128"] === "0"
        ) {
          const data = noExistedXY({ commit, direction: "to", state });
          x = data.x;
          y = data.y;
          xCurrency = data.xCurrency;
          yCurrency = data.yCurrency;
        }
      }
      let oppositeValue, opposite;
      const active = state.focusType;
      // 存在x、y、输入值则x、y 推导
      // 不存在x,y则不用去计算另一个
      if (x && y) {
        commit(types.SET_XY_INFO, { x, y, xCurrency, yCurrency });
        if (active && state[active].inputVal) {
          const c =
            active === "from" ? xCurrency : active === "to" ? yCurrency : "";
          opposite = active === "from" ? "to" : active === "to" ? "from" : "";
          const precision = state[opposite].exchangePrecision;
          const m = active === "from" ? x : y;
          const n = active === "from" ? y : x;
          oppositeValue = getOppositeValue(
            m,
            n,
            c,
            state[active].currency,
            state[active].inputVal,
            precision
          );
        }
      } else {
        commit(types.ADD_TOKEN_INFO, null);
      }
      if (oppositeValue && opposite) {
        commit(types.SET_CURRENCY_INFO, {
          type: opposite,
          inputVal: oppositeValue,
        });
      }
    },
    async setSelectCurrencyInfo(
      { commit, state, dispatch, rootState },
      payload
    ) {
      const dir = state.currencySelectType === "to" ? "from" : "to";
      if (state[dir].currency === payload.currency) {
        // 交换
        commit(types.TRANSFROM_CURRENCY);
      }
      commit(types.SET_CURRENCY_INFO, payload);

      if (state.to.currency && state.from.currency) {
        if (state.poolType === "add") {
          dispatch("getLiquidityXY");
        }
      }
      commit(types.HANDLE_CURRENCY_SELECT_VISIBLE, {
        isShow: false,
        type: null,
      });

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
    },

    async getTotalAmountWithLPToken({ commit, state }) {
      const tokenA = state.lpDelInfo.A.token;
      const tokenB = state.lpDelInfo.B.token;
      const res = await liquidityApi.getTotalAmountWithLPToken(tokenA, tokenB);
      if (res && res.result && res.result.value) {
        const value = res.result.value[0][1]["U128"];
        commit(
          types.SET_LPTOKEN_TOTAL_AMOUNT,
          utilsNumber.formatNumberMeta(
            utilsNumber.bigNum(value).div(Math.pow(10, 9)).toString(),
            {
              precision: 9,
            }
          ).text
        );
      }
    },

    setDelPoolTokenData({ state, commit }, payload) {
      commit(types.SET_DEL_INPUT_VALUE, payload.value);
      if (!payload.value || !utilsNumber.bigNum(payload.value).gt(0)) {
        let c = cloneDeep(state.lpDelInfo);
        c.A.data = amountA;
        c.B.data = amountB;
        commit(types.SET_DEL_POOL_INFO, c);
        return;
      }
      let amountA = "",
        amountB = "";
      if (!isNil(payload.value) && utilsNumber.bigNum(payload.value).gt(0)) {
        if (!state.lpTokenAmount) return;
        // 这里替换一下取state.tokens的XY
        amountA = utilsNumber.formatNumberMeta(
          utilsNumber
            .bigNum(payload.value)
            .times((state.tokensXY && state.tokensXY.x) || state.lpDelInfo.x)
            .div(state.lpTokenAmount)
            .toString(),
          {
            precision: 9,
            trailingZero: false,
          }
        ).text;

        amountB = utilsNumber.formatNumberMeta(
          utilsNumber
            .bigNum(payload.value)
            .times((state.tokensXY && state.tokensXY.y) || state.lpDelInfo.y)
            .div(state.lpTokenAmount)
            .toString(),
          {
            precision: 9,
            trailingZero: false,
          }
        ).text;
        let c = cloneDeep(state.lpDelInfo);
        c.A.data = amountA;
        c.B.data = amountB;
        commit(types.SET_DEL_POOL_INFO, c);
      }
    },
    //  获取用户下流动LPTOKEN LIST
    async getAllPoolListByUser({ commit }, payload) {
      if (!payload) {
        commit(types.SET_POOLLIST_STATUS, null);
        commit(types.ADD_LOADING_INFO, false);
      } else {
        commit(types.ADD_LOADING_INFO, true);
        const res = await liquidityApi.getAllPoolListByUser(payload);
        commit(types.ADD_LOADING_INFO, false);
        if (res.result && res.result.resources) {
          let list = [];
          for (const [k, v] of Object.entries(res.result.resources)) {
            if (
              k.indexOf(
                `${process.env.VUE_APP_LPTOKEN_ADDRESS}::SwapPair::LPToken<`
              ) > -1
            ) {
              // console.log(
              //   "VUE_APP_LPTOKEN_ADDRESS",
              //   process.env.VUE_APP_LPTOKEN_ADDRESS
              // );
              // console.log(
              //   "process.env.VUE_APP_CONTRACTS_ADDRESS",
              //   process.env.VUE_APP_CONTRACTS_ADDRESS
              // );
              const contracts = k.match(/Balance<(.*)::SwapPair/)[1];
              if (contracts === process.env.VUE_APP_CONTRACTS_ADDRESS) {
                const tokenString = k.match(/LPToken<(.*)>>/)[1]; // 匹配LPToken开头、>>结束
                const tokenAddress = tokenString.split(", ");
                const tokens = tokenAddress.map((d) => d.split("::")[2]);
                if (v.json.token.value > 0) {
                  list.push({
                    lpToken: `LP - ${tokens[0]}/${tokens[1]}`,
                    A: {
                      key: tokens[0],
                      data: "0.0",
                      token: tokenAddress[0],
                    },
                    B: {
                      key: tokens[1],
                      data: "0.0",
                      token: tokenAddress[1],
                    },
                    poolAmount: utilsNumber
                      .bigNum(v.json.token.value)
                      .div(Math.pow(10, 9))
                      .toString(),
                  });
                }
              }
            }
          }
          if (list.length > 0) {
            list = list.filter((item) => item.poolAmount !== "0");
          }
          commit(types.SET_POOLLIST_STATUS, list);
        } else {
          commit(types.SET_POOLLIST_STATUS, []);
        }
      }
    },

    async addLiquidity({ state, rootState, commit }) {
      commit(types.SET_WALLET_DIALOG_PARAMS, {
        ...WALLET_DIALOG_PARAMS,
        dialogText: "正在添加流动性",
        successText: "流动性添加成功",
        failedText: "流动性添加失败",
      });
      commit(types.SET_WALLET_DIALOG_PARAMS, {
        dialogVisible: true,
        isShowClose: false,
      });
      const slippageTolerance = utilsNumber
        .bigNum(rootState.StoreApp.settings.slippageTolerance)
        .div(100);
      const x1 = utilsNumber
        .bigNum(state.from.inputVal)
        .times(Math.pow(10, 9))
        .toString();
      const y1 = utilsNumber
        .bigNum(state.to.inputVal)
        .times(Math.pow(10, 9))
        .toString();
      const gap = utilsNumber.bigNum(1).minus(slippageTolerance).toString();
      const x2 = utilsNumber.formatNumberMeta(
        utilsNumber.bigNum(x1).times(gap).toString(),
        {
          precision: 0,
        }
      ).text;
      const y2 = utilsNumber.formatNumberMeta(
        utilsNumber.bigNum(y1).times(gap).toString(),
        {
          precision: 0,
        }
      ).text;
      try {
        const params = {
          provider: rootState.StoreWallet.stcProvider,
          tokens: [state.from.token, state.to.token],
          amounts: [x1, y1, x2, y2],
        };
        const hash = await Wallet.addLiquidity(params);
        if (hash) {
          commit(types.SET_WALLET_DIALOG_PARAMS, {
            phase1: "succeed",
          });
          let res = await utilsTool.getChainTransactionInfo({ txnHash: hash });
          if (res?.status === "Executed") {
            commit(types.SET_WALLET_DIALOG_PARAMS, {
              phase2: "succeed",
            });
            setTimeout(() => {
              commit(types.SET_WALLET_DIALOG_PARAMS, {
                isShowClose: true,
                dialogStatus: "succeed",
              });
            }, 1500);
          }
        } else {
          commit(types.SET_WALLET_DIALOG_PARAMS, {
            isShowClose: true,
            dialogStatus: "failed",
          });
        }
      } catch (error) {
        commit(types.SET_WALLET_DIALOG_PARAMS, {
          isShowClose: true,
          dialogStatus: "failed",
        });
      }
    },

    async delLiquidity({ state, rootState, commit }) {
      commit(types.SET_WALLET_DIALOG_PARAMS, {
        ...WALLET_DIALOG_PARAMS,
        dialogText: "正在添加流动性",
        successText: "流动性添加成功",
        failedText: "流动性添加失败",
      });
      commit(types.SET_WALLET_DIALOG_PARAMS, {
        dialogVisible: true,
        isShowClose: false,
      });
      const slippageTolerance = utilsNumber
        .bigNum(rootState.StoreApp.settings.slippageTolerance)
        .div(100);
      const x1 = utilsNumber
        .bigNum(state.lpDelInfo.A.data)
        .times(Math.pow(10, 9))
        .toString();
      const y1 = utilsNumber
        .bigNum(state.lpDelInfo.B.data)
        .times(Math.pow(10, 9))
        .toString();
      const gap = utilsNumber.bigNum(1).minus(slippageTolerance).toString();
      const x2 = utilsNumber.formatNumberMeta(
        utilsNumber.bigNum(x1).times(gap).toString(),
        {
          precision: 0,
        }
      ).text;
      const y2 = utilsNumber.formatNumberMeta(
        utilsNumber.bigNum(y1).times(gap).toString(),
        {
          precision: 0,
        }
      ).text;
      const lpAmount = utilsNumber
        .bigNum(state.delInpVal)
        .times(Math.pow(10, 9))
        .toString();
      try {
        const params = {
          provider: rootState.StoreWallet.stcProvider,
          tokens: [state.lpDelInfo.A.token, state.lpDelInfo.B.token],
          amounts: [lpAmount, x2, y2],
        };
        const hash = await Wallet.delLiquidity(params);
        if (hash) {
          commit(types.SET_WALLET_DIALOG_PARAMS, {
            phase1: "succeed",
          });
          let res = await utilsTool.getChainTransactionInfo({ txnHash: hash });
          if (res?.status === "Executed") {
            commit(types.SET_WALLET_DIALOG_PARAMS, {
              phase2: "succeed",
            });
            setTimeout(() => {
              commit(types.SET_WALLET_DIALOG_PARAMS, {
                isShowClose: true,
                dialogStatus: "succeed",
              });
            }, 1500);
          }
        } else {
          commit(types.SET_WALLET_DIALOG_PARAMS, {
            isShowClose: true,
            dialogStatus: "failed",
          });
        }
      } catch (error) {
        commit(types.SET_WALLET_DIALOG_PARAMS, {
          isShowClose: true,
          dialogStatus: "failed",
        });
      }
    },

    // 获取流动性记录
    async getLiquidityHistoryList({ commit }, params) {
      let res = await liquidityApi.getLiquidityHistory(params);
      let list = [];
      if (res.code === 200) {
        if (res.data && res.data.length) {
          list = res.data.map((d) => {
            return {
              ...d,
              tokenCodeX: d.tokenCodeX.split("::")[2],
              tokenCodeY: d.tokenCodeY.split("::")[2],
            };
          });
        }
        commit(types.SET_LIQUIDITY_TOTAL_HISTORY, list);
      }
    },
  },
};

export default StoreLiquidity;
