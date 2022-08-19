<template>
  <div class="mining-container">
    <FlySpecialBg></FlySpecialBg>
    <fly-nft coreType="list" class="mining-container-nft">
      <template #nft-list>
        <mining-core></mining-core>
      </template>
    </fly-nft>
  </div>
</template>
<script setup>
/* eslint-disable */
import FlyNft from "@FlyUI/FlyNFT.vue";
import { computed, onMounted, reactive, defineProps, defineEmits } from "vue";
import MiningCore from "@components/NFT/Mining/MainCore.vue";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
</script>

<style lang="scss" scoped>
.mining-container {
  .mining-container-nft {
    margin: 0 auto;
    padding-bottom: 30px;
  }
}
</style>
