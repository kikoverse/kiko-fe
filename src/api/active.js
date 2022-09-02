import request from "@utils/request";

// 获取资产列表
export function getAirdropList() {
  return request({
    url: "/v1/nft/aptos/airdrop/getList",
    method: "GET",
  });
}
