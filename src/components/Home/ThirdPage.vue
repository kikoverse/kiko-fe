<!-- third screen page -->
<template>
  <div class="wrap">
    <div class="content">
      <div class="desc-wrap">
        <p class="title">{{ $t("home.game-title") }}</p>
        <p>{{ $t("home.game-desc1") }}</p>
        <p>{{ $t("home.game-desc2") }}</p>
      </div>
      <img
        v-image="HOME_CONSTANTS.THIRD_CAT"
        :default-img="defaultImg"
        alt=""
      />
    </div>
    <div class="bg"></div>
  </div>
</template>

<script setup>
import HOME_CONSTANTS from "@constants/home";
const defaultImg = require("../../assets/home/new-home/third-cat.png");
</script>
<style lang="scss" scoped>
@import "./common.scss";
.bg {
  position: absolute;
  right: 0;
  top: 0;
  width: 30%;
  height: 40%;
  background: linear-gradient(166deg, #de7d00 0%, #feca4a 100%);
  opacity: 0.43;
  filter: blur(138px);
}
</style>
