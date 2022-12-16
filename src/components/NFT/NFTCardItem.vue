<template>
  <div
    class="nft-card-item"
    :class="$style['nft-card-item']"
    v-if="props.baseData"
    :set="
      ((itemData = props.baseData),
      (boxToken = itemData.boxToken),
      (nftMeta = itemData.nftMeta),
      (payToken = utilsFormat.getTokenCurrency(itemData.payToken)),
      (offerPriceStyle = getOfferPriceStyle(itemData.sellType)),
      (t = getCountDown(itemData.endTime)))
    "
  >
    <div :class="$style['img-box']" @click="watchDetail">
      <div
        :class="$style['countdown-box']"
        v-if="showCountDown(props.cardType, state.countdown, props.sellType)"
      >
        <svg-icon
          name="clock"
          style="margin-right: 3px; font-size: 16px"
        ></svg-icon>
        <span>{{ state.countdown }}</span>
      </div>
      <!-- v-unsold-nft-url="{
          isUnSoldNft: itemData.isUnSoldNft || false,
          url: itemData.icon || '',
        }" -->
      <img :src="itemData.icon || itemData.imageLink" alt="" width="100%" />
    </div>
    <div :class="$style['item-content']">
      <div :class="$style['item-content-info']">
        <div :class="$style['item-content-info-data']">
          <span :class="$style['item-content-info-data-name']">{{
            itemData.nftName || itemData.name
          }}</span>
          <span :class="$style['item-content-info-data-address']">
            {{
              baseData.type === "box"
                ? utilsFormat.formatSliceString(boxToken)
                : utilsFormat.formatSliceString(nftMeta)
            }}
          </span>
        </div>
        <div :class="$style['item-content-info-flag']">
          <!-- 可分解标示 -->
          <div
            :class="$style['icon-ui']"
            v-if="showDisassembledIcon(itemData.type)"
          >
            <nft-card-item-tool-tip
              :placeString="$t('metaverse.can be disassembled')"
              svgName="f-clothes"
              :svgStyle="'width:20px;height:20px;'"
            >
            </nft-card-item-tool-tip>
          </div>

          <!-- 稀有值 -->
          <div
            v-if="showRarityIcon(itemData.type, itemData?.score)"
            :class="$style['item-content-info-flag-score']"
          >
            <nft-card-item-tool-tip
              :placeString="$t('NFT稀有值')"
              svgName="f-rarity"
              :svgStyle="'width:20px;height:20px;'"
            >
            </nft-card-item-tool-tip>
            <fly-amount
              style="margin-left: 3px"
              :value="itemData?.score"
              :formatOptions="{
                precision: 0,
              }"
            >
            </fly-amount>
          </div>
        </div>
      </div>

      <div :class="$style['item-content-slots']">
        <!-- 回购 -->
        <div
          v-if="props.cardType === 'buyback'"
          :class="$style['item-content-slots-buyback']"
        >
          <span>{{ $t("回收价格") }}：</span>
          <span> {{ itemData.buyPrice }} {{ itemData.currency }}</span>
        </div>

        <!-- market -->
        <div
          v-if="props.cardType === 'market'"
          :class="$style['item-content-slots-market']"
        >
          <div :class="$style['item-content-slots-market-item']">
            <span style="font-weight: normal"
              >{{
                offerPriceStyle === "auction" ? $t("最新报价") : $t("一口价")
              }}：</span
            >
            <!-- 有最新出价则出价否则就展示售价 -->
            <span
              >{{
                utilsFormat.formatPrice(
                  itemData?.offerPrice || itemData.sellPrice
                )
              }}
              {{ payToken }}</span
            >
          </div>
        </div>
        <!-- collection selling -->
        <div
          v-if="props.cardType === 'collection' && props.sellType === 'selling'"
          :class="$style['item-content-slots-market collection-item-bid']"
        >
          <div v-if="offerPriceStyle === 'auction'">
            <div :class="$style['item-content-slots-market-item']">
              <span style="font-weight: normal">{{ $t("起拍价") }}：</span>
              <span
                >{{ utilsFormat.formatPrice(itemData.sellPrice) }}
                {{ utilsFormat.getTokenCurrency(itemData.payToken) }}</span
              >
            </div>
            <div :class="$style['item-content-slots-market-item']">
              <span style="font-weight: normal">{{ $t("最高出价") }}：</span>
              <span v-if="Number(itemData.offerPrice) > 0">
                {{ utilsFormat.formatPrice(itemData.offerPrice) }}
                {{ utilsFormat.getTokenCurrency(itemData.payToken) }}
              </span>
              <span v-else style="text-align: right">
                {{ $t("暂无报价") }}
              </span>
            </div>
          </div>
          <div v-if="offerPriceStyle === 'one_time_offer'">
            <div
              :class="$style['item-content-slots-market-item']"
              style="margin-bottom: 28px"
            >
              <span style="font-weight: normal">{{ $t("一口价") }}：</span>
              <span
                >{{ utilsFormat.formatPrice(itemData.sellPrice) }}
                {{ utilsFormat.getTokenCurrency(itemData.payToken) }}</span
              >
            </div>
          </div>
        </div>

        <!-- collection -->
        <div
          v-if="props.cardType === 'collection'"
          :class="$style['item-content-slots-collection']"
        >
          <div
            v-if="props.sellType === 'selling'"
            :class="$style['item-content-slots-collection-btns']"
          >
            <fly-button
              type="light"
              :style="{ width: Number(baseData.offerPrice) <= 0 ? '100%' : '' }"
              :class="$style['item-content-slots-collection-selling-btn']"
              @click="actionsCall('CancelSell')"
              >{{ $t("取消出售") }}</fly-button
            >
            <fly-button
              v-if="Number(baseData.offerPrice) > 0"
              type="dark"
              :class="[
                $style['item-content-slots-collection-selling-btn'],
                $style['item-content-slots-collection-selling-btn-light'],
              ]"
              @click="actionsCall('AcceptBid')"
              >{{
                $t("接受") +
                ` ${formatPriceWithLength(
                  baseData.offerPrice
                )} ${utilsFormat.getTokenCurrency(baseData.payToken)}`
              }}
            </fly-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import { defineProps, reactive, computed, defineEmits, onUnmounted } from "vue";
