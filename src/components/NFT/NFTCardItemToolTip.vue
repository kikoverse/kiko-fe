<template>
  <div>
    <ElTooltip effect="light" placement="bottom" :append-to-body="false">
      <template #content>
        <span :class="props.contentClassName">
          {{ props.placeString }}
        </span>
      </template>
      <template #default>
        <svg-icon :name="props.svgName" :style="props.svgStyle">></svg-icon>
      </template>
    </ElTooltip>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, watch } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
const props = defineProps({
  svgName: {
    type: String,
  },
  placeString: {
    type: String,
  },
  contentClassName: {
    type: String,
  },
  svgStyle: {
    type: Object,
  },
});
</script>
<style lang="scss" class>
.nft-blind-text-name-rarity-tooltip {
  color: #391b0f;
}
</style>
