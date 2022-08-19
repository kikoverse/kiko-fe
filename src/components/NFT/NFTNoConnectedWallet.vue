<template>
  <div class="nft-no-data">
    <div class="nft-no-data-box">
      <div class="nft-no-data-text">{{ $t("没有数据") }}</div>
      <div class="nft-no-data-text">{{ $t("请连接钱包") }}</div>
      <fly-button type="normal" class="nft-no-data-btn" @click="connectWallet">
        {{ $t("连接钱包") }}
      </fly-button>
    </div>
  </div>
</template>
<script setup>
import FlyButton from "@FlyUI/FlyButton.vue";
import connectLogic from "@hooks/useMyWallet";
import { useStore } from "vuex";
const store = useStore();
const { connectWallet } = connectLogic(store);
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.nft-no-data {
  width: 100%;
  height: 263px;
  border-radius: 16px;
  color: $text-brown-color;
  padding: 0 96px;
  box-sizing: border-box;
  // background-color: $btn-light-orange-bgcolor;
  background: url("../../assets/nft/no-connect-bgNew.png") no-repeat;
  background-size: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  position: relative;
  .nft-no-data-box {
    position: absolute;
    right: 30px;
    text-align: center;
    top: 90px;
    .nft-no-data-text {
      color: #fff;
      font-size: 24px;
      text-align: left;
      width: 250px;
    }
    .nft-no-data-btn {
      margin-top: 5px;
      width: 200px;
      font-size: 16px;
    }
  }
}
</style>
