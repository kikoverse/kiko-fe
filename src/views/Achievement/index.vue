<template>
  <FlySpecialBg></FlySpecialBg>
  <div v-if="store.state.StoreWallet.walletStatus === 'connected'">
    <Container></Container>
  </div>
  <nft-no-connected-wallet class="no-data" v-else></nft-no-connected-wallet>
</template>
<script setup>
import NftNoConnectedWallet from "@components/NFT/NFTNoConnectedWallet.vue";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
import Container from "./components/container.vue";
import { useStore } from "vuex";
const store = useStore();
</script>
