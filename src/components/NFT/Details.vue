<template>
  <div class="details">
    <div class="details-info">
      <left-content
        :box_detail="props.detailData"
        :type="props.type"
        :isNFT="props.isNFT"
        :isOwner="props.isOwner"
        :cardType="props.cardType"
        :isOnSell="props.isOnSell"
        @actionsCall="actionsCall"
      ></left-content>
      <Info
        :box_detail="props.detailData"
        :blind_box_type="props.blind_box_type"
        :action_type="props.action_type"
        :isNFT="props.isNFT"
        :isOwner="props.isOwner"
        :isOnSell="props.isOnSell"
        :cardType="props.cardType"
        @actionsCall="actionsCall"
        :occupations="props.occupations"
        :isOwnerQuery="props.isOwnerQuery"
      ></Info>
    </div>
    <div class="content">
      <details-content
        :box_detail="props.detailData"
        :blind_box_type="props.blind_box_type"
        :isNFT="props.isNFT"
      ></details-content>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import LeftContent from "./DetailsUI/NFTLeftContent.vue";
import Info from "./DetailsUI/NFTInfoRight.vue";
import detailsContent from "./DetailsUI/NFTContent.vue";
import { defineProps } from "vue";

let props = defineProps({
  box_detail: {
    type: Object,
    default: () => {},
  },
  isNFT: Boolean,
  action_type: String, // 操作类型
  blind_box_type: String, // box或是nft
  // 卡片详情所有数据
  detailData: {
    type: Object,
    default: () => {},
  },
  type: {
    type: String,
  },
  cardType: {
    type: String,
    default: "", //buyback平台回购，market 市场 collection 收藏 ,conllectionSell 未出售
  },
  isOnSell: {
    type: Boolean,
  },
  isOwner: {
    type: Boolean,
  },
  occupations: {
    type: Array,
  },
  isOwnerQuery: {
    type: Boolean,
  },
});
// 操作事件回调
const emits = defineEmits(["actionsCall"]);
const actionsCall = (action) => {
  emits("actionsCall", action);
};
</script>
<style lang="scss" scoped>
.details {
  padding-bottom: 80px;
  .details-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
