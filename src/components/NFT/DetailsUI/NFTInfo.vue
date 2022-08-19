<template>
  <div
    class="details-right-info"
    :set="(t = getCountDown(props.box_detail.endTime))"
  >
    <div class="base-info-title">
      <span class="base-info-color">{{
        state.isNFT ? props.box_detail.seriesName : props.box_detail.name
      }}</span>
    </div>

    <span class="base-info-color" v-if="state.isNFT">{{
      props.box_detail.name
    }}</span>
    <div class="base-info-list">
      <!-- 素材 -->
      <div class="base-type-info">
        <div
          class="base-info-item type-info"
          v-if="state.isNFT && props.box_detail.nftType"
        >
          <span class="title">{{ $t("category") }}</span>
        </div>
        <div
          class="base-info-item"
          v-if="state.isNFT && props.box_detail.nftType"
        >
          <span class="value">
            <span v-if="props.box_detail.nftType === 'COMPOSITE_ELEMENT'">
              {{ $t("components") }}
            </span>
            <span v-if="props.box_detail.nftType === 'COMPOSITE_CARD'">
              <SvgIcon name="f-clothes"></SvgIcon>
              {{ $t("disassembled NFT") }}
            </span>
            <span v-if="props.box_detail.nftType === 'NORMAL'">
              {{ $t("original NFT") }}
            </span>
          </span>
        </div>
        <!-- 稀有值 -->
        <div
          class="base-info-item"
          v-if="state.isNFT && props.box_detail?.score"
        >
          <span class="title">{{ $t("稀有值") }}</span>
          <span class="value">
            <svg-icon name="rarity" style="margin-right: 4px"></svg-icon>
            <fly-amount
              :value="props.box_detail?.score"
              :formatOptions="{
                precision: 2,
              }"
            >
            </fly-amount>
          </span>
        </div>
      </div>

      <div
        class="base-info-item-character-info"
        v-if="state.isNFT && props.box_detail.nftType === 'COMPOSITE_CARD'"
      >
        <span>
          {{ $t("name") }}:
          <span class="base-info-item-character-info-value">
            {{ props.box_detail?.customName }}</span
          >
        </span>
        <span v-if="props.box_detail?.occupation">
          {{ $t("profession") }}
          <span class="base-info-item-character-info-value">
            {{ props.box_detail?.occupation }}</span
          >
        </span>
        <span v-if="props.box_detail?.sex === 1 || props.box_detail?.sex === 0">
          {{ $t("sex") }}
          <span class="base-info-item-character-info-value">{{
            props.box_detail?.sex === 1 ? $t("male") : $t("female")
          }}</span>
        </span>
      </div>
      <div class="base-info-item base-user-info">
        <div class="user-info" v-if="props.box_detail?.creator">
          <span class="title">{{ $t("创建者") }}</span>
          <span
            class="value"
            @click="
              pushPage(props.box_detail.creator || props.box_detail.address)
            "
            >{{
              stringFormat(
                props.box_detail &&
                  (props.box_detail.creator || props.box_detail.address)
              )
            }}</span
          >
        </div>
        <div
          class="user-info"
          v-if="props.box_detail && props.box_detail.owner"
        >
          <span class="title">{{ $t("当前持有者") }}</span>
          <span class="value" @click="pushPage(props.box_detail.owner)">{{
            stringFormat(props.box_detail && props.box_detail.owner)
          }}</span>
        </div>
        <div class="user-info">
          <span class="title">{{ $t("合约地址") }}</span>
          <span
            class="value"
            @click="pushPage(state.nft_address.split('::')[0])"
            >{{
              state.isNFT
                ? state.nft_address.slice(0, 6) +
                  "..." +
                  state.nft_address.slice(-4)
                : stringFormat(state.nft_address)
            }}</span
          >
        </div>
      </div>

      <div
        class="base-info-item"
        v-if="props.box_detail && props.box_detail.sellType === 2"
      >
        <span class="title">{{ $t("距离结束") }}</span>
        <span class="value" v-if="state.countdown">
          <i>{{ state.countdown["day"] }}</i> :
          <i>{{ state.countdown["hours"] }}</i> :
          <i>{{ state.countdown["minutes"] }}</i> :
          <i>{{ state.countdown["seconds"] }}</i>
        </span>
      </div>
    </div>
    <detail-action
      :box_detail="props.box_detail"
      :action_type="props.action_type"
      :isNFT="state.isNFT"
      @actionsCall="actionsCall"
      :isOwner="props.isOwner"
      :isOnSell="props.isOnSell"
    ></detail-action>
  </div>
