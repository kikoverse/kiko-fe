<template>
  <div class="liquidity-container">
    <Fly-space :size="20"></Fly-space>
    <Fly-space :size="25"></Fly-space>
    <fly-swap-card class="liquidity-container-card">
      <liquidity-core class="liquidity-container-core"></liquidity-core>
    </fly-swap-card>
    <liquidity-transition-card
      v-if="state.poolType === 'add' || state.poolType === 'delete'"
      class="liquidity-container-transition-card"
    ></liquidity-transition-card>
    <FlySpecialBg :showSquare="true"></FlySpecialBg>
  </div>
</template>
<script setup>
import { computed, reactive } from "vue";
import LiquidityCore from "@components/Liquidity/core.vue";
import LiquidityTransitionCard from "@components/Liquidity/transitioncard.vue";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
import FlySwapCard from "@FlyUI/FlySwapCard.vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import { useStore } from "vuex";
const store = useStore();
let state = reactive({
  poolType: computed(() => store.state.StoreLiquidity.poolType),
});
</script>
<style lang="scss" scoped>
.liquidity-container {
  // position: relative;
  // left: 50%;
  // display: inline-block;
  // transform: translate(-50%, 0);
  justify-self: center;
  align-self: center;
  margin-top: -200px;
  .liquidity-container-btnwarp {
    display: flex;
    justify-content: center;
  }
  .liquidity-container-card {
    margin: 0 auto;
    position: relative;
    .liquidity-container-core {
      position: relative;
      width: 100%;
    }
  }
  .liquidity-container-transition-card {
    margin: 0 auto;
    position: relative;
  }
}
</style>
