<template>
  <div :class="$style['start-pagination']">
    <div
      @click="pagiEvent('prev')"
      :class="[
        $style['start-pagination-prev'],
        { [$style['disabled']]: props.disabled[0] },
      ]"
    >
      {{ $t("上一页") }}
    </div>
    <div
      @click="pagiEvent('next')"
      :class="[
        $style['start-pagination-next'],
        { [$style['disabled']]: props.disabled[1] === false },
      ]"
    >
      {{ $t("下一页") }}
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, defineProps, defineEmits } from "vue";

const props = defineProps({
  disabled: {
    type: Array,
    default: () => [false, false],
  },
});
const emits = defineEmits(["pageEvent"]);

const pagiEvent = (type) => emits("pageEvent", type);
</script>
<style lang="scss" module>
.start-pagination {
  display: flex;
  color: $text-brown-color;
  justify-content: center;
  .start-pagination-prev,
  .start-pagination-next {
    border: 0.5px solid $border-gray-color;
    padding: 5px 0px;
    width: 70px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
    border-radius: 5px;
    &.disabled {
      color: $text-gray4-color;
    }
    &:hover {
      opacity: 0.6;
      transition: opacity ease-in-out 0.2s;
    }
  }
  .start-pagination-next {
    margin-left: 10px;
  }
}
</style>
