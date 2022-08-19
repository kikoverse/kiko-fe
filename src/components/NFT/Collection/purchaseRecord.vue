<template>
  <fly-loading-fish v-if="state.isLoading" class="loading"></fly-loading-fish>
  <template
    v-if="
      !state.isLoading && state.purchaseData && state.purchaseData.length > 0
    "
  >
    <record
      :data="state.purchaseData"
      @pageEvent="($event) => handlePageChange($event, 'purchase')"
      :disabled="[
        state.purchaseQuery.pageNum === 1,
        state.purchaseQuery.hasNext,
      ]"
      type="purchase"
      v-if="state.purchaseData && state.purchaseData.length > 0"
    ></record>
  </template>
  <empty
    v-if="
      (!state.purchaseData || state.purchaseData.length === 0) &&
      !state.isLoading
    "
  >
    <template #content>
      <p style="color: #8b8b8b">
        {{ $t("还没有购买任何NFT") }}
      </p>
      <p class="link" @click="() => emits('pushMarket')">
        {{ $t("去市场转转吧") }}
      </p>
    </template>
  </empty>
</template>
<script setup>
import Empty from "@components/NFT/Empty.vue";
import Record from "@components/NFT/Record.vue";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import { computed, defineEmits, reactive } from "vue";
import { useStore } from "vuex";
const store = useStore();
let state = reactive({
  purchaseData: computed(() => store.state.StoreCollection.purchaseData),
  isLoading: computed(() => store.state.StoreCollection.isLoading),
  purchaseQuery: computed(() => store.state.StoreCollection.purchaseQuery),
  UserAddress: computed(() => store.state.StoreWallet.accounts),
});

const emits = defineEmits(["pushMarket", "watchDetail"]);

const handlePageChange = (direction) => {
  store.dispatch("StoreCollection/getPurchaseHistory", {
    address: state.UserAddress[0],
    direction,
    type: "click",
  });
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
