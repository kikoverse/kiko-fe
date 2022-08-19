<template>
  <fly-setting-dialog
    :dialogVisible="state.isShowSettings"
    @handleClose="() => store.commit('StoreApp/CHANGE_SETTING_VISIBLE', false)"
  ></fly-setting-dialog>
  <fly-net-dialog :visible="state.showWalletNetDialog"></fly-net-dialog>
  <router-view></router-view>
</template>
<script setup>
import { computed, onMounted, reactive, watch } from "vue";
import CONSTANTS_STARMASK from "@constants/starmask.js";
import FlySettingDialog from "@FlyUI/FlySettingDialog.vue";
import FlyNetDialog from "@FlyUI/FlyNetDialog.vue";
import { useStore } from "vuex";
const store = useStore();

const state = reactive({
  isShowSettings: computed(() => store.state.StoreApp.isShowSettings),
  showWalletNetDialog: false,
  netChainId: computed(() => store.state.StoreWallet.netChainId),
});

onMounted(() => {
  if (
    state.netChainId &&
    state.netChainId !== CONSTANTS_STARMASK.MAIN_CHIA_ID
  ) {
    state.showWalletNetDialog = true;
  }
});

watch(
  () => state.netChainId,
  (n) => {
    if (n === CONSTANTS_STARMASK.MAIN_CHIA_ID) {
      state.showWalletNetDialog = false;
    }
    if (n !== CONSTANTS_STARMASK.MAIN_CHIA_ID) {
      state.showWalletNetDialog = true;
    }
  }
);
</script>
<style lang="scss" module></style>
