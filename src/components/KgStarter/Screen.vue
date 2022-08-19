<template>
  <div :class="[$style['screen-wrap']]">
    <div :class="$style['screen-container']" :ref="tvDOM">
      <div :class="$style['screen-container-header']">
        <img
          src="../../assets/igo/header.png"
          :class="$style['screen-container-header-img']"
        />
      </div>
      <div :class="$style['screen-container-content']">
        <img
          src="../../assets/igo/logo.png"
          :class="$style['screen-container-content-img']"
        />
        <div :class="$style['screen-container-loading']">
          <div
            v-for="(d, i) in new Array(12)"
            :ref="
              (el) => {
                if (el) state.loadingDOMs[i] = el;
              }
            "
            :key="i"
            :class="$style['screen-container-loading-item']"
          ></div>
        </div>
      </div>
      <img
        src="../../assets/igo/keyboard.png"
        :class="$style['screen-container-keyboard']"
      />
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, watch, nextTick, ref } from "vue";
const emits = defineEmits(["loadEnd"]);
let tvDOM = ref(null);
let state = reactive({
  loadingDOMs: [],
  isLoading: true,
});

nextTick(() => {
  new Promise((resolve) => {
    for (let i = 0; i < state.loadingDOMs.length; i++) {
      setTimeout(() => {
        state.loadingDOMs[i].style.opacity = 1;
        if (i === 11) {
          return resolve("done");
        }
      }, 220 * i);
    }
  }).then(() => {
    emits("loadEnd");
  });
});
</script>
<style lang="scss" module>
@keyframes zoomIn {
  0% {
    // transform: scale(1);
    // transform-origin: center center;
  }
  20% {
    // transform: scale(1.2);
  }
  50% {
    // transform: scale(2);
  }
  100% {
    // transform: scale(3);
    // height: 100%;
    // width: 100%;
    height: 100vh;
    width: 100%;
    position: fixed;
    top: 0;
    left: 200px;
  }
}
.screen-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  // background: red;
  // height: 100vh;
  // height: 100vh;
  // width: 100%;
  // background: red;
  height: calc(100vh - 100px);
  // animation: zoomIn 3s linear forwards;
}
.screen-container {
  // transform: scale(2);
  width: 660px;
  height: 580px;
  text-align: center;
  background: #fcb502;
  box-shadow: 0px 0px 8px 5px #ffcc3d;
  border-radius: 43px;
  // position: absolute;

  // height: 100vh;
  // width: 100%;
  // top: 0;
  // transform: scale(3);
  // position: fixed;
  // top: 0;
  // position: absolute;
  // top: 60%;
  // left: 50%;
  // margin-left: -50%;
  // margin-top: -60%;
  // transform: translate(-50%, -60%);
  .screen-container-header {
    width: 248px;
    height: 17px;
    margin: 15px auto;
    .screen-container-header-img {
      width: 100%;
      height: 100%;
    }
  }
  .screen-container-content {
    height: 350px;
    width: 560px;
    margin: 0 auto;
    background: #000000;
    border: 15px solid #283037;
    border-radius: 5px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &::after {
      content: "";
      display: block;
      position: absolute;
      height: calc(100% + 40px);
      width: calc(100% + 40px);
      top: -20px;
      left: -20px;
      border-radius: 4px;
      background: linear-gradient(#dc8c04, #fec944);
      z-index: -1;
    }
    .screen-container-content-img {
      width: 160px;
    }
    .screen-container-loading {
      margin-top: 25px;
      display: flex;
      .screen-container-loading-item {
        height: 15px;
        width: 9px;
        background: #ffffff;
        opacity: 0.3;
        margin-left: 5px;
      }
    }
  }
  .screen-container-keyboard {
    width: 50%;
    display: inline-block;
    margin-top: 15px;
    // height: 100px;
  }
}
</style>
