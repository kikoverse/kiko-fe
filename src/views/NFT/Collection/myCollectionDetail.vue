<template>
  <div class="">
    <FlySpecialBg></FlySpecialBg>
    <fly-nft
      class="blind-box-container"
      :coreType="state.coreType"
      v-if="state.walletStatus === 'connected'"
      :cardTypeParams="{ minHeight: '800px' }"
    >
      <template #nft-card>
        <div v-if="state.detail_info.id">
          <div class="headDetail">
            <div class="collection-image">
              <img :src="state.detail_info.seriesLogo" alt="" />
            </div>
            <div class="collection-desc">
              <h3>
                <span>{{ state.detail_info.seriesName }}</span>
                <FlyButton @click="goCreate" type="default" v-if="showBtn">{{
                  $t("创建NFT")
                }}</FlyButton>
              </h3>
              <div class="category">
                {{ $t(state.detail_info.contentType) }}
              </div>
              <div class="desc" :title="state.detail_info.enDescription">
                {{ state.detail_info.enDescription }}
              </div>
              <div class="url" v-if="state.detail_info.seriesUrl">
                {{ $t("相关连接") }}：<a :href="state.detail_info.seriesUrl">{{
                  state.detail_info.seriesUrl
                }}</a>
              </div>
            </div>
          </div>
          <fly-space :size="40"></fly-space>
          <CollectionDetail
            :groupId="groupId"
            @pushMarket="goCreate"
            :info="state.detail_info"
            :showBtn="showBtn"
          ></CollectionDetail>
        </div>
        <fly-loading-fish v-else></fly-loading-fish>
      </template>
    </fly-nft>
  </div>
</template>
<script setup>
/* eslint-disable */
import {
  reactive,
  computed,
  onMounted,
  ref,
  watchEffect,
  onUnmounted,
  watch,
} from "vue";
import FlyNft from "@FlyUI/FlyNFT.vue";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import { useRoute,useRouter } from "vue-router";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import CollectionDetail from "../../../components/NFT/Collection/collectionDetail.vue";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
import FlySpace from "@FlyUI/FlySpace.vue";

import { getOfferingBoxData } from "../../../api/nft/blindbox";
import FlyButton from "../../../FlyUI/FlyButton.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useStore();
const handleSoldOutCloseFunc = () => {
  window.location.reload();
};

const showBtn = computed(()=>{
  if(store.state.StoreWallet.walletStatus !== 'unConnected'){
    if(state.detail_info.owner == store.state.StoreWallet.accounts[0]){
      return true
    }
  }
  return false
})
const groupId = route.query.groupId;
let state = reactive({
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  detail_info: {},
  coreType: "card",
});
getOfferingBoxData(groupId).then((res) =>{
  if(res.code ===200){
    state.detail_info = res.data
  }
})
const handleSoldOutConfirmFunc = () => {
  window.location.reload();
};
const goCreate = ()=>{
  router.push({
    path:'/createNFT',
    query:{groupId}
  })
}

onMounted(() => {});

onUnmounted(() => {});
</script>
<style lang="scss" scoped>
.headDetail {
  display: flex;
  color: #fff;
  .collection-image {
    border: 5px solid #fff;
    width: 380px;
    height: 200px;
    border-radius: 10px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      border: 5px solid rgba(0, 0, 0, 0);
      box-sizing: border-box;
    }
  }
  .collection-desc {
    width: 800px;
    margin-left: 20px;
    h3 {
      font-size: 32px;
      display: flex;
      justify-content: space-between;
    }
    .category {
      background: rgba(251, 168, 0, 0.3);
      color: #fba800;
      border-radius: 4px;
      height: 23px;
      display: inline-block;
      line-height: 23px;
      padding: 0 10px;
      margin-top: 10px;
    }
    .desc {
      margin-top: 10px;
      display: -webkit-box;
      overflow: hidden;
      white-space: normal !important;
      text-overflow: ellipsis;
      word-wrap: break-word;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .url{
      margin-top: 10px;
      a{
        color: #fba800;
      }
    }
  }
}
</style>
