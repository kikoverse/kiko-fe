<template>
  <div :class="$style['total-data-container']" v-if="state.miningData">
    <div :class="$style['header']">
      <div :class="$style['header-content']">
        <p :class="$style['title']">
          {{ $t("nftmining.total-mining-power") }}
        </p>
        <fly-amount
          :value="state.miningData.totalScore"
          :class="$style['amount']"
          :formatOptions="{
            precision: 2,
            trailingZero: false,
          }"
        ></fly-amount>
      </div>
      <div :class="$style['header-content']">
        <p :class="$style['title']">{{ $t("日产量") }}</p>
        <fly-amount
          :class="$style['amount']"
          :value="state.miningData.dailyTotalOutput"
          displaySuffix="STC"
          :formatOptions="{
            precision: 2,
            trailingZero: true,
          }"
        ></fly-amount>
      </div>
    </div>
    <div :class="$style['footer']">
      <div :class="$style['year-profit']">
        <p :class="$style[('title', 'year-profit-title')]">
          {{ $t("平均年化收益率") }}
        </p>

        <fly-amount
          :class="[$style['amount'], $style['amount-color']]"
          :value="state.miningData.avgApr"
          :formatOptions="{
            precision: 2,
            trailingZero: true,
            percentStyle: true,
          }"
        ></fly-amount>
      </div>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, watch } from "vue";
import FlyAmount from "@FlyUI/FlyAmount";
import { useStore } from "vuex";
const store = useStore();
let state = reactive({
  miningData: computed(() => store.state.StoreNFTMining.miningData),
});
</script>
<style lang="scss" module>
@import "~@/styles/_vars.scss";
.amount {
  font-size: 18px;
  font-weight: normal;
}
.amount-color {
  color: #fba800;
  font-size: 18px;
}
.total-data-container {
  width: 588px;
  height: 192px;
  color: $white;
  display: inline-block;
  background: linear-gradient(
    144deg,
    rgba(148, 148, 148, 0.4) 0%,
    rgba(82, 82, 82, 0.4) 100%
  );
  border-radius: 8px;
  .title {
    font-size: 14px;
    font-weight: 600;
    color: $white;
  }
  .year-profit-title {
    color: #fba800;
    font-weight: 600;
    font-size: 14px;
  }
  .header {
    margin-left: 32px;
    margin-top: 36px;
    overflow: hidden;
    .header-content {
      display: inline-block;
      width: 50%;
    }
  }
  .footer {
    margin-top: 36px;
    padding: 0px 36px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
