<template>
  <div :class="$style['my-power']" v-if="state.miningData">
    <div :class="$style['my-power-header']">
      <div :class="$style['my-power-item']">
        <p :class="$style['title']">{{ $t("nftmining.my-mining-power") }}</p>
        <p v-if="state.walletStatus !== 'connected'">- -</p>
        <fly-amount
          :class="$style['amount']"
          v-else
          :value="state.miningData.userScore"
          :formatOptions="{ precision: 2, trailingZero: true }"
        ></fly-amount>
      </div>
      <div :class="$style['my-power-item']">
        <p :class="$style['title']">{{ $t("收益") }}</p>
        <p v-if="state.walletStatus !== 'connected'">- -</p>
        <fly-amount
          :class="$style['amount']"
          v-else
          :value="state.miningData.currentReward"
          :formatOptions="{ precision: 2, trailingZero: true }"
          displaySuffix="STC"
        ></fly-amount>
      </div>
    </div>
    <div :class="$style['my-power-content']">
      <div :class="$style['year-profit']">
        <p :class="$style['title']">
          {{ $t("nftmining.my-mining-year-profit") }}
        </p>
        <p v-if="state.walletStatus !== 'connected'">- -</p>
        <fly-amount
          v-else
          :class="$style['amount']"
          :value="state.miningData.userApr"
          :formatOptions="{
            precision: 2,
            trailingZero: true,
            percentStyle: true,
          }"
        ></fly-amount>
      </div>
      <div :class="$style['my-power-button']">
        <div :class="$style['button']" ref="buttonDOM" @click="drawProfit">
          {{ state.walletStatus !== "connected" ? $t("链接钱包") : $t("收获") }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, watch, nextTick, ref } from "vue";
import FlyAmount from "@FlyUI/FlyAmount";
import { useStore } from "vuex";
import connectLogic from "@hooks/useMyWallet";
import btnBg from "../../../assets/nft/mining-nft-btn.png";
import btnHoverBg from "../../../assets/nft/mining-nft-btn-hover.png";
let buttonDOM = ref();
const store = useStore();
let state = reactive({
  buttonDOM: null,
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  miningData: computed(() => store.state.StoreNFTMining.miningData),
});

const { connectWallet } = connectLogic(store);

const drawProfit = () => {
  if (state.walletStatus !== "connected") {
    connectWallet();
    return;
  }
  store.dispatch("StoreNFTMining/canDrawReward");
};
</script>
<style lang="scss" module>
@import "~@/styles/_vars.scss";
.amount {
  font-size: 18px;
  font-weight: 600;
}
.my-power {
  width: 588px;
  height: 192px;
  float: right;
  color: #fba800;
  background: linear-gradient(
    70deg,
    rgba(195, 143, 39, 0.4) 0%,
    rgba(88, 52, 00, 0.4) 50%
  );
  border-radius: 8px;
  .title {
    font-weight: 600;
    font-size: 14px;
    color: rgba(251, 168, 0, 0.6);
  }

  .my-power-header {
    overflow: hidden;
    padding: 0px 32px;
    margin-top: 36px;
    .my-power-item {
      width: 50%;
      float: left;
      .amount {
        font-size: 18px;
        font-weight: normal;
        font-weight: 600;
      }
    }
  }
  .my-power-content {
    padding: 0px 32px;
    margin-top: 36px;
    overflow: hidden;
    .year-profit {
      width: 50%;
      float: left;
    }
    .my-power-button {
      width: 50%;
      float: left;
      height: 70px;
    }
    .button {
      width: 206px;
      height: 35px;
      background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
      box-shadow: 0px 12px 15px 0px rgba(253, 168, 0, 0.39);
      border-radius: 8px;
      font-weight: 600;
      color: #170f00;
      text-align: center;
      line-height: 35px;
      cursor: pointer;
    }
  }
}
</style>
