<template>
  <span :class="$style[className]">
    <slot></slot>
  </span>
</template>
<script setup>
/* eslint-disable */
import { computed, defineProps } from "vue";

const props = defineProps({
  direction: {
    type: String, // LONG  SHORT
    default: "",
  },
});

const className = computed(() => {
  if (props.direction === "LONG") {
    return "is-buy-up";
  }
  if (props.direction === "SHORT") {
    return "is-sell-down";
  }
  return "";
});
</script>
<style lang="scss" module>
.is-buy-up {
  color: $text-green-color !important;
}
.is-sell-down {
  color: $text-error-color;
}
</style>
