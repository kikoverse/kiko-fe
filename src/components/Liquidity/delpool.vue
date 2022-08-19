<template>
  <div class="liquidity-content-core-delete">
    <div class="liquidity-content-core-delete-input">
      <div class="liquidity-content-core-delete-main">
        <Fly-input
          class="liquidity-content-core-delete-main-input"
          placeholder="0.0"
          :value="state.inpVal"
          :max="state.lpDelInfo.poolAmount"
          @inputEvent="inputEvent($event)"
        ></Fly-input>
        <div class="liquidity-content-core-delete-main-currencyselect">
          <span>
            {{ state.lpDelInfo.lpToken }}
          </span>
          <!-- <svg-icon name="arrowdownselect"></svg-icon> -->
        </div>
      </div>
      <div class="liquidity-content-core-delete-title">
        <span v-if="state.lpDelInfo.poolAmount">
          {{ $t("余额") }}: {{ state.lpDelInfo.poolAmount }}
        </span>
        <span
          class="liquidity-content-core-max"
          @click="setToInputValueMax(state.lpDelInfo.poolAmount)"
        >
          MAX
        </span>
      </div>
    </div>
    <fly-space :size="36"></fly-space>
    <div class="liquidity-content-core-delete-item">
      <span>
        {{ state.lpDelInfo.A.data }}
      </span>
      <span>{{ state.lpDelInfo.A.key }}</span>
    </div>
    <div class="change-content">
      <svg-icon name="f-cross" class="icon"></svg-icon>
    </div>
    <div class="liquidity-content-core-delete-item">
      <span>
        {{ state.lpDelInfo.B.data }}
      </span>
      <span>{{ state.lpDelInfo.B.key }}</span>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive, onUnmounted, onMounted } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import { useStore } from "vuex";
import utilsNumber from "@utils/number";
import FlyInput from "@FlyUI/FlyInput";
// import { ElTooltip } from "element-plus";
const store = useStore();

let state = reactive({
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  lpDelInfo: computed(() => store.state.StoreLiquidity.lpDelInfo),
  poolType: computed(() => store.state.StoreLiquidity.poolType),
  inpVal: computed(() => store.state.StoreLiquidity.delInpVal),
});

const inputEvent = (val) => {
  store.dispatch("StoreLiquidity/setDelPoolTokenData", { value: val });
};
const setToInputValueMax = (value) => {
  if (value && utilsNumber.bigNum(value).gt(0)) {
    store.dispatch("StoreLiquidity/setDelPoolTokenData", { value: value });
  }
};
// delete或add去循环请求最新的XY
onMounted(() => {
  store.dispatch("StoreLiquidity/getLiquidityXYThrottle");
  store.dispatch("StoreLiquidity/getTotalAmountWithLPToken");
  state.delTimer = setInterval(() => {
    store.dispatch("StoreLiquidity/getLiquidityXYThrottle");
    store.dispatch("StoreLiquidity/getTotalAmountWithLPToken");
  }, 5000);
});

onUnmounted(() => {
  if (state.delTimer) {
    clearInterval(state.delTimer);
  }
  store.commit("StoreLiquidity/CLEAR_DELETE_INFO");
});
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/mixin.scss";
.liquidity-content-core-btn {
  .fly-button {
    width: 100%;
    padding: 15px 0px;
  }
}

.change-content {
  text-align: center;
  padding: 20px 0;
  .icon {
    cursor: default;
    width: 9px;
  }
}
.liquidity-content-core-delete {
  .liquidity-content-core-delete-item {
    color: $text-white-color;
    width: 100%;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 17px;
    box-sizing: border-box;
    span {
      font-size: 20px;
    }
    span:first-child {
      color: $text-white-color;
    }
    span:last-child {
      color: $text-white-color;
    }
    &:last-child {
      margin-bottom: 16px;
    }
  }
}
.liquidity-content-core-delete-input {
  border-radius: 16px;
  height: 90px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  .liquidity-content-core-delete-title {
    display: flex;
    font-size: 14px;
    justify-content: flex-end;
    .liquidity-content-core-max {
      color: $text-orange-color2;
      margin-left: 4px;
    }
  }
  .liquidity-content-core-delete-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    .liquidity-content-core-delete-main-input {
      ::v-deep(.el-input__inner) {
        border: none;
        background: none;
        color: $text-white-color;
        font-size: 24px;
      }
      width: 230px;
    }
    .liquidity-content-core-delete-main-currencyselect {
      margin-left: 2px;
      &:hover {
        opacity: 0.6;
      }
      span {
        text-align: center;
        font-size: 16px;
        display: inline-block;
      }
    }
  }
}
</style>
