/* eslint-disable */
import NFT_CONSTANTS from "@constants/nft.js";
import { computed, reactive } from "vue";

const NFT_TYPES = NFT_CONSTANTS.NFT_TYPES;

const useNFT = (store, data) => {
  let state = reactive({
    accounts: computed(() => store.state.StoreWallet.accounts),
  });

  // 是否是所有者
  const isOwner = (address) =>
    computed(() => {
      if (state.accounts && state.accounts[0]) {
        return address === state.accounts[0];
      }
    });

  // 是否再售
  // const isOnSell = computed(() => {
  //   return data.onSell;
  // }).value;

  // 获取NFTtype
  const getNFTType = computed(() => {
    return data.type;
  }).value;

  // 是否符合nft类型
  const isSameNFTType = (typeArr) => {
    if (typeArr.indexOf(data.type) > -1) {
      return true;
    }
    return false;
  };

  // 区分盲盒或者NFT
  const isNFT = (type) => {
    const t = NFT_TYPES.map((d) => d.toUpperCase());
    if (t.indexOf(type.toUpperCase()) > -1) {
      return true;
    }
    return false;
  };

  // 出价方式  一口价或者拍卖
  const getOfferPriceStyle = (type) => {
    if (type === 1) {
      return "one_time_offer";
    } else if (type === 2) {
      return "auction";
    }
  };

  return {
    isOwner,
    // isOnSell,
    getNFTType,
    isSameNFTType,
    isNFT,
    getOfferPriceStyle,
  };
};

export { useNFT };
