<template>
  <div
    class="infinite-list-wrapper"
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="disabled"
    style="overflow: auto"
    :style="{ height: props.height || 'auto' }"
  >
    <slot name="list"></slot>
    <div v-if="data.is_loading">
      <fly-space :size="20"></fly-space>
      <p class="text">{{ $t("加载中") }}...</p>
    </div>
    <div v-if="data.noMore">
      <fly-space :size="20"></fly-space>
      <p class="text">{{ $t("没有数据了") }}</p>
    </div>
  </div>
</template>

<script setup>
// 这个组件就别用了，实在改不动了
import { computed, defineProps, defineEmits, reactive, watch } from "vue";
import FlySpace from "@FlyUI/FlySpace.vue";
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  noMore: {
    type: Boolean,
    default: false,
  },
  height: String,
});
const data = reactive({
  is_loading: props.loading,
  noMore: props.noMore,
  // is_loading: false,
});

watch(
  () => props.loading,
  (n, o) => {
    if (n !== o) {
      data.is_loading = n;
    }
  }
);
watch(
  () => props.noMore,
  (n, o) => {
    if (n !== o) {
      data.noMore = n;
    }
  }
);

const disabled = computed(() => {
  return props.loading || props.noMore;
});
const emits = defineEmits(["loadMore"]);
const loadMore = () => {
  emits("loadMore");
};
</script>

<style>
.infinite-list-wrapper {
  /* height: 100px; */
  /* border: 1px solid red; */
}
</style>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.text {
  text-align: center;
  font-size: 14px;
  color: $text-gray4-color;
}
</style>
