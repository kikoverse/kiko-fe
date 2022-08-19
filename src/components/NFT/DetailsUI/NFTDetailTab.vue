<template>
  <div class="nft-detail-tab">
    <div
      class="nft-detail-tab-item"
      v-for="(d, i) in props.cross_bar_array"
      :key="i"
      @click="selectCrossTab(d.id)"
    >
      <span
        :class="['name', props.selected_tab === d.id ? 'selected_tab' : '']"
        >{{ d.name }}</span
      >
      <span
        class="bottom-line"
        v-if="props.selected_tab === d.id && props.cross_bar_array.length > 1"
      ></span>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";

const emits = defineEmits(["selectCrossTab"]);
const props = defineProps({
  cross_bar_array: {
    type: Array,
  },
  selected_tab: {
    type: String,
  },
});

const selectCrossTab = (id) => {
  emits("selectCrossTab", id);
};
</script>
<style lang="scss" scoped>
.nft-detail-tab {
  display: flex;
  .nft-detail-tab-item {
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    margin-right: 32px;
    position: relative;
    cursor: pointer;
    .bottom-line {
      display: inline-block;
      width: 100%;
      height: 2px;
      background: #fff;
      position: absolute;
      bottom: -6px;
      left: 0%;
    }
    .selected_tab {
      color: #ffffff;
    }
  }
}
</style>
