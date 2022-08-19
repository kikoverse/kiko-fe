import * as types from "../types/info.js";
import AssetsApi from "@api/assets";

const StoreInfo = {
  namespaced: true,
  moduleName: "StoreInfo",
  state: {
    assetsList: [],
    queryParams: {
      hasNext: true,
      pageNum: 1,
    },
  },
  mutations: {
    [types.SET_ASSETS_LIST](state, payload) {
      state.assetsList = payload;
    },
    [types.SET_QUERY_PARAMS](state, payload) {
      state.queryParams = Object.assign({}, state.queryParams, payload);
    },
  },
  actions: {
    async getAssetsList({ state, commit }, { type }) {
      let res,
        pageNum = 1;
      if (type === "init") {
        res = await AssetsApi.getAssetsList(state.queryParams);
        // res = {
        //   code: 200,
        //   msg: "OK",
        //   timeStamp: 1646808007097,
        //   hasNext: false,
        //   data: [
        //     {
        //       name: "STC",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/771fed83-9d98-4be2-162d-b8639dfa6800/public",
        //       price: "0.100233786829874591",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "11068.470203594353379438616031073",
        //     },
        //     {
        //       name: "BX_USDT",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/3bfe4edc-b91a-429a-eb5c-0a529fbb2200/public",
        //       price: "1",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "10355.136851041",
        //     },
        //     {
        //       name: "AWW",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/caa44ab1-f1b1-4e0b-7788-cd469ec0df00/public",
        //       price: "0",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "0.000000000",
        //     },
        //     {
        //       name: "STC",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/771fed83-9d98-4be2-162d-b8639dfa6800/public",
        //       price: "0.100233786829874591",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "11068.470203594353379438616031073",
        //     },
        //     {
        //       name: "BX_USDT",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/3bfe4edc-b91a-429a-eb5c-0a529fbb2200/public",
        //       price: "1",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "10355.136851041",
        //     },
        //     {
        //       name: "AWW",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/caa44ab1-f1b1-4e0b-7788-cd469ec0df00/public",
        //       price: "0",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "0.000000000",
        //     },
        //     {
        //       name: "STC",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/771fed83-9d98-4be2-162d-b8639dfa6800/public",
        //       price: "0.100233786829874591",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "11068.470203594353379438616031073",
        //     },
        //     {
        //       name: "BX_USDT",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/3bfe4edc-b91a-429a-eb5c-0a529fbb2200/public",
        //       price: "1",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "10355.136851041",
        //     },
        //     {
        //       name: "AWW",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/caa44ab1-f1b1-4e0b-7788-cd469ec0df00/public",
        //       price: "0",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "0.000000000",
        //     },
        //     {
        //       name: "STC",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/771fed83-9d98-4be2-162d-b8639dfa6800/public",
        //       price: "0.100233786829874591",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "11068.470203594353379438616031073",
        //     },
        //     {
        //       name: "BX_USDT",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/3bfe4edc-b91a-429a-eb5c-0a529fbb2200/public",
        //       price: "1",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "10355.136851041",
        //     },
        //     {
        //       name: "AWW",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/caa44ab1-f1b1-4e0b-7788-cd469ec0df00/public",
        //       price: "0",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "0.000000000",
        //     },
        //     {
        //       name: "STC",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/771fed83-9d98-4be2-162d-b8639dfa6800/public",
        //       price: "0.100233786829874591",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "11068.470203594353379438616031073",
        //     },
        //     {
        //       name: "BX_USDT",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/3bfe4edc-b91a-429a-eb5c-0a529fbb2200/public",
        //       price: "1",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "10355.136851041",
        //     },
        //     {
        //       name: "AWW",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/caa44ab1-f1b1-4e0b-7788-cd469ec0df00/public",
        //       price: "0",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "0.000000000",
        //     },
        //     {
        //       name: "STC",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/771fed83-9d98-4be2-162d-b8639dfa6800/public",
        //       price: "0.100233786829874591",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "11068.470203594353379438616031073",
        //     },
        //     {
        //       name: "BX_USDT",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/3bfe4edc-b91a-429a-eb5c-0a529fbb2200/public",
        //       price: "1",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "10355.136851041",
        //     },
        //     {
        //       name: "AWW",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/caa44ab1-f1b1-4e0b-7788-cd469ec0df00/public",
        //       price: "0",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "0.000000000",
        //     },
        //     {
        //       name: "STC",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/771fed83-9d98-4be2-162d-b8639dfa6800/public",
        //       price: "0.100233786829874591",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "11068.470203594353379438616031073",
        //     },
        //     {
        //       name: "BX_USDT",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/3bfe4edc-b91a-429a-eb5c-0a529fbb2200/public",
        //       price: "1",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "10355.136851041",
        //     },
        //     {
        //       name: "AWW",
        //       icon: "https://imagedelivery.net/3mRLd_IbBrrQFSP57PNsVw/caa44ab1-f1b1-4e0b-7788-cd469ec0df00/public",
        //       price: "0",
        //       rate: "0",
        //       amount: "0",
        //       liquidity: "0.000000000",
        //     },
        //   ],
        // };
      } else {
        const queryParams = state.queryParams;
        if (type === "prev") {
          if (queryParams.pageNum === 1) return;
          pageNum = queryParams.pageNum - 1;
          res = await AssetsApi.getAssetsList({
            pageNum,
          });
        }
        if (type === "next") {
          if (!queryParams.hasNext) return;
          pageNum = queryParams.pageNum + 1;
          res = await AssetsApi.getAssetsList({
            pageNum,
          });
        }
        // if (type === "current") {
        //   if (!queryParams.hasNext) return;
        //   let pageNum = currentPage;
        //   res = await AssetsApi.getAssetsList({
        //     pageNum,
        //   });
        // }
      }
      if (res.code == 200) {
        let k;
        if (res.data && res.data.length) {
          k = res.data.map((d, i) => {
            return {
              sort: i,
              ...d,
            };
          });
        }
        commit(types.SET_ASSETS_LIST, k);
        commit(types.SET_QUERY_PARAMS, {
          pageNum: pageNum,
          hasNext: res.hasNext,
        });
      }
    },
  },
};

export default StoreInfo;
