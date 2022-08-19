import * as types from "../types/app.js";
import session from "@utils/session";

const StoreApp = {
  namespaced: true,
  moduleName: "StoreApp",
  state: {
    currLang: session.getItem("language"),
    settings: {
      slippageTolerance: session.getItem("slippageTolerance") || 0.5,
      switchSlippage: session.getItem("switchSlippage") || true,
      slippageInput: session.getItem("slippageInput"),
    },
    // 钱包网络切换全局弹窗
    isShowGlobalModal: false,
    isShowSettings: false,
    languages: [
      {
        label: "繁體中文",
        value: "zh",
      },
      {
        label: "English",
        value: "en",
      },
    ],
  },
  mutations: {
    [types.CHANGE_LANGUAGE](state, value) {
      state.currLang = value;
    },
    [types.CHANGE_SLIPPAGE](state, value) {
      state.settings.slippageTolerance = value;
    },
    [types.CHANGE_SWITCH_SLIPPAGE](state, value) {
      state.settings.switchSlippage = value;
      session.setItem("switchSlippage", value);
    },
    [types.CHANGE_SETTING_VISIBLE](state, value) {
      state.isShowSettings = value;
    },
  },
  actions: {
    changeLanguage({ commit }, payload) {
      commit(types.CHANGE_LANGUAGE, payload);
    },
    changeSlippage({ commit }, payload) {
      commit(types.CHANGE_SLIPPAGE, payload);
    },
    changeSwitchSlippage({ commit }, payload) {
      commit(types.CHANGE_SWITCH_SLIPPAGE, payload);
    },
  },
};

export default StoreApp;
