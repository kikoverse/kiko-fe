<template>
  <div class="blind-container">
    <FlySpecialBg></FlySpecialBg>
    <fly-nft
      class="blind-box-container"
      coreType="list"
      :cardStyleType="false"
      :listTypeParams="{ minHeight: '800px' }"
    >
      <template #nft-list>
        <CreateFrom />
      </template>
    </fly-nft>
  </div>
</template>

<style lang="scss" scoped>
.blind-box-container {
  margin: 0 auto;
  padding-bottom: 30px;
  min-height: 800px;
}
</style>

<script setup>
import FlyNft from "@FlyUI/FlyNFT.vue";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
import CreateFrom from "./components/createNFTFrom.vue";
</script>
