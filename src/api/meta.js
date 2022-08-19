import request from "@utils/request";

function getNFTDataByType(params) {
  return request({
    url: "/v1/nft/meta/selfResource",
    method: "GET",
    params,
  });
}

// 个人素材卡牌列表
function getIGOList() {
  return request({
    url: "/v1/meta/selfResource",
    method: "GET",
  });
}

// 属性职业枚举
function getNFTMeatInfo() {
  return request({
    url: "/v1/nft/meta",
    method: "GET",
  });
}

// 组合卡牌
function compositeCard(params) {
  return request({
    url: "/v1/nft/meta/compositeCard",
    method: "POST",
    data: params,
  });
}

// 个人素材系列列表
function getSeriesList() {
  return request({
    url: "/v1/nft/series/list/avatar",
    method: "GET",
  });
}
export default {
  getIGOList,
  getNFTMeatInfo,
  compositeCard,
  getNFTDataByType,
  getSeriesList,
};
