<template>
  <div class="liquidity-content-header">
    <div class="liquidity-content-header-left">
      <template v-if="state.poolType === 'init'">
        <span>{{ $t("您的流动性") }}</span>
        <Fly-tool-tip
          :placeString="
            $t(
              '添加流动性可以获得手续费分红或空投代币收益，实际获得的数量将和在流动性资金池中的份额成正比。同时还可以获得LP Tokens。'
            )
          "
          svgName="f-question"
          :svgStyle="{
            'margin-left': '3px',
          }"
        >
        </Fly-tool-tip>
      </template>
      <template v-if="state.poolType === 'add'">
        <svg-icon name="f-back" @click="back" class="back"></svg-icon>
        <span>{{ $t("添加流动性") }}</span>
      </template>
      <template v-if="state.poolType === 'delete'">
        <svg-icon name="f-back" @click="back" class="back"></svg-icon>
        <span>{{ $t("移除流动性") }}</span>
      </template>
    </div>

    <div class="liquidity-content-header-right">
      <svg-icon name="f-setting" @click="showSetting"></svg-icon>
      <svg-icon name="f-record" @click="showHistory"></svg-icon>
    </div>
  </div>
</template>
<script setup>
// import { ElTooltip } from "element-plus";
import { computed, reactive } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlyToolTip from "@FlyUI/FlyToolTip.vue";
import { useStore } from "vuex";
const store = useStore();

let state = reactive({
  hasLiquidity: computed(() => store.state.StoreLiquidity.hasLiquidity),
  poolType: computed(() => store.state.StoreLiquidity.poolType),
  isShowRefreshDialog: false,
  accounts: computed(() => store.state.StoreWallet.accounts),
  totalLiquidityList: computed(
    () => store.state.StoreLiquidity.totalLiquidityList
  ),
});

const back = () => {
  store.commit("StoreLiquidity/CHANGE_POOL_TYPE", "init");
};

const showSetting = () => {
  store.commit("StoreApp/CHANGE_SETTING_VISIBLE", true);
};
const showHistory = () => {
  store.commit("StoreLiquidity/CHANGE_HISTORY_RECORD_VISIBLE", true);
  if (state.totalLiquidityList.length === 0) {
    store.dispatch("StoreLiquidity/getLiquidityHistoryList", {
      userAddress: state.accounts[0],
      pageSize: 6,
      nextId: 0,
    });
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.liquidity-content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: $text-white-color;
  .liquidity-content-header-left {
    display: flex;
    align-items: center;
    p,
    span {
      font-size: 20px;
      font-weight: 600;
    }
    .back {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
    .question {
      margin-left: 3px;
    }
  }
  .liquidity-content-header-right {
    .svg-icon {
      width: 18px;
      height: 18px;
    }
    .svg-icon:last-child {
      margin-left: 15px;
    }
  }
}
</style>
