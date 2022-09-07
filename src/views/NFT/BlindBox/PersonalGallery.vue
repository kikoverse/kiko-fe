<template>
  <fly-nft
    class="nft-gallery"
    coreType="list"
    :cardStyleType="false"
    :listTypeParams="{ minHeight: '800px' }"
  >
    <template #nft-list><gallery></gallery></template>
  </fly-nft>
</template>

<script setup>
import FlyNft from "@FlyUI/FlyNFT.vue";
import gallery from "@components/NFT/BlindBox/personalGallery.vue";
</script>

<style lang="scss" scoped>
.nft-gallery {
  width: 1200px;
  margin: 30px auto;
  padding-bottom: 30px;
  min-height: 800px;
}
</style>
