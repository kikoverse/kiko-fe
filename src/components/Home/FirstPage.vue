<!-- first screen page -->
<template>
  <div class="first-wrap">
    <div class="content-wrap">
      <div class="desc">
        <img src="../../assets/home/new-home/slogn.svg" alt="" />
        <!-- <div @click="handleGoSwap">{{ $t("home.learn-more") }}</div> -->
        <fly-button class="btn" type="normal" @click="handleGoSwap">{{
          $t("home.learn-more")
        }}</fly-button>
      </div>
      <!-- <img :src="HOME_CONSTANTS.PLUTUS_CAT" alt="" /> -->
      <img
        v-image="HOME_CONSTANTS.PLUTUS_CAT"
        :default-img="defaultImg"
        alt=""
      />
    </div>
  </div>
</template>

<script setup>
import HOME_CONSTANTS from "@constants/home";
import FlyButton from "@FlyUI/FlyButton.vue";
import utilsTool from "@utils/tool";
import { reactive, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const defaultImg = require("../../assets/home/new-home/cat.png");

let state = reactive({
  currLang: computed(() => store.state.StoreApp.currLang),
});

const handleGoSwap = () => {
  console.log("currLang", state.currLang);
  state.currLang === "zh"
    ? utilsTool.openNewWindow(
        "https://kiko-verse.gitbook.io/kiko-yuan-yu-zhou/kiko-yuan-yu-zhou"
      )
    : utilsTool.openNewWindow(
        "https://kiko-verse.gitbook.io/kiko-verse/kikoverse"
      );
};
</script>
<style lang="scss" scoped>
.first-wrap {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/home/new-home/first-screen-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  .content-wrap {
    width: 70%;
    height: 80%;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .desc {
      display: flex;
      flex-direction: column;
      & > img {
        width: 150%;
      }
      span:first-child {
        font-size: 40px;
        font-family: DenmarkRegular;
        color: #ffffff;
        line-height: 64px;
      }
      span:nth-child(2) {
        margin-top: 4px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 22px;
      }
      .btn {
        width: 300px;
        height: 80px;
        margin-top: 47px;
        padding: 0;
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #000000;
        line-height: 28px;
      }
    }
    img {
      height: 100%;
      margin-right: -10%;
    }
  }
}
@media screen and (max-width: 1800px) {
  .first-wrap {
    .content-wrap {
      .desc {
        & > img {
          width: 100%;
        }
        .btn {
          width: 190px;
          height: 50px;
          margin-top: 47px;
          padding: 0;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
