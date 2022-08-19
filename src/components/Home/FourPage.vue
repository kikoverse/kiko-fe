<!-- four screen page -->
<template>
  <div class="wrap">
    <div class="content">
      <img
        v-image="HOME_CONSTANTS.PHOTO_CAT"
        :default-img="defaultImg"
        alt=""
      />
      <div class="desc-wrap">
        <p class="title">{{ $t("home.nft-title") }}</p>
        <p>{{ $t("home.nft-desc1") }}</p>
        <p>{{ $t("home.nft-desc2") }}</p>
      </div>
    </div>
    <div class="bg"></div>
  </div>
</template>

<script setup>
import HOME_CONSTANTS from "@constants/home";
const defaultImg = require("../../assets/home/new-home/four-cat.png");
</script>
<style lang="scss" scoped>
@import "./common.scss";
.wrap {
  .content {
    .desc-wrap {
      & > p {
        width: 70%;
        margin-left: 70px;
      }
    }
    & > img {
      width: 50%;
    }
  }
}
.bg {
  position: absolute;
  left: 0;
  top: 40%;
  width: 30%;
  height: 60%;
  background: linear-gradient(166deg, #de7d00 0%, #feca4a 100%);
  opacity: 0.43;
  filter: blur(138px);
}
</style>
