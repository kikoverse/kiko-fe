<template>
  <fly-loading-fish v-if="state.isLoading" class="loading"></fly-loading-fish>
  <empty
    v-if="
      !state.isLoading &&
      state.collectionList &&
      state.collectionList.length === 0
    "
  >
    <template #content>
      <p style="color: #8b8b8b">
        {{ $t("暂无我的系列") }}
      </p>
      <p class="link" @click="pushMarket">
        {{ $t("去创建一个系列吧") }}
      </p>
    </template>
  </empty>
  <template
    v-if="
      !state.isLoading &&
      state.collectionList &&
      state.collectionList.length > 0
    "
    class="collection-list"
  >
    <nft-card-item
      v-for="d in state.collectionList"
      :key="d.id"
      class="blind-list-unsold-item"
      :baseData="d"
      @click="openURL(d.id)"
    >
    </nft-card-item>
  </template>
</template>

<script setup>
import Empty from "@components/NFT/Empty.vue";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import NftCardItem from "@components/NFT/NFTCollectionItem.vue";
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getSeries } from "../../../api/createcollection";

const router = useRouter();
const store = useStore();
let state = reactive({
  isLoading: true,
  accounts: computed(() => store.state.StoreWallet.accounts),
  collectionList: [],
});
getSeries({ creatorAddress: store.state.StoreWallet.accounts[0] }).then(
  (res) => {
    state.isLoading = false;
    console.log(res);
    if (res.code == 200) {
      state.collectionList = res.data;
    }
  }
);
const openURL = (groupId) => {
  router.push({
    path: "/myCollectionDetail",
    query: { groupId },
  });
};
const pushMarket = () => {
  router.push({
    path: "/createCollection",
  });
};
</script>

<style scoped lang="scss">
@import "./style.scss";
.blind-list-unsold-item {
  margin-right: 28px;
  &:nth-child(3n) {
    margin-right: 0;
  }
}
.container {
  display: flex;
}
</style>
