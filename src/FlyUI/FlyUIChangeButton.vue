<template>
  <div class="fly-exchange-button">
    <div
      v-for="(d, i) in props.tabs"
      class="fly-exchange-button-item"
      :key="i"
      :class="{ 'is-active': state.activeIndex === i }"
      @click="btnClick(d, i)"
    >
      {{ $t(d.label) }}
    </div>
  </div>
</template>

<script setup>
import { reactive, defineEmits, defineProps, watch } from "vue";
import { useRouter } from "vue-router";
const emits = defineEmits(["clickMethod"]);

const router = useRouter();

let props = defineProps({
  activeIndex: Number,
  tabs: {
    type: Array,
    default: () => [
      {
        label: "兑换",
        path: "/swap",
      },
      {
        label: "流动性",
        path: "/liquidity",
      },
    ],
  },
});
let state = reactive({
  activeIndex: props.activeIndex,
});

watch(
  () => props.activeIndex,
  () => {
    state.activeIndex = props.activeIndex;
  }
);

const btnClick = (d) => {
  // state.activeIndex = i;
  if (emits.clickMethod) {
    this.$emit("clickMethod", d);
  } else {
    router.push(d.path);
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/_vars.scss";
.fly-exchange-button {
  border-radius: 4px;
  display: inline-flex;
  width: 252px;
  height: 50px;
  .fly-exchange-button-item {
    -webkit-box-align: center;
    align-items: center;
    border: 0px;
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 16px;
    font-weight: 400;
    -webkit-box-pack: center;
    line-height: 1;
    opacity: 1;
    outline: 0px;
    margin: 0px 29px;
    height: 48px;
    margin-top: 1px;
    color: #8c8b8c;
    &.is-active {
      color: #fff;
      border-bottom: 2px solid #fff;
    }
  }
}
</style>
