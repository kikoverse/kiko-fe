<template>
  <div :class="$style['game-container']">
    <full-screen></full-screen>
  </div>
</template>
<script setup>
import {} from "vue";
import FullScreen from "./FullScreen.vue";
import { useStore } from "vuex";

const store = useStore();

store.dispatch("StoreIGO/getIgoList");
</script>
<style lang="scss" module>
// ::-webkit-scrollbar {
//   width: 3px;
//   height: 3px;
// }
// ::-webkit-scrollbar-track {
//   border-radius: 10px;
//   box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
// }
// ::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
//   background: rgba(0, 0, 0, 0.7);
// }
.game-container {
  width: 100%;
}
</style>
