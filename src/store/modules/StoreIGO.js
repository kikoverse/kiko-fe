import * as types from "../types/igo.js";
import igoApi from "@api/igo";

const StoreIGO = {
  namespaced: true,
  moduleName: "StoreIGO",
  state: {
    igoList: null,
  },
  mutations: {
    [types.SET_IGO_LIST](state, payload) {
      state.igoList = payload;
    },
  },
  actions: {
    async getIgoList({ commit }) {
      const res = await igoApi.getIGOList();
      if (res.code === 200) {
        commit(types.SET_IGO_LIST, res.data);
      }
    },
  },
};

export default StoreIGO;
