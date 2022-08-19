import { utils, bcs } from "@starcoin/starcoin";
import { hexlify } from "@ethersproject/bytes";

const getTxhash = async (provider, funcId, tyArgs, args) => {
  const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(
    funcId,
    tyArgs,
    args,
    process.env.VUE_APP_STAR_COIN_URL
  );
  const payloadInHex = (function () {
    const se = new bcs.BcsSerializer();
    scriptFunction.serialize(se);
    return hexlify(se.getBytes());
  })();
  const txhash = await provider.getSigner().sendUncheckedTransaction({
    data: payloadInHex,
  });
  return txhash;
};

export { getTxhash };
