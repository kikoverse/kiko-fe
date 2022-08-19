<template>
  <div class="liquidity-transition-card" :style="{ top: '30px' }">
    <!-- :style="{ top: `${state.isShow ? '40px' : '-180px'}` }" -->
    <template v-if="state.poolType === 'add'">
      {{
        $t(
          "流动性提供商通过添加流动性可获取该币对所有交易额的0.3%作为奖励，与在流动性资金池中的持有份额成正比。"
        )
      }}
    </template>
    <template v-if="state.poolType === 'delete'">
      {{
        $t(
          "移除流动性后，代币会按当前兑换率返还至您的钱包中，之后您将不再获得流动性手续费奖励。"
        )
      }}
    </template>
  </div>
</template>
<script setup>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
const store = useStore();
let state = reactive({
  isShow: computed(() => store.getters["Storeliquidity/showIntroduceCard"]),
  poolType: computed(() => store.state.StoreLiquidity.poolType),
});
</script>
<style lang="scss">
.el-popper.is-light {
  box-shadow: 0px 6px 14px 0px rgba(0, 0, 0, 0.16);
  border: none;
}
.el-popper.is-light .el-popper__arrow:before {
  border: none;
}
</style>
<style lang="scss" scoped>
.liquidity-transition-card {
  padding: 30px 20px;
  width: 440px;
  border-radius: 34px;
  background-color: #252525;
  transition: top 500ms ease-in-out 0s;
  display: inline-block;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  color: #979797;
}
</style>
