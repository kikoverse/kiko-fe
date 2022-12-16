import utilsFormat from "@utils/format";

const NFT_TYPES = ["composite_card", "composite_element", "nft"];

const INIT_DIALOG_PARAMS = {
  dialogStatus: "ongoing", // success failed ongoing
  dialogText: utilsFormat.computedLangCtx("购买中"), // 购买成功 购买失败
  phase1: "loading",
  phase2: "loading",
  isShow: false,
  failedBtnText: utilsFormat.computedLangCtx("确认"),
  successBtnText: utilsFormat.computedLangCtx("查看"),
  title: "",
  customImgUrl: "",
  isBlindBox: false,
};

const INIT_SECOND_DIALOG_PARAMS = {
  imgUrl: "",
  confirmText: utilsFormat.computedLangCtx("确认"),
  cancelText: utilsFormat.computedLangCtx("取消"),
  text: "",
  isShow: false,
  title: "",
  gasInfo: "",
};

const BID_PRICE_DIALOD_PARAMS = {
  confirmText: utilsFormat.computedLangCtx("提交"),
  text: "",
  isShow: false,
  title: "",
  gasInfo: "",
};

const NFT_GAS_FEE = "0.02";

const INIT_SOLD_DIALOG_PARAMS = {
  isShow: false,
  text: "",
  subText: "",
  btnText: utilsFormat.computedLangCtx("确认"),
};

const NFT_ERROR_CODES = [
  {
    code: 200001,
    msg: "PERMISSION_DENIED",
  },
  {
    code: 200002,
    msg: "OFFERING_NOT_EXISTS",
  },
  {
    code: 200003,
    msg: "OFFERING_NOT_ON_SALE",
  },
  { code: 200004, msg: "INSUFFICIENT_BALANCE" },
  { code: 200005, msg: "ID_NOT_EXIST" },
  { code: 200006, msg: "BID_FAILED" },
  { code: 200007, msg: "NFT_SELL_INFO_NOT_EXISTS" },
  { code: 200008, msg: "EXCESSIVE_FEE_RATE" },
  { code: 200009, msg: "BOX_SELLING_NOT_EXIST" },
  { code: 200010, msg: "BOX_SELLING_IS_EMPTY" },
  { code: 200011, msg: "BOX_SELLING_PRICE_SMALL" },
  { code: 200012, msg: "BOX_SELLING_INDEX_OUT_BOUNDS" },
  { code: 200013, msg: "PRICE_TOO_LOW" },
];

const LOADING = "https://kikoswap.com/static/img/loading.webp";

export default {
  INIT_DIALOG_PARAMS,
  INIT_SECOND_DIALOG_PARAMS,
  NFT_GAS_FEE,
  INIT_SOLD_DIALOG_PARAMS,
  NFT_ERROR_CODES,
  LOADING,
  BID_PRICE_DIALOD_PARAMS,
  NFT_TYPES,
};
