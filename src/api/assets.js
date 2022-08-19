import request from "@utils/request";

// 获取资产列表
function getAssetsList(params) {
  return request({
    url: "/v1/swap/exchange/coinInfos",
    params: {
      pageSize: 20,
      pageNum: params.pageNum,
    },
    method: "GET",
  });
}

export default {
  getAssetsList,
};
