<template>
  <div class="home-wrap">
    <swiper
      :speed="swiper_options.speed"
      :direction="swiper_options.direction"
      :mousewheel="swiper_options.mousewheel"
    >
      <swiper-slide>
        <first-page></first-page>
      </swiper-slide>
      <swiper-slide>
        <second-page></second-page>
      </swiper-slide>
      <swiper-slide>
        <third-page></third-page>
      </swiper-slide>
      <swiper-slide>
        <four-page></four-page>
      </swiper-slide>
      <swiper-slide>
        <five-page></five-page>
      </swiper-slide>
      <swiper-slide>
        <six-page></six-page>
      </swiper-slide>
      <swiper-slide>
        <seven-page></seven-page>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, watch } from "vue";
import FirstPage from "../../components/Home/FirstPage.vue";
import SecondPage from "../../components/Home/SecondPage.vue";
import ThirdPage from "../../components/Home/ThirdPage.vue";
import FourPage from "../../components/Home/FourPage.vue";
import FivePage from "../../components/Home/FivePage.vue";
import SixPage from "../../components/Home/SixPage.vue";
import SevenPage from "../../components/Home/SevenPage.vue";

import SwiperCore, { Autoplay, Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper.min.css";
SwiperCore.use([Autoplay, Mousewheel]);

let state = reactive({
  showTab: 6,
});

let swiper_options = reactive({
  speed: 500,
  direction: "vertical",
  mousewheel: true,
});
</script>

<style>
.home-wrap .swiper-container {
  width: 100%;
  height: 100%;
}
.home-wrap .swiper-wrapper {
  width: 100%;
  height: 100%;
}
.home-wrap .swiper-slide {
  width: 100% !important;
  height: 100% !important;
}
</style>
<style lang="scss" scoped>
.home-wrap {
  width: 100%;
  height: 100%;
}
</style>