import { useStore } from "vuex";
import FlyButton from "@FlyUI/FlyButton.vue";
import Confirm from "@components/NFT/Confirm";
import utilsFormat from "@utils/format";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlyAmount from "@FlyUI/FlyAmount";
import NftCardItemToolTip from "./NFTCardItemToolTip.vue";
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

const { getNFTType, isNFT, getOfferPriceStyle } = useNFT(store, props.baseData);

let getCountDown = (timestamp) => {
  if (timestamp) {
    setTimeout(() => {
      const res = utilsTool.getCountDown(timestamp);
      state.countdown = res;
    }, 1000);
  }
};

onUnmounted(() => {
  getCountDown = null;
});

const formatPriceWithLength = (price) => {
  const t = utilsFormat.formatPrice(price, 9, { grouped: false });
  if (t && t.length > 3) {
    return t.slice(0, 3) + "...";
  }
  return t;
};

const showDisassembledIcon = (type) => {
  return type === "composite_card" || type === "composite_element";
};
const showRarityIcon = (type, score) => {
  if (NFT_CONSTANTS.NFT_TYPES.indexOf(type) > -1 && score) {
    return true;
  }
  return false;
};

const showCountDown = (cardType, count, sellType) => {
  if (cardType === "market" && count) return true;
  if (cardType === "collection" && count && sellType === "selling") return true;
  return false;
};

const handleConfirm = () => {
  store.commit("StoreNftMarket/CHANGE_CONFIRM_VISIBLE", false);
};
const handleClose = () => {
  store.commit("StoreNftMarket/CHANGE_CONFIRM_VISIBLE", false);
};
const emits = defineEmits(["watchDetail", "actionsCall"]);
const watchDetail = () => {
  // 卡片的信息
  emits("watchDetail", props.baseData);
};
const actionsCall = (action) => {
  emits("actionsCall", { action: action, baseData: props.baseData });
};
</script>

<style lang="scss" module>
$border-radius: 8px;
$gray: #7f7f7f;
$fontWeight: bold;
$black: #010e22;

.nft-card-item {
  width: 279px;
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
    width: 279px;
    height: 279px;
    position: relative;
    cursor: pointer;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    background: #e8906c;
    img {
      cursor: pointer;
      max-width: 279px;
      max-height: 279px;
      width: 100%;
      height: 100%;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }
    .countdown-box {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 113px;
      height: 28px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      top: 16px;
      right: 16px;
      color: #fff;
      span {
        font-size: 13px;
      }
    }
  }
  .item-content {
    padding: 12px 16px 24px 16px;
    .item-content-info {
      display: flex;
      justify-content: space-between;
      .item-content-info-data {
        display: flex;
        flex-direction: column;
        .item-content-info-data-name {
          width: 120px;
          font-size: 14px;
          font-weight: bold;
          color: $white;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .item-content-info-data-address {
          color: #7f7f7f;
          font-size: 14px;
        }
      }
      .item-content-info-flag {
        display: flex;
        .icon-ui {
          text-align: center;
          width: 32px;
          height: 23px;
          background: rgba(251, 168, 0, 0.1);
          border-radius: 12px;
          margin-right: 8px;
          .svg-icon {
            width: 20px;
            height: 20px;
          }
        }
        .item-content-info-flag-score {
          font-weight: bold;
          display: flex;
          padding: 0 10px;
          background: rgba(251, 168, 0, 0.1);
          border-radius: 12px;
          height: 23px;
          line-height: 23px;
          color: #fba800;
        }
      }
    }
    .item-content-slots {
      .item-content-slots-market-item {
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        span {
          font-weight: $fontWeight;
        }
        span:first-child {
          color: $gray;
        }
        span:nth-child(2) {
          color: $white;
        }
      }
      .item-content-slots-buyback {
        margin: 10px 0px;
        text-align: left;
        display: block;
        font-size: 14px;
        display: flex;
        span {
          flex: 1;
          font-weight: $fontWeight;
          justify-content: space-between;
        }
        span:first-child {
          color: $gray;
        }
        span:nth-child(2) {
          color: $white;
          text-align: right;
        }
      }
      .item-content-slots-market {
        margin: 10px 0px;
      }
      .item-content-slots-collection {
        .item-content-slots-collection-btns {
          display: flex;
          justify-content: space-between;
          margin: 10px auto 0px;
        }
        .item-content-slots-collection-selling-btn {
          height: 10px;
          line-height: 10px;
          width: 48%;
          padding-left: 0;
          padding-right: 0;
          background: none;
        }
        .item-content-slots-collection-selling-btn-light {
          // border: 1px solid $border-gray-color;
          // color: $text-black-color;
          background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
          color: #a03300;
        }
      }
    }
  }
}
</style>