</template>
<script setup>
import SvgIcon from "@components/SvgIcon/Index.vue";
import { reactive, computed, defineProps, defineEmits, onUnmounted } from "vue";
import FlyAmount from "@FlyUI/FlyAmount";
import detailAction from "@components/NFT/DetailActions";
import utilsTools from "@utils/tool";
let state = reactive({
  isNFT: computed(() => {
    if (
      props.blind_box_type === "nft" ||
      props.blind_box_type === "composite_card" ||
      props.blind_box_type === "composite_element"
    ) {
      return true;
    }
    return false;
  }),
  nft_address: computed(() => {
    if (
      props.blind_box_type === "nft" ||
      props.blind_box_type === "composite_card" ||
      props.blind_box_type === "composite_element"
    ) {
      return `${props.box_detail.nftMeta}`;
    } else {
      return props.box_detail && props.box_detail.boxToken;
    }
  }),
  countdown: { day: "00", hours: "00", minutes: "00", seconds: "00" },
});
let props = defineProps({
  box_detail: {
    type: Object,
    default: () => {},
  },
  action_type: String, // 操作类型
  blind_box_type: String, // box或是nft
  type: {
    type: String,
  },
  isOwner: {
    type: Boolean,
  },
  isOnSell: {
    type: Boolean,
  },
});
const stringFormat = (str) => {
  if (str) {
    return str.slice(0, 6) + "..." + str.slice(-4);
  } else {
    return "--";
  }
};
const pushPage = (path) => {
  utilsTools.openNewWindow(`https://stcscan.io/main/address/${path}`);
};

let getCountDown = (timestamp) => {
  if (timestamp) {
    setTimeout(() => {
      const res = utilsTools.getCountDownDetails(timestamp);
      state.countdown = res;
    }, 1000);
  }
};
onUnmounted(() => {
  getCountDown = null;
});
// 操作事件回调
const emits = defineEmits(["actionsCall"]);
const actionsCall = (action) => {
  emits("actionsCall", action);
};
</script>

<style lang="scss" scoped>
.details-right-info {
  flex: 1;
  height: 599px;
  color: #fafafa;
  margin-left: 80px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  .base-info-title {
    font-size: 24px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .base-info-title-rarity {
      font-size: 16px;
      .base-info-title-rarity-icon {
        margin-right: 5px;
        cursor: default;
      }
    }
  }
  .base-info-list {
    margin-top: 14px;
    .base-info-item {
      display: flex;
      font-size: 14px;
      margin-bottom: 8px;
      .user-info {
        flex: 1;
        span {
          display: block;
        }
      }
      .title {
        font-size: 12px;
        color: #fafafa;
        margin-bottom: 2px;
      }
      .value {
        font-size: 14px;
        cursor: pointer;
        i {
          font-style: normal;
          display: inline-block;
          width: 23px;
          background: #161311;
          text-align: center;
        }
      }
    }
    .base-type-info {
    }
    .base-user-info {
      width: 521px;
      height: 39px;
      margin-top: 36px;
      background: rgba(255, 255, 255, 0);
      box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.16),
        inset 0px 0px 0px 0px rgba(255, 255, 255, 0.16);
      padding: 21px 0;
    }
  }

  .base-info-item-character-info {
    font-size: 14px;
  }
}
</style>
