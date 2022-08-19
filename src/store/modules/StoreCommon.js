import commonApi from "@api/common";
import * as types from "../types/common.js";

const StoreCommon = {
  namespaced: true,
  moduleName: "StoreCommon",
  state: {
    currencyList: [],
  },
  mutations: {
    [types.SET_CURRENCY_LIST](state, data) {
      state.currencyList = data;
    },
  },
  actions: {
    async getCurrencyList({ commit, state }) {
      if (state.currencyList.length !== 0) return;
      let res = await commonApi.getCurrency();
      if (res.code === 200) {
        commit(types.SET_CURRENCY_LIST, res.data);
        return res.data;
      }
    },
  },
};

export default StoreCommon;
