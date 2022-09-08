<template>
  <fly-nft
    class="nft-gallery"
    coreType="list"
    :cardStyleType="false"
    :listTypeParams="{ minHeight: '800px' }"
  >
    <template #nft-list>
      <div class="box">
        <div
          class="nft-card-item"
          v-for="item in state.list"
          :key="item.id"
          @click="transfer(item)"
        >
          <div class="img-box">
            <img :src="item.image" alt="" width="100%" />
          </div>
          <div class="item-content">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </template>
  </fly-nft>
</template>

<script setup>
import FlyNft from "@FlyUI/FlyNFT.vue";
import { getGalleryDetail, isGalleryDetail } from "../../../api/nft/blindbox";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { reactive, watchEffect } from "vue";
import { getContractWidthSinger } from "../../../walletUtils/stcContract";
import { ElMessage, ElMessageBox } from "element-plus";
const store = useStore();
const route = useRoute();

const state = reactive({
  list: [],
});
const transfer = async (d) => {
  ElMessageBox.prompt("请输入账户地址", "标题", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
  })
    .then(async ({ value }) => {
      try {
        const res = await isGalleryDetail({
          body: route.query.body,
          meta: route.query.meta,
          address: store.state.StoreWallet.accounts[0],
        });
        if (res.code == 200) {
          await getContractWidthSinger(
            store.state.StoreWallet.stcProvider,
            "0x00000000000000000000000000000001::NFTGalleryScripts",
            "transfer",
            [route.query.meta, route.query.body],
            () => {},
            d.id,
            value
          );
          ElMessage.success(`nftid:${d.id},转账成功`);
        } else {
          ElMessage.error("没有添加陈列室");
        }
      } catch (err) {
        console.error(err);
        ElMessage.error(`nftid:${d.id},转账失败`);
      }
    })
    .catch(() => {});
};
watchEffect(() => {
  if (store.state.StoreWallet.accounts[0]) {
    getGalleryDetail({
      body: route.query.body,
      meta: route.query.meta,
      address: store.state.StoreWallet.accounts[0],
    }).then((res) => {
      state.list = res.data;
    });
  }
});
</script>

<style lang="scss" scoped>
$border-radius: 8px;
$gray: #7f7f7f;
$fontWeight: bold;
$black: #010e22;
.box {
  display: flex;
  flex-wrap: wrap;
}
.nft-gallery {
  width: 1200px;
  margin: 30px auto;
  padding-bottom: 30px;
  min-height: 800px;
}

.nft-card-item {
  width: 380px;
  background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
  border-radius: 8px;
  font-size: 14px;
  user-select: none;
  margin-bottom: 20px;
  overflow: hidden;
  margin-right: 20px;
  &:hover {
    box-shadow: 0 18px 32px -18px rgba(0, 0, 0, 0.6) !important;
    transform: translateY(-3px);
  }
  .img-box {
    width: 100%;
    height: 200px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    background: #e8906c;
    text-align: center;
    img {
      cursor: pointer;
      width: 100%;
      height: 100%;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }
  }
  .item-content {
    padding: 12px 16px 24px 16px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    .category {
      display: block;
      background: rgba(251, 168, 0, 0.3);
      color: #fba800;
      border-radius: 4px;
      height: 23px;
      line-height: 23px;
      padding: 0 10px;
    }
  }
}
</style>
