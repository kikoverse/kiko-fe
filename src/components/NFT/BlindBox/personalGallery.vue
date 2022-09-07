<template>
  <div>
    <div class="nft-gallery-list">
      <div
        v-for="(d, i) in state.listData"
        :key="i"
        class="nft-gallery-list-item"
        @click="goDetail(d)"
      >
        <img :src="d.image" alt="" />
        <div class="nft-gallery-list-item-right">
          <p class="nft-gallery-list-item-right-title">
            {{ d.name }}
          </p>
          <fly-space :size="80"></fly-space>

          <p class="nft-gallery-address-info">
            <label for="">NFT Meta:</label>
            <span>{{ d.meta }}</span>
          </p>
          <p class="nft-gallery-address-info">
            <label for="">NFT Body:</label>
            <span>{{ d.body }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive, onUnmounted, watchEffect } from "vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import { useStore } from "vuex";
import { getGalleryList } from "../../../api/nft/blindbox";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useStore();

let state = reactive({
  listData: [],
  timers: null,
  accounts: computed(() => store.state.StoreWallet.accounts),
});
const goDetail = (d) => {
  router.push({
    name: "GalleryDetail",
    query: {
      body: d.body,
      meta: d.meta,
    },
  });
};
watchEffect(() => {
  if (state.accounts[0]) {
    getGalleryList(state.accounts[0]).then((res) => {
      if (res.code == 200) {
        state.listData = res.data;
      }
    });
  }
});

onUnmounted(() => {
  // store.commit("StoreBlindBox/CLEAR_DATA");
});
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.nft-gallery-list-item:not(:first-child) {
  margin-top: 20px;
}
.nft-gallery-list {
  padding-top: 58px;
  border-radius: 34px;
  h3 {
    font-size: 24px;
    font-weight: 500;
  }
  .nft-gallery-address-info {
    display: flex;
    justify-content: flex-start;
    label {
      color: #8c8b8c;
      font-size: 14px;
      min-width: 125px;
      display: block;
      float: left;
      height: 24px;
      line-height: 24px;
    }
    span {
      color: $white;
      font-size: 14px;
      margin-left: 20px;
      display: block;
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
    }
    .address {
      font-size: 12px;
    }
  }
}
.nft-gallery-list-item {
  width: auto;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
  padding: 16px;
  img {
    width: 275px;
    height: 168px;
    margin: auto 0;
    padding: 0;
  }
  .nft-gallery-list-item-right {
    text-align: left;
    width: calc(100% - 310px);
    position: relative;
    .nft-gallery-list-item-right-title {
      color: $white;
      font-size: 14px;
      font-weight: 500;
    }
  }
  .nft-gallery-import {
    min-width: 120px;
    cursor: pointer;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 8px;
    background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
    color: #000000;
    font-size: 8px;
    margin-right: 20px;
    padding: 1px 10px;
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
