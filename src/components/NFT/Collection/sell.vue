<template>
  <fly-loading-fish
    v-if="state.onSellIsLoading"
    class="loading"
  ></fly-loading-fish>
  <template
    v-if="!state.onSellIsLoading && selling_data && selling_data.length > 0"
  >
    <nft-card-item
      v-for="d in selling_data"
      :key="d.id"
      cardType="collection"
      sellType="selling"
      :baseData="d"
      @actionsCall="actionsCall"
      :price="d.sellPrice"
      @watchDetail="() => emits('watchDetail', d, 'selling')"
    >
    </nft-card-item>
  </template>
  <empty
    v-if="
      !state.onSellIsLoading &&
      (!selling_data || (selling_data && selling_data.length === 0))
    "
  >
    <template #content>
      <p style="color: #8b8b8b">
        {{ $t("我的NFT收藏出售中无数据文案") }}
      </p>
      <p class="link" @click="() => emits('pushMarket')">
        {{ $t("去市场转转吧") }}
      </p>
    </template>
  </empty>
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
  onSellIsLoading: computed(() => store.state.StoreCollection.onSellIsLoading),
});
const selling_data = computed(
  () => store.getters["StoreCollection/selling_data"]
);
const emits = defineEmits(["pushMarket", "watchDetail", "actionsCall"]);

const actionsCall = (e) => {
  emits("actionsCall", e);
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
