<template>
  <div class="empty-c">
    <SvgIcon name="f-no-data"></SvgIcon>
    <slot name="content" class="text"></slot>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, defineProps, defineEmits } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
</script>
<style lang="scss" scoped>
.empty-c {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  svg {
    display: inline-block;
    margin-bottom: 30px;
    width: 90px;
    height: 90px;
  }
}
</style>
