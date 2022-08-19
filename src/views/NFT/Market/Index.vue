<template>
  <div class="market-container">
    <FlySpecialBg></FlySpecialBg>
    <fly-nft
      class="blind-box-container"
      v-if="state.walletStatus === 'connected'"
    >
      <template #nft-header>
        <nft-selector @filterEvent="changeListQuery"></nft-selector>
        <div class="blind-box-list">
          <fly-scroll
            :hasMore="state.listStatus.hasMore"
            :isLoading="state.listStatus.isLoading"
            @loadMore="loadMore"
            :textLoading="false"
            :imgLoading="true"
            :isShowMore="false"
            v-if="
              state.marketList &&
              state.marketList.length > 0 &&
              !state.firstLoading
            "
          >
            <template #content>
              <div class="blind-box-list-content">
                <nft-card-item
                  v-for="(blind, i) in state.marketList"
                  :key="i"
                  class="list-blind-box-item"
                  cardType="market"
                  sellType="sell"
                  :hasBtn="false"
                  :baseData="blind"
                  @watchDetail="watchDetail(blind)"
                ></nft-card-item>
              </div>
            </template>
          </fly-scroll>
          <fly-loading-fish v-if="state.firstLoading"></fly-loading-fish>
          <empty
            v-if="
              !state.firstLoading &&
              ((state.marketList && state.marketList.length === 0) ||
                !state.marketList)
            "
          >
            <template #content>
              <p style="color: #8b8b8b">
                {{ $t("市场无数据文案") }}
              </p>
            </template>
          </empty>
        </div>
      </template>
    </fly-nft>
    <fly-nft
      class="blind-box-container"
      v-if="state.walletStatus !== 'connected'"
    >
      <template #nft-no-data>
        <nft-no-connected-wallet class="no-data"></nft-no-connected-wallet>
      </template>
    </fly-nft>
  </div>
</template>
<script setup>
import FlyNft from "@FlyUI/FlyNFT.vue";
import { reactive, computed, onUnmounted } from "vue";
import NftNoConnectedWallet from "@components/NFT/NFTNoConnectedWallet.vue";
import NftSelector from "@components/NFT/NFTSelector.vue";
// import ListBlindBoxItem from "@components/NFT/ListBlindBoxItem.vue";
import FlyScroll from "@FlyUI/FlyScroll.vue";
import Empty from "@components/NFT/Empty.vue";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import NftCardItem from "@components/NFT/NFTCardItem.vue";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
import { useStore } from "vuex";
const store = useStore();
let state = reactive({
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  marketList: computed(() => store.state.StoreNftMarket.marketList),
  firstLoading: computed(() => store.state.StoreNftMarket.firstLoading),
  listStatus: computed(() => store.state.StoreNftMarket.listStatus),
});

onUnmounted(() => {
  store.commit("StoreNftMarket/CLEAR_DATA");
});

// 查看卡片详情
const watchDetail = (detail) => {
  const url = `${window.location.origin}/nftmarketdetail?id=${detail.nftBoxId}&groupId=${detail.groupId}&type=${detail.type}&chainId=${detail.chainId}`;
  window.open(url, "_blank");
};

const changeListQuery = (params) => {
  store.dispatch(
    "StoreNftMarket/changeListQuery",
    Object.assign({}, params, { type: "init" })
  );
};
// 加载数据
const loadMore = () => {
  store.dispatch("StoreNftMarket/queryMarketList", { type: "scroll" });
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
