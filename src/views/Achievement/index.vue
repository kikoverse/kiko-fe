<template>
  <FlySpecialBg></FlySpecialBg>
  <div v-if="store.state.StoreWallet.walletStatus === 'connected'">
    <Container :account="account"></Container>
  </div>
  <nft-no-connected-wallet class="no-data" v-else></nft-no-connected-wallet>
</template>
<script setup>
import NftNoConnectedWallet from "@components/NFT/NFTNoConnectedWallet.vue";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
import Container from "./components/container.vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ref, watchEffect } from "vue";
const store = useStore();
const route = useRoute();
const router = useRouter();
const account = ref("");

watchEffect(() => {
  console.log(route.path);
  if (route.path.indexOf("/POAP") !== -1) {
    if (route.params.id) {
      account.value = route.params.id;
    } else if (store.state.StoreWallet.walletStatus === "connected") {
      account.value = store.state.StoreWallet.accounts[0];
      router.push({
        name: "POAP",
        params: {
          id: store.state.StoreWallet.accounts[0],
        },
      });
    }
  }
});
</script>
