import request from "../../utils/request";
/* eslint-disable */
export default {
  // 获取市场列表数据
  getMarketList(params) {
    const { groupId, pageSize, pageNum, sort, sortRule, nftType } = params;
    return request({
      url:
        "/v1/nft/market/getALL?groupId=" +
        groupId +
        "&nftType=" +
        nftType +
        "&pageSize=" +
        pageSize +
        "&pageNum=" +
        pageNum +
        "&sort=" +
        sort +
        "&sortRule=" +
        sortRule,
      method: "GET",
    });
  },
  //获取盲盒详情
  getBlindBoxDetail(params) {
    return request({
      url: `/v1/nft/box/info/${params.groupId}/${params.chainId}`,
      method: "GET",
    });
  },
  // 获取NFT详情
  getNFTDetail(params) {
    return request({
      url: `/v1/nft/nft/info/${params.id}`,
      method: "GET",
    });
  },
  // 取消出售
  cancelSell(params) {
    return request({
      url: `/v1/nft/box/info/${params.groupId}`,
      method: "GET",
    });
  },
  // 接受报价
  acceptBiding(params) {
    return request({
      url: `/v1/nft/box/info/${params.groupId}`,
      method: "GET",
    });
  },
  // 详情页轮询商品是否在售卖
  queryIsSelling(params) {
    return request({
      url: `/v1/nft/market/boxExist/${params.id}`,
      method: "GET",
    });
  },
};
