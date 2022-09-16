import request from "@utils/request";

export function getAllClaimedList(params) {
  return request({
    url: `/v1/nft/honor/allClaimed/${params}`,
    method: "GET",
  });
}
export function getClaimedList(params) {
  return request({
    url: `/v1/nft/honor/claimed/${params}`,
    method: "GET",
  });
}

export function gethonorReceive(data) {
  return request({
    url: `/v1/nft/honor/receive`,
    method: "PUT",
    data,
  });
}
