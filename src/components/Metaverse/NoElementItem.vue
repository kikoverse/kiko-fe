<template>
  <div
    :class="$style.box"
    @click="
      store.commit('StoreMeta/SET_SELECTOR_DIALOG_PARAMS', {
        dialogVisible: true,
      })
    "
  >
    <svg-icon name="f-clothes" :class="$style['svg']"></svg-icon>
    <p>{{ $t("metaverse.obtain components") }}</p>
  </div>
</template>
<script setup>
import SvgIcon from "@components/SvgIcon/Index.vue";
import { useStore } from "vuex";
const store = useStore();
</script>
<style lang="scss" module>
.box {
  min-width: 100px;
  min-height: 100px;
  // background: rgba(216, 216, 216, 0.11);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.98;
  border: 1px dashed rgba(255, 255, 255, 0.52);
  flex-direction: column;
  .svg {
    width: 18px;
    height: 18px;
  }
  p {
    font-size: 14px;
    color: $theme-light-color;
    cursor: pointer;
  }
}
</style>
