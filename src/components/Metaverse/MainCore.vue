<template>
  <fly-loading-fish v-if="state.loadingStatus"></fly-loading-fish>
  <div :class="$style.wrap" v-else>
    <nft-selector @filterEvent="changeQuery"></nft-selector>
    <role></role>
    <div :class="$style.main">
      <template v-if="state.type === 'not-generated'">
        <element-proto-panel></element-proto-panel>
        <element-show-panel></element-show-panel>
        <element-compose-panel></element-compose-panel>
      </template>
      <template v-if="state.type === 'generated'">
        <user-hero-card></user-hero-card>
        <hero-info></hero-info>
      </template>
    </div>
  </div>
  <selector-modal></selector-modal>
  <wallet-operate-modal></wallet-operate-modal>
  <nft-create-modal></nft-create-modal>
</template>
<script setup>
/* eslint-disable*/
import { computed, onUnmounted, reactive, watchEffect } from "vue";
import Role from "@components/Metaverse/Role.vue";
import ElementProtoPanel from "./ElementProtoPanel.vue";
import ElementShowPanel from "./ElementShowPanel.vue";
import ElementComposePanel from "./ElementComposePanel.vue";
import SelectorModal from "@components/Metaverse/SelectorModal.vue";
import WalletOperateModal from "./WalletOperateModal.vue";
import NftCreateModal from "./NftCreateModal.vue";
import HeroInfo from "@components/Metaverse/HeroInfo.vue";
import UserHeroCard from "@components/Metaverse/UserHeroCard.vue";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import NftSelector from "./NftSelector.vue";
import { useStore } from "vuex";
const store = useStore();

const state = reactive({
  type: computed(() => store.state.StoreMeta.type),
  accounts: computed(() => store.state.StoreWallet.accounts),
  loadingStatus: computed(() => store.state.StoreMeta.loadingStatus),
  series: "",
});

store.dispatch("StoreMeta/getNFTMeatInfo");

watchEffect(() => {
  if (state.accounts && state.accounts[0] && state.series) {
    store.dispatch("StoreMeta/getNFTDataByType", {
      userAddress: state.accounts[0],
      nftType: "split",
      series: state.series,
    });
  }
  if (state.accounts && state.accounts[0] && state.series) {
    store.dispatch("StoreMeta/getNFTDataByType", {
      userAddress: state.accounts[0],
      nftType: "element",
      series: state.series,
    });
  }
});

const changeQuery = (val) => {
  state.series = val.series;
  store.commit("StoreMeta/SET_MODULE_NAME", val.moduleName);
};
onUnmounted(() => {
  store.commit("StoreMeta/CLEAR_DATA");
});
</script>
<style lang="scss" module>
.wrap {
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
  margin-top: 20px;
  min-height: 800px;
  height: 800px;
  .main {
    display: flex;
    margin-top: 30px;
    padding-bottom: 30px;
  }
}
</style>
