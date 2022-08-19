<template>
  <div :class="$style['home-container']">
    <first-screen></first-screen>
    <div :class="$style['home-container-gap']"></div>
    <!-- <img src="../../assets/home/firstscreen-bg.png" /> -->
    <div :class="$style['home-container-main']">
      <book-screen
        ref="BookScreenDOM"
        :percentage="state.percentage"
      ></book-screen>
      <content-screen></content-screen>
    </div>
    <footer-screen></footer-screen>
  </div>
</template>
<script setup>
/* eslint-disable */
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  defineProps,
  defineEmits,
  nextTick,
  ref,
} from "vue";
import FirstScreen from "@components/Home/firstscreen.vue";
import BookScreen from "@components/Home/book.vue";
import ContentScreen from "@components/Home/content.vue";
import FooterScreen from "@components/Home/footer.vue";
import utilsDom from "@utils/dom";
import utilsNumber from "@utils/number";
// import PureFullPage from "pure-full-page";

const state = reactive({
  percentage: 0,
});

const setSlideAnimation = () => {
  const viewHeight = utilsDom.getViewPortHeight();
  const scrollTop = utilsDom.getScrollTop();
  const percentage = utilsNumber.formatNumberMeta(
    utilsNumber.bigNum(scrollTop).div(viewHeight).toString(),
    {
      precision: 3,
    }
  ).text;
  state.percentage = percentage;
};
onMounted(() => {
  nextTick(() => {
    window.addEventListener("scroll", setSlideAnimation, false);
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", setSlideAnimation);
});
</script>
<style lang="scss" module>
.home-container {
  .home-container-main {
    background-image: url("../../assets/home/sand-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%;
  }
  .home-container-gap {
    // height: 30vh;
    // width: 100%;
    // background-image: url("../../assets/home/sand-bg.png");
  }
}
</style>
