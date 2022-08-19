<!-- second screen page -->
<template>
  <div class="second-wrap">
    <div class="content-wrap">
      <img class="bg" src="../../assets/home/new-home/second-bg.png" alt="" />
      <img
        class="cat"
        v-image="HOME_CONSTANTS.RUNNING_CAT"
        :default-img="defaultImg"
        alt=""
      />
      <div class="desc-wrap">
        <p class="title">{{ $t("home.letter-title") }}</p>
        <p>{{ $t("home.letter-desc1") }}</p>
        <p>{{ $t("home.letter-desc2") }}</p>
        <p>{{ $t("home.letter-desc3") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import HOME_CONSTANTS from "@constants/home";

const defaultImg = require("../../assets/home/new-home/second-img1.png");
</script>
<style lang="scss" scoped>
.second-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .content-wrap {
    width: 90%;
    min-width: 1000px;
    height: fit-content;
    position: relative;
    .bg {
      width: 100%;
    }
    .cat {
      position: absolute;
      top: 20%;
      left: 10%;
      width: 40%;
    }
    .desc-wrap {
      width: 30%;
      height: 100%;
      position: absolute;
      right: 10%;
      top: 60%;
      transform: translateY(-50%);
      z-index: 1;
      background: url("../../assets/home/new-home/content-bg.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      .title {
        font-size: 24px;
        font-family: Denmark;
        color: #000000;
        line-height: 29px;
        margin: 11% 0 0 12%;
      }
      & > p {
        width: 80%;
        margin-top: 22px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        line-height: 20px;
        margin: 6% 12% 0 12%;
      }
    }
  }
}
@media screen and (min-width: 1800px) {
  .second-wrap {
    .content-wrap {
      width: 80%;
      .desc-wrap {
        bottom: -20%;
        .title {
          font-size: 36px;
          line-height: 32px;
          padding-bottom: 30px;
        }
        & > p {
          font-size: 20px;
          line-height: 32px;
          margin-top: 12px;
        }
      }
    }
  }
}
</style>
