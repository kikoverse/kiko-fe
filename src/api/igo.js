//test.kikoswap.com/v1/ido/dx/product/kgStarter

import request from "@utils/request";

// 获取igo列表
function getIGOList() {
  return request({
    url: "/v1/ido/dx/product/kgStarter",
    method: "GET",
  });
}

export default {
  getIGOList,
};
