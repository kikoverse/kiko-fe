import * as types from "../types/wallet.js";
import Wallet from "../../wallet/index.js";
import CONSTANTS_STARMASK from "@constants/starmask.js";
import Cookies from "js-cookie";

const state = {
  token: "STC",
  stcChianID: CONSTANTS_STARMASK.MAIN_CHIA_ID,
  stcProvider: "",
  accounts: [],
  onboarding: "",
  netChainId: "",
  precision: {}, // {stc: 1000000000}
  balances: {}, // {tokens: string}
  walletStatus: "unConnected", // 钱包链接状态 "unConnected", "connected"
  walletTimer: null,
};
const mutations = {
  [types.SET_CHIANID](state, chianID) {
    state.stcChianID = chianID;
  },
  [types.SET_ACCOUNTS](state, accounts) {
    state.accounts = accounts;
  },
  [types.SET_STARMASK_ONBOARDING](state, onboarding) {
    state.onboarding = onboarding;
  },
  [types.SET_STARMASK_PROVIDER](state, provider) {
    state.stcProvider = provider;
  },
  [types.SET_WALLET_BALANCE](state, payload) {
    state.balances = Object.assign({}, state.balances, payload);
  },
  [types.SET_WALLET_CONNECT_STATUS](state, payload) {
    state.walletStatus = payload;
    if (payload === "connected") {
      Cookies.set("connect-status", "connected", { expires: 7 });
    }
  },
  [types.SET_WALLET_NET_WORK_ID](state, id) {
    state.netChainId = String(id);
  },
  [types.CHANGE_WALLET_TIMER_STATUS](state, payload) {
    state.walletTimer = payload; // 切换账户时候清楚timer
  },
};

const getters = {
  isConnectedWallet: (state) => {
    return state.walletStatus;
  },
};
const actions = {
  setStcChianID({ commit }, chianID) {
    commit(types.SET_CHIANID, chianID);
  },
  setAccounts({ commit }, accounts) {
    commit(types.SET_ACCOUNTS, accounts);
  },
  setOnboarding({ commit }, onboarding) {
    commit(types.SET_STARMASK_ONBOARDING, onboarding);
  },
  setStcProvider({ commit }, provider) {
    commit(types.SET_STARMASK_PROVIDER, provider);
  },
  async getBalance({ commit }, { token, currency }) {
    const balance = await Wallet.getAccountBalance({
      provider: state.stcProvider,
      account: state.accounts[0],
      token,
    });
    commit(types.SET_WALLET_BALANCE, {
      [currency]: balance,
    });
  },
};

export default {
  namespaced: true,
  moduleName: "StoreWallet",
  state,
  getters,
  mutations,
  actions,
};
