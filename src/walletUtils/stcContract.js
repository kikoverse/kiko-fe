import { utils, bcs } from "@starcoin/starcoin";
import { hexlify } from "@ethersproject/bytes";
import request from "@utils/request";

/**
 * @name: 调用合约方法 (需要签名)
 * @providers: provider
 * @contract: 合约地址
 * @funcName: 调用的合约方法
 * @tyArgs: 合约需要的辨识参数（metaData, metaBody），没有传[]
 * @...args: 入参
 * author: zhannan.zhang
 * @date:2022-05-11
 */
export const getContractWidthSinger = async (
  providers,
  contract,
  funcName,
  tyArgs,
  cb,
  ...args
) => {
  try {
    let funcId = `${contract}::${funcName}`;
    // if (funcName) {
    //   funcId = contract;
    // }
    console.log("getContractWidthSinger:=======", funcId, tyArgs, args);
    const nodeUrl = "https://main-seed.starcoin.org"; // 节点RPC地址
    const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(
      funcId,
      tyArgs,
      args,
      nodeUrl
    );
    const payloadInHex = (function () {
      const se = new bcs.BcsSerializer();
      scriptFunction.serialize(se);
      return hexlify(se.getBytes());
    })();
    const txhash = await providers.getSigner().sendUncheckedTransaction({
      data: payloadInHex,
    });
    cb && cb({ hash: txhash });
    return new Promise((resolve) => {
      let timer = setInterval(() => {
        getTransactionInfo(txhash).then((res) => {
          if (res.result) {
            if (res.result.status === "Executed") {
              resolve(200);
            } else {
              resolve("failed");
              console.error("合约失败:", res.result);
            }
            clearInterval(timer);
          } else {
            console.log(txhash);
          }
        });
      }, 1000);
    });
  } catch (error) {
    console.error("contract err", error);
    throw error;
  }
};

/**
 * @name: 根据 txhash 查询链上信息
 * author: zhannan.zhang
 * @date:2022-05-11
 */
function getTransactionInfo(txnHash) {
  return send("chain.get_transaction_info", txnHash);
}
/**
 * @name: xiaziheng
 * @msg: 调用基础合约方法
 * @param {*} method 方法名
 * @param {array} params 请求参数
 * @return {*}
 */
export function send(method, ...params) {
  let requestHeader = {
    id: 101,
    jsonrpc: "2.0",
    method: method,
    params,
  };
  return request({
    headers: {
      "content-type": "application/json",
    },
    url: "https://main-seed.starcoin.org",
    method: "post",
    data: JSON.stringify(requestHeader),
  });
}
/**
 * @name: xiaziheng
 * @msg: 调用合约方法 (不需要签名)
 * @param {*}
 * @return {*}
 */

export function getContract(contractAddress, structTag, funcName, ...params) {
  let paramStr = params.reduce((prev, next) => {
    return prev + "," + next;
  });
  let parmas2 = `${structTag}::${funcName}<${paramStr}>`;

  return send("contract.get_resource", contractAddress, parmas2);
}
