// 盲盒 => 官方发布
export const BLIND_STATUS = {
  soldOut: {
    text: "售罄",
  },
  purchase: {
    text: "购买",
  },
  // 未开始时 倒计时
};

// Market old
export const MARKET_STATUS = {
  soldOut: {
    text: "售罄",
  },
  // 一口价情况下
  purchase: {
    text: "1STC 购买",
  },
  // 拍卖
  bidPrice: {
    text: "出价",
  },
};

// BuyBack  => 平台回购按钮状态 (需要出售弹窗)
export const BUYBACK_STATUS = {
  sell: {
    text: "出售",
  },
};

// My NFT
export const MyNft = {
  sell: {
    text: "出售", // 出售 NFT  一口价出售  拍卖
  },
  cancel: {
    text: "取消出售",
  },
  // isOwner && 拍卖
  accept: {
    text: "接受报价",
  },
};
