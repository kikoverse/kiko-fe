<template>
  <fly-loading-fish v-if="state.loading"></fly-loading-fish>
  <div v-else>
    <empty v-if="state.collectionList && state.collectionList.length === 0">
      <template #content>
        <p style="color: #8b8b8b">
          {{ $t("系列里暂无nft") }}
        </p>
        <p class="link" @click="() => emits('pushMarket')" v-if="showBtn">
          {{ $t("去创建一个nft吧") }}
        </p>
      </template>
    </empty>
    <div class="container">
      <el-menu
        v-if="state.attbuteArrs && state.attbuteArrs.length > 0"
        default-active="2"
        background-color="transparent"
        active-text-color="#fff"
        text-color="#8c8b8c"
        @select="select"
      >
        <el-sub-menu
          :index="item.key"
          v-for="(item, index) in state.attbuteArrs"
          :key="index"
        >
          <template #title>
            <div class="title">
              {{ item.key }}
            </div>
          </template>
          <el-menu-item
            v-for="(value, index) in item.values"
            :index="value"
            :key="index"
            >{{ value }}</el-menu-item
          >
        </el-sub-menu>
      </el-menu>
      <div class="el-menu-vertical" v-else></div>
      <div
        v-if="state.collectionList && state.collectionList.length > 0"
        class="collection-list"
      >
        <nft-card-item
          v-for="d in state.collectionList"
          :key="d.id"
          cardType="collection"
          :sellType="d.sellType"
          class="blind-list-unsold-item"
          :hasBtn="false"
          :baseData="d"
          @watchDetail="watchDetail"
        >
        </nft-card-item>
      </div>
    </div>
  </div>
</template>

<script setup>
import Empty from "@components/NFT/Empty.vue";
import { ElMenu, ElMenuItem, ElSubMenu } from "element-plus";
// import ListBlindBoxItem from "@components/NFT/ListBlindBoxItem.vue";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import NftCardItem from "@components/NFT/NFTCardItem.vue";
import { computed, reactive } from "vue";
import { getNFTMeta, getSeriesNft } from "../../../api/createcollection";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const emits = defineEmits(["pushMarket"]);
const router = useRouter();
const store = useStore();
const props = defineProps({
  groupId: {
    type: Number,
    default: 0,
  },
  info: {
    type: Object,
    default: () => {},
  },
  showBtn: {
    type: Boolean,
  },
});
const state = reactive({
  accounts: computed(() => store.state.StoreWallet.accounts),
  collectionList: [],
  loading: true,
  attbuteArrs: [],
});
const init = ([attribute, attributeValue] = ["", ""]) => {
  getSeriesNft({ groupId: props.groupId, attribute, attributeValue }).then(
    (res) => {
      state.loading = false;
      if (res.code == 200) {
        state.collectionList = res.data;
      }
    }
  );
};
init();
getNFTMeta({ groupId: props.groupId }).then((res) => {
  if (res.code == 200) {
    state.attbuteArrs = res.data;
  }
});
const select = (key, keyPath) => {
  console.log(key, keyPath);
  init(keyPath);
};
const watchDetail = (data) => {
  let query = {
    isOwner: props.info.owner == data.owner && data.owner == state.accounts[0],
  };
  if (data.sellStatus === 1) {
    query = {
      ...query,
      sellType: "selling",
      infoId: data.id,
    };
  } else {
    query = {
      ...query,
      sellType: "unsold",
      nftId: data.nftId,
      nftMeta: props.info.nftMeta,
      nftBody: props.info.nftBody,
    };
  }
  router.push({
    path: "/nftcollectiondetail",
    query,
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
.title {
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-menu-vertical {
  width: 160px;
}
.collection-list {
  margin-left: 40px;
  display: flex;
  flex-wrap: wrap;
}
</style>
