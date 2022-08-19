<!-- five screen page -->
<template>
  <div class="wrap">
    <div class="content">
      <div class="desc-wrap">
        <p class="title">{{ $t("home.defi-title") }}</p>
        <p>{{ $t("home.defi-desc1") }}</p>
        <p>{{ $t("home.defi-desc2") }}</p>
      </div>
      <img
        v-image="HOME_CONSTANTS.LIQUIDITY_CAT"
        :default-img="defaultImg"
        alt=""
      />
    </div>
  </div>
</template>

<script setup>
import HOME_CONSTANTS from "@constants/home";
const defaultImg = require("../../assets/home/new-home/five-cat.png");
</script>
<style lang="scss" scoped>
@import "./common.scss";
.wrap {
  .content {
    & > img {
      width: 55%;
    }
  }
}
</style>
