<template>
  <svg aria-hidden="true" class="svg-icon" v-bind="$attrs">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup>
import { computed, defineProps } from "vue";
const req = require.context("../../icons", true, /\.svg$/);
const map = {};
for (const key of req.keys()) {
  map[key] = req(key);
}
const props = defineProps({
  name: {
    type: String,
    require: true,
  },
});

const iconName = computed(() => {
  return `#icon-${props.name}`;
});
</script>

<style scoped lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  cursor: pointer;
  .rect {
    fill: rectColor;
  }
}
</style>
