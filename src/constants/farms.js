// import utilsFormat from "@utils/format";

export const SWAP_DIALOG_PARAMS = {
  dialogStatus: "", // success failed ongoing
  dialogText: "",
  // utilsFormat.computedLangCtx("购买中"), // 购买成功 购买失败
  phase1: "loading",
  phase2: "loading", // loading  success
  dialogVisible: false,
  failedBtnText: "",
  // failedContentText: "",
  isShowClose: false,
  successBtnText: "",
  miningData: "",
  type: "", // mining locked
  // failedBtnText: utilsFormat.computedLangCtx("确认"),
  // successBtnText: utilsFormat.computedLangCtx("查看"),
};

export const SWAP_SECOND_DIALOG_PARAMS = {
  confirmText: "",
  cancelText: "",
  dialogVisible: false,
  operateWaring: false,
  isShowClose: true,
  dataParams: null,
};

export const LIQUIDITY_INPUT_DIALOG_PARAMS = {
  dialogVisible: false,
  type: "", // draw add
};

export default {
  SWAP_DIALOG_PARAMS,
  SWAP_SECOND_DIALOG_PARAMS,
  LIQUIDITY_INPUT_DIALOG_PARAMS,
};
