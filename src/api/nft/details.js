import request from "../../utils/request";

/**
 * 获取 NFT 详情
 * 市场/收藏/回购
 */
function getNFTBoxDetail(id) {
  return request({
    url: `/v1/nft/nft/info/${id}`,
    method: "GET",
  });
}

/**
 * 获取盲盒详情
 */
function getBlindBoxDetail(params) {
  return request({
    url: `/v1/nft/box/info/` + params,
    method: "GET",
  });
}

export default {
  getNFTBoxDetail,
  getBlindBoxDetail,
};
