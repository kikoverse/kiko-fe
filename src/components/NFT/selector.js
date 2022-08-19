import utilsFormat from "@utils/format";
export const nftTypesList = [
  {
    label: utilsFormat.computedLangCtx("all categories"),
    value: "",
  },
  {
    label: utilsFormat.computedLangCtx("盲盒"),
    value: "box",
  },
  {
    label: utilsFormat.computedLangCtx("original NFT"),
    value: "nft",
  },
  {
    label: utilsFormat.computedLangCtx("disassembled NFT"),
    value: "composite_card",
  },
  {
    label: utilsFormat.computedLangCtx("components"),
    value: "composite_element",
  },
];

export const sortList = [
  {
    label: utilsFormat.computedLangCtx("价格"),
    value: "price",
  },
  {
    label: utilsFormat.computedLangCtx("listed Time"),
    value: "ctime",
  },
  {
    label: utilsFormat.computedLangCtx("稀有值"),
    value: "rarity",
  },
  {
    label: utilsFormat.computedLangCtx("到期时间"),
    value: "etime",
  },
];
