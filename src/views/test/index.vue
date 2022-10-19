<template>
  <button @click="aaa">connect</button>
</template>
<script setup>
// import { getMartianAccountBalance } from "../../walletUtils/martianMask";
// import { AptosClient } from "aptos";
const aaa = async () => {
  await window.martian.connect();
  const metadata = {
    address: true,
    application: true,
    chainId: true,
    message: "test aptos secp256k1",
    nonce: 12345,
  };
  const signature = await window.martian.signMessage(metadata);
  console.log(JSON.stringify(signature));
};
</script>
