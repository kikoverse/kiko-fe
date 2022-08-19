<template>
  <fly-nft
    class="blind-box-container"
    coreType="card"
    :cardTypeParams="{ minHeight: '800px' }"
  >
    <template #nft-card>
      <core></core>
    </template>
  </fly-nft>
</template>

<style lang="scss" scoped>
.blind-box-container {
  margin: 0 auto;
  padding-bottom: 30px;
}
</style>

<script setup>
import FlyNft from "@FlyUI/FlyNFT.vue";
import core from "@components/NFT/BlindBox/core.vue";
</script>
