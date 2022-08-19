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
        <div class="nft-list-content">
          <list></list>
          <div class="import" @click="handlePush()">
            <svg-icon name="address" class="svg"></svg-icon>
            <span>{{ $t("导入合约地址") }}</span>
          </div>
        </div>
      </template>
    </fly-nft>
  </div>
</template>

<style lang="scss" scoped>
.blind-box-container {
  margin: 0 auto;
  padding-bottom: 30px;
  min-height: 800px;
  .nft-list-content {
    position: relative;
  }
  .import {
    width: 200px;
    background-size: cover;
    text-align: right;
    position: absolute;
    z-index: 100;
    top: 48px;
    right: 0px;
    cursor: pointer;
    color: $white;
    svg {
      width: 15px;
      height: 18px;
      display: inline-block;
      margin-right: 10px;
      margin-top: 2px;
    }
    span {
      display: inline-block;
      color: #8c8b8c;
    }
  }
}
</style>

<script setup>
import FlyNft from "@FlyUI/FlyNFT.vue";
import list from "@components/NFT/BlindBox/list.vue";
import { useRouter } from "vue-router";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
const router = useRouter();

const handlePush = () => {
  router.push({
    name: "nftgallery",
    params: {
      tabIndex: 1,
    },
  });
};
</script>
