<template>
  <fly-trade :direction="directionComputed">
    <span :class="$style['fly-amount']">
      <span>
        <span v-if="props.displayPreFix && formatValue">
          {{ props.displayPreFix }}
        </span>
        {{ formatValue }}
        <span v-if="props.currency">
          {{ props.currency }}
        </span>
        <span v-if="props.displaySuffix">
          {{ props.displaySuffix }}
        </span>
      </span>
    </span>
  </fly-trade>
</template>
<script setup>
import { computed, useAttrs } from "vue";
import utilsNumber from "@utils/number";
import FlyTrade from "@FlyUI/FlyTrade.vue";
const attrs = useAttrs();
const props = defineProps({
  value: {
    type: [Number, String],
    default: 0,
  },
  currency: {
    type: String,
    default: "",
  },
  formatOptions: {
    type: Object,
    default() {
      return {
        precision: undefined,
        grouped: true,
        percentStyle: false,
        round: "round",
        showSign: false,
        compact: false,
        trailingZero: true,
        // precision: {
        //   type: [Number, String],
        //   default: undefined,
        // },
        // grouped: {
        //   type: Boolean,
        //   default: true,
        // },
        // percentStyle: {
        //   type: Boolean, // 百分比显示
        //   default: false,
        // },
        // round: {
        //   type: String,
        //   default: "round", //round ceil floor
        // },
        // showSign: {
        //   type: Boolean, // + -显示
        //   default: false,
        // },
        // compact: {
        //   type: Boolean,
        //   default: false,
        // },
        // trailingZero: {
        //   type: Boolean,
        //   default: true,
        // },
      };
    },
  },
  // ----------
  // trade color
  isShowTradeColor: {
    type: Boolean,
    default: false,
  },
  // ----------
  // 数量前缀 ¥、$
  displayPreFix: {
    type: String,
    default: "",
  },
  // 后缀
  displaySuffix: {
    type: String,
    default: "",
  },
});

const formatValue = computed(() => {
  return utilsNumber.formatNumberMeta(props.value, props.formatOptions).text;
});

const directionComputed = computed(() => {
  if (attrs.isLong) {
    return "LONG";
  }
  if (attrs.isShort) {
    return "SHORT";
  }
  if (props.isShowTradeColor && props.value) {
    if (props.value > 0) {
      return "LONG";
    }
    if (props.value < 0) {
      return "SHORT";
    }
    return "";
  }
  return "";
});
</script>
<style lang="scss" module>
.fly-amount {
  display: inline-block;
}
</style>
