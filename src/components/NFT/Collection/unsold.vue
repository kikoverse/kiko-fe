<template>
  <fly-loading-fish v-if="state.isLoading" class="loading"></fly-loading-fish>
  <empty v-if="!state.isLoading && unsold_data && unsold_data.length === 0">
    <template #content>
      <p style="color: #8b8b8b">
        {{ $t("我的NFT未出售无数据文案") }}
      </p>
      <p class="link" @click="() => emits('pushMarket')">
        {{ $t("去市场转转吧") }}
      </p>
    </template>
  </empty>
  <template v-if="!state.isLoading && unsold_data && unsold_data.length > 0">
    <nft-card-item
      v-for="d in unsold_data"
      :key="d.id"
      cardType="collection"
      :sellType="d.sellType"
      class="blind-list-unsold-item"
      :hasBtn="false"
      :baseData="d"
      @actionsCall="actionsCall"
      @watchDetail="() => emits('watchDetail', d, 'unsold', state.accounts[0])"
    >
    </nft-card-item>
  </template>
</template>

<script setup>
import Empty from "@components/NFT/Empty.vue";
// import ListBlindBoxItem from "@components/NFT/ListBlindBoxItem.vue";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import NftCardItem from "@components/NFT/NFTCardItem.vue";

import { computed, defineEmits, reactive } from "vue";
import { useStore } from "vuex";
const store = useStore();
let state = reactive({
  isLoading: computed(() => store.state.StoreCollection.isLoading),
  accounts: computed(() => store.state.StoreWallet.accounts),
});
const unsold_data = computed(
  () => store.getters["StoreCollection/unsold_data"]
);
const actionsCall = (e) => {
  emits("actionsCall", e);
};

const emits = defineEmits(["pushMarket", "watchDetail", "actionsCall"]);
</script>

<style scoped lang="scss">
@import "./style.scss";
.blind-list-unsold-item {
  margin-right: 28px;
  &:nth-child(4n) {
    margin-right: 0;
  }
}
</style>
