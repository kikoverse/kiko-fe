import NFT_CONSTANTS from "@constants/nft.js";
import store from "@store/index.js";
import router from "@router/index.js";

const dialog_params_init = () => {
  store.commit(
    "StoreNftMarket/CHANGE_DIALOG_STATUS",
    NFT_CONSTANTS.INIT_DIALOG_PARAMS
  );
};
export const dialogEventMaps = {
  // 打开盲盒
  OpenBlinkBox: {
    handleClose: (type) => {
      if (type === "failed") {
        dialogEventMaps.OpenBlinkBox.handleFailed();
      } else if (type === "success") {
        dialogEventMaps.OpenBlinkBox.handleSuccess();
      }
    },
    handleSuccess: () => {
      dialog_params_init();
      router.push({
        name: "nftcollection",
        params: {
          tabIndex: 1,
        },
      });
    },
    handleFailed: () => {
      window.location.reload();
    },
  },
  // 出售
  Sell: {
    handleClose: (type) => {
      if (type === "failed") {
        dialogEventMaps.Sell.handleFailed();
      } else if (type === "success") {
        dialogEventMaps.Sell.handleSuccess();
      }
    },
    handleSuccess: () => {
      dialog_params_init();
      router.push({
        name: "nftcollection",
        params: {
          tabIndex: 2,
        },
      });
    },
    handleFailed: () => {
      window.location.reload();
    },
  },
  // 取消出售
  CancelSell: {
    handleClose: (type) => {
      if (type === "failed") {
        dialogEventMaps.CancelSell.handleFailed();
      } else if (type === "success") {
        dialogEventMaps.CancelSell.handleSuccess();
      }
    },
    handleSuccess: () => {
      dialog_params_init();
      router.push({
        name: "nftcollection",
        params: {
          tabIndex: 1,
        },
      });
    },
    handleFailed: () => {
      window.location.reload();
    },
  },
  // 更改售价
  UpdateBid: {
    handleClose: () => {
      window.location.reload();
    },
    handleSuccess: () => {
      window.location.reload();
    },
    handleFailed: () => {
      window.location.reload();
    },
  },
  // 接受报价
  AcceptBid: {
    handleClose: (type) => {
      if (type === "failed") {
        dialogEventMaps.AcceptBid.handleFailed();
      } else if (type === "success") {
        dialogEventMaps.AcceptBid.handleSuccess();
      }
    },
    handleSuccess: () => {
      dialog_params_init();
      router.push({
        name: "nftcollection",
        params: {
          tabIndex: 4,
        },
      });
    },
    handleFailed: () => {
      window.location.reload();
    },
  },
  // 一口价/拍卖
  bidPriceSell: {
    handleClose: (type) => {
      if (type === "failed") {
        dialogEventMaps.bidPriceSell.handleFailed();
      } else if (type === "success") {
        dialogEventMaps.bidPriceSell.handleSuccess();
      }
    },
    handleSuccess: () => {
      dialog_params_init();
      router.push({
        name: "nftcollection",
        params: {
          tabIndex: 2,
        },
      });
    },
    handleFailed: () => {
      window.location.reload();
    },
  },
};
