import request from "../../utils/request";

// 获取平台回购列表
function getBuyBacklist(params) {
  const { groupId, sort, pageNum, pageSize, nftType, sortRule } = params;
  return request({
    url:
      "/v1/nft/platBuyBack/getALL?groupId=" +
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
}

// 获取 NFT/盲盒 系列
function getSeriesList() {
  return request({
    url: "/v1/nft/series/list",
    method: "GET",
  });
}

function getDetailInfo(params) {
  return request({
    url: `/v1/nft/platBuyBack/getOrder`,
    method: "GET",
    params: {
      currency: params.token,
      groupId: params.groupId,
      id: params.id,
    },
  });
}

function getNFTDetail(id) {
  return request({
    url: `/v1/nft/nft/info/${id}`,
    method: "GET",
  });
}

export default {
  getBuyBacklist,
  getSeriesList,
  getDetailInfo,
  getNFTDetail,
};
