<template>
  <div :class="$style['fly-pagination']">
    <div
      @click="pagiEvent('prev')"
      :class="[
        $style['fly-pagination-prev'],
        { [$style['disabled']]: props.disabled[0] },
      ]"
    >
      {{ $t("上一页") }}
    </div>
    <div
      @click="pagiEvent('next')"
      :class="[
        $style['fly-pagination-next'],
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
.fly-pagination {
  display: flex;
  color: $text-brown-color;
  justify-content: center;
  .fly-pagination-prev,
  .fly-pagination-next {
    padding: 14px 32px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
    color: #8c8b8c;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.09);
    &.disabled {
      color: $text-gray4-color;
    }
    &:hover {
      opacity: 0.6;
      transition: opacity ease-in-out 0.2s;
    }
  }
  .fly-pagination-next {
    margin-left: 10px;
  }
}
</style>
