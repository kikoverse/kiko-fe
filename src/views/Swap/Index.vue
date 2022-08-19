<template>
  <div class="swap-container">
    <Fly-space :size="20"></Fly-space>
    <fly-space :size="25"></fly-space>
    <fly-swap-card class="swap-container-card">
      <swap-core class="swap-container-core"></swap-core>
    </fly-swap-card>
    <swap-transition-card
      class="swap-container-transition-card"
    ></swap-transition-card>
    <FlySpecialBg :showSquare="true"></FlySpecialBg>
  </div>
</template>
<script setup>
import SwapCore from "@components/Swap/core.vue";
import SwapTransitionCard from "@components/Swap/card.vue";
import FlySwapCard from "@FlyUI/FlySwapCard.vue";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
import FlySpace from "@FlyUI/FlySpace.vue";
// const test = (type) => {
//   let t = {};
//   if (type === "from") {
//     t = {
//       type,
//       currency: "BTC",
//     };
//   }

//   if (type === "to") {
//     t = {
//       type,
//       currency: "BSV",
//     };
//   }
//   store.dispatch("StoreSwap/setSelectCurrencyInfo", t);
// };
</script>
<style lang="scss" scoped>
.swap-container {
  justify-self: center;
  align-self: center;
  margin-top: -200px;
  .swap-container-btnwarp {
    display: flex;
    justify-content: center;
  }
  .swap-container-card {
    margin: 0 auto;
    position: relative;
    .swap-container-core {
      position: relative;
      width: 100%;
    }
  }
  .swap-container-transition-card {
    margin: 0 auto;
    position: relative;
  }
}
</style>
