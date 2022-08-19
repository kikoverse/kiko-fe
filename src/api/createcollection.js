import request from "@utils/request";

// 创建系列
export const createAssetsList = (data) => {
  return request({
    headers: {
      "content-type": "	multipart/form-data",
    },
    url: "/v1/nft/series/createSeries",
    method: "post",
    data,
  });
};
// 查询我的系列
export const getSeries = (params) => {
  return request({
    url: "/v1/nft/series/getSeries",
    method: "GET",
    params,
  });
};

//  查询我的系列nft
export const getSeriesNft = (params) => {
  return request({
    url: "/v1/nft/series/getSeriesNft",
    method: "GET",
    params,
  });
};
// 创建nft
export const createNft = (data) => {
  return request({
    headers: {
      "content-type": "	multipart/form-data",
    },
    url: "/v1/nft/series/createNft",
    method: "post",
    data,
  });
};

// 查询属性
export const getNFTMeta = (params) => {
  return request({
    url: "/v1/nft/series/getNFTMeta",
    method: "GET",
    params,
  });
};

// 查询qrcode
export const getVerifycode = (params) => {
  return request({
    url: "/v1/nft/series/getVerifycode",
    method: "GET",
    params,
  });
};
