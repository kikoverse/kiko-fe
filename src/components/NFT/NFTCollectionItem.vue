<template>
  <div
    class="nft-card-item"
    :class="$style['nft-card-item']"
    v-if="props.baseData"
  >
    <div :class="$style['img-box']">
      <img :src="props.baseData.boxTokenLogo" alt="" width="100%" />
    </div>
    <div :class="$style['item-content']">
      <span>{{ props.baseData.seriesName }}</span>
      <span v-if="props.baseData.contentType" :class="$style['category']">{{
        $t(props.baseData.contentType)
      }}</span>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import { defineProps, reactive, computed, defineEmits, onUnmounted } from "vue";
import { useStore } from "vuex";
import utilsFormat from "@utils/format";
import { useNFT } from "../../hooks/useNFT";
import NFT_CONSTANTS from "@constants/nft.js";
import utilsTool from "@utils/tool";
const store = useStore();
const props = defineProps({
  cardType: {
    type: String,
    default: "", //buyback平台回购，market 市场 collection 收藏 ,
  },
  sellType: {
    type: String,
    default: "", //selling 我的NFT销售中
  },
  baseData: {
    type: Object,
  },
  contentText: {
    type: String,
    default: "",
  },
  hasBtn: {
    type: Boolean,
    default: true,
  },
});
let state = reactive({
  isShowConfirm: computed(
    () => store.state.StoreNftMarket.change_confirm_visible
  ),
  // pic: require("//kikoswap.com/static/img/loading.webp"),
  icon: require("../../assets/nft/blindbox.png"),
  contentText: "",
  countdown: null,
});
</script>

<style lang="scss" module>
$border-radius: 8px;
$gray: #7f7f7f;
$fontWeight: bold;
$black: #010e22;

.nft-card-item {
  width: 380px;
  background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
  border-radius: 8px;
  font-size: 14px;
  user-select: none;
  margin-bottom: 20px;
  overflow: hidden;
  margin-right: 28px;
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
    img {
      cursor: pointer;
      width: 100%;
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
