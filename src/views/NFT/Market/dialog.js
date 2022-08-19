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
  // 一口价购买
  Purchase: {
    handleClose: (type) => {
      if (type === "failed") {
        dialogEventMaps.Purchase.handleFailed();
      } else if (type === "success") {
        dialogEventMaps.Purchase.handleSuccess();
      }
    },
    // 购买记录
    handleSuccess: () => {
      dialog_params_init();
      router.push({
        name: "nftcollection",
        params: {
          tabIndex: 3,
        },
      });
    },
    handleFailed: () => {
      window.location.reload();
    },
  },
  // 出价
  BidPrice: {
    handleClose: (type) => {
      if (type === "failed") {
        dialogEventMaps.BidPrice.handleFailed();
      } else if (type === "success") {
        dialogEventMaps.BidPrice.handleSuccess();
      }
    },
    handleSuccess: () => {
      dialog_params_init();
      router.push({
        name: "nftcollection",
        params: {
          tabIndex: 3,
        },
      });
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
    // 出售记录
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
};
