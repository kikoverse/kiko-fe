<template>
  <div
    :set="
      ((A = formatFrom(
        state.walletStatus,
        state.from.currency,
        state.from.token
      )),
      (B = formatTo(state.walletStatus, state.to.currency, state.to.token)))
    "
  >
    <div class="liquidity-content-core-box">
      <div class="liquidity-content-core-item form">
        <div class="liquidity-content-core-item-main">
          <Fly-input
            class="liquidity-content-core-item-main-input"
            placeholder="0.0"
            :precision="state.from.exchangePrecision"
            :value="state.from.inputVal"
            :max="A.disPlayBalance"
            @inputEvent="inputEvent($event, 'from')"
          ></Fly-input>
          <div>
            <div
              class="liquidity-content-core-item-main-currencyselect"
              @click="handleCurrencySelectDialog('from')"
            >
              <img v-if="state.from.icon" :src="state.from.icon" />
              <span>
                {{ A.disPlayCurrency }}
              </span>
            </div>
            <div class="liquidity-content-core-item-title">
              <span v-if="A.disPlayBalance">
                {{ $t("余额") }}: {{ A.disPlayBalance }}
              </span>
              <span
                class="liquidity-content-core-item-main-max"
                v-if="state.walletStatus === 'connected' && state.from.currency"
                @click="setToInputValueMax('from', A.disPlayBalance)"
              >
                MAX
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="change-content">
        <svg-icon name="f-cross"></svg-icon>
      </div>
      <div class="liquidity-content-core-item to">
        <div class="liquidity-content-core-item-main">
          <Fly-input
            class="liquidity-content-core-item-main-input"
            :value="state.to.inputVal"
            :precision="state.to.exchangePrecision"
            placeholder="0.0"
            :max="B.disPlayBalance"
            @inputEvent="inputEvent($event, 'to')"
          ></Fly-input>

          <div>
            <div
              class="liquidity-content-core-item-main-currencyselect"
              @click="handleCurrencySelectDialog('to')"
            >
              <img v-if="state.to.icon" :src="state.to.icon" />
              <span>
                {{ B.disPlayCurrency }}
              </span>
            </div>
            <div class="liquidity-content-core-item-title">
              <span v-if="B.disPlayBalance">
                {{ $t("余额") }}: {{ B.disPlayBalance }}
              </span>
              <span
                class="liquidity-content-core-item-main-max"
                v-if="state.walletStatus === 'connected' && state.to.currency"
                @click="setToInputValueMax('to', B.disPlayBalance)"
              >
                MAX
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Fly-space :size="20"></Fly-space>
    <div class="liquidity-content-core-card" v-if="pollDetailData">
      <p>{{ $t("价格与资金池份额") }}</p>
      <Fly-space :size="15"></Fly-space>
      <div class="liquidity-content-core-card-detail">
        <div
          v-for="(d, i) in pollDetailData"
          :key="i"
          class="liquidity-content-core-card-detail-item"
        >
          <span v-if="i === 0">{{
            utilsNumber.formatNumberMeta(utilsNumber.bigNum(d.data), {
              precision: state.from.displayPrecision,
              trailingZero: false,
              round: "floor",
            }).text
          }}</span>
          <span v-if="i === 1">{{
            utilsNumber.formatNumberMeta(utilsNumber.bigNum(d.data), {
              precision: state.to.displayPrecision,
              trailingZero: false,
              round: "floor",
            }).text
          }}</span>
          <span v-if="i === 2">{{ d.data }}</span>
          <span>{{ d.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive, onUnmounted, onMounted, watch } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import { useStore } from "vuex";
import FlyInput from "@FlyUI/FlyInput";
import utilsNumber from "@utils/number";
import Wallet from "../../wallet/index";

const store = useStore();

let state = reactive({
  from: computed(() => store.state.StoreLiquidity.from),
  to: computed(() => store.state.StoreLiquidity.to),
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  balances: computed(() => store.state.StoreWallet.balances),
  focusType: null,
  tokensXY: computed(() => store.state.StoreLiquidity.tokensXY),
  addTimer: null,
});

const pollDetailData = computed(
  () => store.getters["StoreLiquidity/pollDetailData"]
);
const formatFrom = computed(() => store.getters["StoreLiquidity/formatFrom"]);
const formatTo = computed(() => store.getters["StoreLiquidity/formatTo"]);

const setToInputValueMax = (type, value) => {
  if (value && utilsNumber.bigNum(value).gt(0)) {
    store.commit("StoreLiquidity/CHANGE_INPUTVALUE", {
      value: value,
      type,
      automatic: false,
    });
  }
};

const handleCurrencySelectDialog = (type) => {
  store.commit("StoreLiquidity/HANDLE_CURRENCY_SELECT_VISIBLE", {
    isShow: true,
    type,
  });
};

const inputEvent = (val, type) => {
  // 币种选择时候也要去检查是否可以获取计算数据
  store.commit("StoreLiquidity/CHANGE_INPUTVALUE", { value: val, type });
  if (state.tokensXY) {
    if (
      state.to.currency &&
      state.from.currency &&
      utilsNumber.bigNum(val).gt(0)
    ) {
      state.focusType = type;
    }
  }
};

// delete或add去循环请求最新的XY
onMounted(() => {
  store.dispatch("StoreLiquidity/getLiquidityXYThrottle");
  state.addTimer = setInterval(() => {
    store.dispatch("StoreLiquidity/getLiquidityXYThrottle");
  }, 5000);
});

onUnmounted(() => {
  if (state.addTimer) {
    clearInterval(state.addTimer);
  }
  store.commit("StoreLiquidity/CLEAR_ADD_INFO");
});

watch(
  () => state.walletStatus,
  (n) => {
    if (n === "connected") {
      if (state.from.currency) {
        getBalance("from", state.from.token);
      }
      if (state.to.currency) {
        getBalance("to", state.to.token);
      }
    }
  }
);

const getBalance = async (type, token) => {
  let wallet = reactive({
    accounts: computed(() => store.state.StoreWallet.accounts),
    provider: computed(() => store.state.StoreWallet.stcProvider),
  });

  const balance = await Wallet.getAccountBalance({
    account: wallet.accounts[0],
    provider: wallet.provider,
    token,
  });

  store.commit("StoreWallet/SET_WALLET_BALANCE", {
    [state[type].currency]: balance,
  });
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/mixin.scss";

.change-content {
  text-align: center;
  height: 9px;
  svg {
    width: 9px;
    cursor: default;
  }
}
.liquidity-content-core-card {
  p {
    margin-left: 20px;
    font-weight: 600;
    color: $text-white-color;
  }
  .liquidity-content-core-card-detail {
    display: flex;
    justify-content: space-between;
    .liquidity-content-core-card-detail-item {
      font-size: 14px;
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      align-items: center;
      justify-content: center;
      // background-color: $btn-gray2-bgcolor;
      padding: 8px 12px;
      box-sizing: border-box;
      width: 125px;
      font-weight: 400;
      color: $text-white-color;
      span:last-child {
        margin-top: 5px;
      }
    }
  }
}
.liquidity-content-core-box {
  background: #464646;
  border-radius: 8px;
}
.liquidity-content-core-item {
  border-radius: 16px;
  height: 90px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-radius: 19px;
  // border: 1px solid #ededed;
  .liquidity-content-core-item-title {
    display: flex;
    justify-content: flex-end;
    font-size: 12px;
    font-weight: bold;
    color: $text-white-color;
    white-space: nowrap;
    margin-top: 8px;
  }
  .liquidity-content-core-item-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    .liquidity-content-core-item-main-input {
      ::v-deep(.el-input__inner) {
        // border-color: #fff;
        border: none;
        background: none;
        color: $text-white-color;
        font-size: 24px;
      }
      width: 230px;
    }
    .liquidity-content-core-item-main-max {
      color: $text-orange-color2;
      font-size: 12px;
      margin-left: 6px;
      cursor: pointer;
    }
    .liquidity-content-core-item-main-currencyselect {
      margin-left: auto;
      display: flex;
      align-items: center;
      padding: 4px;
      background: #585858;
      border-radius: 8px;
      width: 120px;
      color: $text-white-color;
      &:hover {
        opacity: 0.6;
        cursor: pointer;
      }
      img {
        border-radius: 50%;
        width: 24px;
        height: 24px;
      }
      span {
        text-align: center;
        font-size: 20px;
        display: inline-block;
        padding-left: 3px;
        min-width: 80px;
        max-width: 140px;
        font-weight: bold;
        @include textOverflow();
      }
    }
  }
}
</style>
