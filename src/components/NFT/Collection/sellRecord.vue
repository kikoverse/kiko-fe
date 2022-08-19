<template>
  <fly-loading-fish v-if="state.isLoading" class="loading"></fly-loading-fish>
  <record
    :data="state.sellRecordData"
    type="sell"
    :disabled="[state.sellQuery.pageNum === 1, state.sellQuery.hasNext]"
    @pageEvent="($event) => handlePageChange($event, 'sell')"
    v-if="
      !state.isLoading &&
      state.sellRecordData &&
      state.sellRecordData.length > 0
    "
  ></record>
  <empty
    v-if="
      !state.isLoading &&
      (!state.sellRecordData || state.sellRecordData.length === 0)
    "
  >
    <template #content>
      <p style="color: #8b8b8b">
        {{ $t("NFT出售记录无文案") }}
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
  sellRecordData: computed(() => store.state.StoreCollection.sellRecordData),
  isLoading: computed(() => store.state.StoreCollection.isLoading),
  UserAddress: computed(() => store.state.StoreWallet.accounts),
  sellQuery: computed(() => store.state.StoreCollection.sellQuery),
});

const emits = defineEmits(["pushMarket", "watchDetail"]);

const handlePageChange = (direction) => {
  store.dispatch("StoreCollection/getSalesHistory", {
    address: state.UserAddress[0],
    direction,
    type: "click",
  });
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
