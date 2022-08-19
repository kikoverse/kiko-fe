<template>
  <div :style="sizeStyle" />
</template>

<script setup>
import { computed, defineProps } from "vue";
const props = defineProps({
  horizontal: {
    type: Boolean,
    default: false,
  },
  size: {
    type: [Number, String],
    default: 10,
  },
});
const sizeStyle = computed(() => {
  const size = props.size;
  if (props.horizontal) {
    return `display:inline-block; width: ${size}PX;`;
  }
  return `height: ${size}PX;`;
});
</script>

<style lang="scss" scoped></style>
