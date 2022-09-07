import request from "@utils/request";

function getOfferingList(params) {
  return request({
    url: "/v1/nft/box/offering/list",
    method: "GET",
    params,
  });
}

export function getGalleryList(params) {
  console.log(params);
  return request({
    url: "/v1/nft/meta/gallery/" + params,
    method: "GET",
  });
}

export function isGalleryDetail(params) {
  console.log(params);
  return request({
    url: `/v1/nft/meta/isGallery/${params.meta}/${params.body}/${params.address}`,
    method: "GET",
  });
}

export function getGalleryDetail(params) {
  console.log(params);
  return request({
    url: `/v1/nft/meta/gallery/${params.meta}/${params.body}/${params.address}`,
    method: "GET",
  });
}
export function getOfferingBoxData(id) {
  return request({
    url: `/v1/nft/box/offering/${id}`,
    method: "GET",
  });
}

function getOfferingAmount(boxToken) {
  let params = {
    id: 101,
    jsonrpc: "2.0",
    method: "contract.get_resource",
    params: [
      process.env.VUE_APP_NFT_ADDRESS, //合约地址
      `${process.env.VUE_APP_NFT_ADDRESS}::${process.env.VUE_APP_NFT_MARKET_ID}::BoxOffering<${boxToken}, 0x00000000000000000000000000000001::STC::STC>`,
    ],
  };
  return request({
    headers: {
      "content-type": "application/json",
    },
    url: process.env.VUE_APP_CONTRACTS_SERVE_URL,
    method: "post",
    data: JSON.stringify(params),
  });
}

export default {
  getOfferingBoxData,
  getOfferingAmount,
  getOfferingList,
};
