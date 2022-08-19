<template>
  <div
    v-if="state.swapCalcalatorData"
    class="swap-datamenu"
    :style="{ top: `${state.isShow ? '16px' : '200px'}` }"
  >
    <template v-if="state.swapCalcalatorData">
      <div class="swap-datamenu-sold">
        <p>
          <span>{{
            `${
              state.focusType === "from" ? $t("最小接收量") : $t("最大发送量")
            }`
          }}</span>
          <Fly-tool-tip
            placement="right"
            :placeString="
              state.focusType === 'from'
                ? $t(
                    '此次交易收到的最小数量，由于在您的订单确认之前市场会有变化，导致的最终兑换比例会有不同。'
                  )
                : $t(
                    '此次交易卖出的最大数量，由于在您的订单确认之前市场会有变化，导致的最终兑换比例会有不同。'
                  )
            "
            svgName="f-question"
            :svgStyle="{
              'margin-left': '3px',
            }"
          >
          </Fly-tool-tip>
        </p>
        <p v-if="state.focusType === 'from'">
          {{ state.swapCalcalatorData.minReceived }}
          {{ state.swapCalcalatorData.currency }}
        </p>
        <p v-if="state.focusType === 'to'">
          {{ state.swapCalcalatorData.maxSold }}
          {{ state.swapCalcalatorData.currency }}
        </p>
        <!-- <p>
          {{
            state.focusType === "from"
              ? state.swapCalcalatorData.minReceived
              : state.swapCalcalatorData.maxSold
          }}
          {{ state.from.currency }}
        </p> -->
      </div>
      <div class="swap-datamenu-price-impact">
        <p>
          <span>{{ $t("价格影响") }}</span>

          <Fly-tool-tip
            placement="right"
            :placeString="
              $t(
                '即此次兑换对市场内代币均价的影响，价格影响为换入币种价格的影响。'
              )
            "
            svgName="f-question"
            :svgStyle="{
              'margin-left': '3px',
            }"
          >
          </Fly-tool-tip>
        </p>
        <p>{{ priceVisible(state.swapCalcalatorData.priceImpact) }}</p>
      </div>
      <div class="swap-datamenu-fee">
        <p>
          <span>{{ $t("路径") }}</span>
          <Fly-tool-tip
            :placeString="$t('兑换将通过此路径进行以获得最优的价格。')"
            svgName="f-question"
            placement="right"
            :svgStyle="{
              'margin-left': '3px',
            }"
          >
          </Fly-tool-tip>
        </p>
        <p>{{ renderPath(state.swapCalcalatorData.path) }}</p>
      </div>
    </template>
  </div>
</template>
<script setup>
import FlyToolTip from "@FlyUI/FlyToolTip.vue";
import { computed, reactive } from "vue";
// import { ElTooltip } from "element-plus";
import { useStore } from "vuex";
const store = useStore();
let state = reactive({
  from: computed(() => store.state.StoreSwap.from),
  isShow: computed(() => store.state.StoreSwap.isShowCalcalatorCard),
  focusType: computed(() => store.state.StoreSwap.focusType),
  swapCalcalatorData: computed(() => store.state.StoreSwap.swapCalcalatorData),
  settings: computed(() => store.state.StoreApp.settings),
});
const renderPath = (path) => {
  return path.reduce((pre, curr, i) => {
    return (pre += `${curr}${i !== path.length - 1 ? ">" : ""}`);
  }, "");
};
const priceVisible = (value) => {
  let price = value.slice(0, value.length - 1);
  if (price <= 0.01) {
    price = 0.01;
    return `<= ${price}%`;
  } else if (price >= 99.99) {
    return `>= ${price}%`;
  } else {
    return value;
  }
};
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
@import "~@/styles/variables.scss";
.swap-datamenu {
  padding: 30px 20px;
  width: 440px;
  border-radius: 34px;
  background-color: #252525;
  transition: top 500ms ease-in-out 0s;
  display: inline-block;
  position: relative;
  left: 50%;
  color: $text-white-color;
  transform: translate(-50%, 0);
  div {
    display: flex;
    justify-content: space-between;
    padding: 6px 0px;
    font-size: 14px;
    .question {
      margin-left: 8px;
    }
  }
}
</style>
