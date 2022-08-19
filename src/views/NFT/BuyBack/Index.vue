<template>
  <div class="recovery-container">
    <FlySpecialBg></FlySpecialBg>
    <fly-nft
      class="blind-box-container"
      v-if="state.walletStatus === 'connected'"
    >
      <template #nft-header v-if="state.coreType !== 'card'">
        <nft-selector @filterEvent="changeListQuery"></nft-selector>
        <div class="blind-box-list">
          <fly-scroll
            :hasMore="state.listStatus.hasMore"
            :isLoading="state.listStatus.isLoading"
            @loadMore="loadMore"
            :isShowMore="false"
            :textLoading="false"
            :imgLoading="true"
            v-if="state.buyBackList && state.buyBackList.length > 0"
          >
            <template #content>
              <div class="blind-box-list-content">
                <nft-card-item
                  v-for="(blind, i) in state.buyBackList"
                  :key="i"
                  class="list-blind-box-item"
                  cardType="buyback"
                  sellType=""
                  :baseData="blind"
                  @watchDetail="watchDetail(blind)"
                >
                </nft-card-item>
              </div>
            </template>
          </fly-scroll>
          <fly-loading-fish v-if="state.firstLoading"></fly-loading-fish>
          <empty
            v-if="
              !state.firstLoading &&
              ((state.buyBackList && state.buyBackList.length === 0) ||
                !state.buyBackList)
            "
          >
            <template #content>
              <p style="color: #8b8b8b">
                {{ $t("回购无数据文案") }}
              </p>
            </template>
          </empty>
        </div>
      </template>
    </fly-nft>

    <fly-nft class="blind-box-container" :coreType="state.coreType" v-else>
      <template #nft-no-data>
        <nft-no-connected-wallet class="no-data"></nft-no-connected-wallet>
      </template>
    </fly-nft>
  </div>
</template>
<script setup>
import { reactive, computed, onUnmounted } from "vue";
import FlyNft from "@FlyUI/FlyNFT.vue";
import NftNoConnectedWallet from "@components/NFT/NFTNoConnectedWallet.vue";
// import ListBlindBoxItem from "@components/NFT/ListBlindBoxItem.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Empty from "@components/NFT/Empty.vue";
import FlyScroll from "@FlyUI/FlyScroll.vue";
import NftSelector from "@components/NFT/NFTSelector.vue";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import NftCardItem from "@components/NFT/NFTCardItem.vue";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
const router = useRouter();
const store = useStore();
let state = reactive({
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  buyBackList: computed(() => store.state.StoreBuyBack.buyBackList),
  listStatus: computed(() => store.state.StoreBuyBack.listStatus),
  firstLoading: computed(() => store.state.StoreBuyBack.firstLoading),
});

onUnmounted(() => {
  store.commit("StoreBuyBack/CLEAR_PARAMS_DATA");
});

const changeListQuery = (params) => {
  store.dispatch(
    "StoreBuyBack/changeListQuery",
    Object.assign({}, params, { type: "init" })
  );
};

// 查看卡片详情
const watchDetail = (detail) => {
  router.push({
    path: "/nftbuybackdetail",
    query: {
      type: "back",
      id: detail.id,
      groupId: detail.groupId,
      token: detail.fullCurrency,
    },
  });
};

const loadMore = () => {
  store.dispatch("StoreBuyBack/getBuyBacklist", { type: "scroll" });
};
</script>

<style lang="scss" scoped>
.blind-box-container {
  margin: 0 auto;
  padding-bottom: 30px;
  .blind-box-list {
    margin-top: 30px;
    .blind-box-list-content {
      display: flex;
      flex-wrap: wrap;
      padding-top: 20px;
      .list-blind-box-item {
        margin-right: 28px;
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
