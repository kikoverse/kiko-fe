<template>
  <div class="nft-detail-card" v-if="props.box_detail">
    <div class="detail-base-info">
      <div class="left-image">
        <img
          v-if="state.isNFT"
          :src="
            (state.isNFT && props.box_detail.imageLink) ||
            (props.action_type === 'RECOVERY' && props.box_detail.icon)
          "
          alt=""
        />
        <div class="unopen-blind" v-else>
          <img
            :src="props.box_detail.boxTokenLogo || props.box_detail.icon"
            alt=""
          />
          <div class="unopen-blind-mask" v-if="props.action_type === 'UNSOLD'">
            <div class="unopen-blind-mask-line">
              <svg-icon
                name="left-double-arrow"
                style="font-size: 16px"
              ></svg-icon>
              <span @click="actionsCall({ action: 'OpenBlinkBox' })">
                {{ $t("打开盲盒") }}
              </span>
              <svg-icon
                name="right-double-arrow"
                style="font-size: 16px"
              ></svg-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="right-info">
        <div class="right-top-bae-info">
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
            <div
              class="base-info-item"
              v-if="state.isNFT && props.box_detail.nftType"
            >
              <span class="title">{{ $t("category") }}</span>
              <span class="value">
                <span v-if="props.box_detail.nftType === 'COMPOSITE_ELEMENT'">
                  {{ $t("components") }}
                </span>
                <span
                  v-if="
                    props.box_detail.nftType === 'COMPOSITE_CARD' &&
                    props.box_detail?.original === false
                  "
                >
                  <SvgIcon name="f-clothes"></SvgIcon>
                  {{ $t("disassembled NFT") }}
                </span>
                <span
                  v-if="
                    props.box_detail.nftType === 'NORMAL' ||
                    (props.box_detail.nftType === 'COMPOSITE_CARD' &&
                      props.box_detail?.original === true)
                  "
                >
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

            <div
              class="base-info-item-character-info"
              v-if="
                state.isNFT &&
                props.box_detail.nftType === 'COMPOSITE_CARD' &&
                !props.box_detail?.original
              "
            >
              <span style="margin-right: 8px">
                {{ $t("name") }}:
                <span class="base-info-item-character-info-value">
                  {{ props.box_detail?.customName }}</span
                >
              </span>
              <span
                style="margin-right: 8px"
                v-if="props.box_detail?.occupation"
              >
                {{ $t("profession") }}
                <span class="base-info-item-character-info-value">
                  {{ props.box_detail?.occupation }}</span
                >
              </span>
              <span
                style="margin-right: 8px"
                v-if="
                  props.box_detail?.sex === 1 || props.box_detail?.sex === 0
                "
              >
                {{ $t("sex") }}
                <span class="base-info-item-character-info-value">{{
                  props.box_detail?.sex === 1 ? $t("male") : $t("female")
                }}</span>
              </span>
            </div>
            <div
              class="base-info-item"
              style="margin-top: 20px"
              v-if="props.box_detail?.creator"
            >
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
              class="base-info-item"
              v-if="props.box_detail && props.box_detail.owner"
            >
              <span class="title">{{ $t("当前持有者") }}</span>
              <span class="value" @click="pushPage(props.box_detail.owner)">{{
                stringFormat(props.box_detail && props.box_detail.owner)
              }}</span>
            </div>
            <div class="base-info-item" v-if="state.nft_address">
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
        </div>
        <!-- {{ props.box_detail }} -->
        <!-- 操作部分 -->
        <detail-action
          class="detail-actions"
          :box_detail="props.box_detail"
          :action_type="props.action_type"
          :isNFT="state.isNFT"
          @actionsCall="actionsCall"
        ></detail-action>
      </div>
    </div>
    <div class="detail-specific-info">
      <nft-detail-tab
        :cross_bar_array="state.cross_bar_array"
        @selectCrossTab="selectCrossTab"
        :selected_tab="state.selected_tab"
      ></nft-detail-tab>
      <div class="detail-specific-info-container">
        <div
          class="specific-description"
          v-if="state.selected_tab === 'description'"
        >
          {{
            props.box_detail && state.currLang === "en"
              ? props.box_detail.enDescription
              : props.box_detail.cnDescription
          }}
        </div>
        <div
          class="specific-rarevalue"
          v-if="
            state.selected_tab === 'rarevalue' &&
            state.isNFT &&
            props.box_detail.nftType !== 'COMPOSITE_ELEMENT'
          "
        >
          <nft-detail-specific
            :box_detail="props.box_detail"
          ></nft-detail-specific>
        </div>
        <div
          class="specific-history"
          v-if="
            state.selected_tab === 'history' &&
            state.isNFT &&
            props.box_detail.nftType !== 'COMPOSITE_ELEMENT'
          "
        >
          <nft-detail-history
            :box_detail="props.box_detail"
          ></nft-detail-history>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, computed, defineProps, defineEmits, watchEffect } from "vue";
import detailAction from "@components/NFT/DetailActions";
import NftDetailSpecific from "./DetailsUI/NFTDetailSpecific.vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import utilsTools from "@utils/tool";
import NftDetailHistory from "./DetailsUI/NFTDetailHistory.vue";
import NftDetailTab from "./DetailsUI/NFTDetailTab.vue";
import FlyAmount from "@FlyUI/FlyAmount";

const store = useStore();
let state = reactive({
  cross_bar_array: null,
  accounts: computed(() => store.state.StoreWallet.accounts),
  currLang: computed(() => store.state.StoreApp.currLang),
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
  selected_tab: "",
});

const pushPage = (path) => {
  utilsTools.openNewWindow(`https://stcscan.io/main/address/${path}`);
};

const getBarArray = () => {
  if (!props.box_detail.nftType) return;
  if (state.isNFT) {
    if (props.box_detail.nftType === "COMPOSITE_ELEMENT") {
      return [
        {
          id: "description",
          name: t("描述"),
        },
      ];
    } else {
      return [
        {
          id: "description",
          name: t("描述"),
        },
        {
          id: "rarevalue",
          name: t("稀有值"),
        },
        {
          id: "history",
          name: t("历史"),
        },
      ];
    }
  } else {
    return [
      {
        id: "description",
        name: t("描述"),
      },
    ];
  }
};

watchEffect(() => {
  if (!props.box_detail.nftType) return;
  state.cross_bar_array = getBarArray();
  state.selected_tab = state.cross_bar_array?.[0]?.id;
});

let props = defineProps({
  box_detail: {
    type: Object,
    default: () => {},
  },
  action_type: String, // 操作类型
  blind_box_type: String, // box或是nft
  // 来源页面
  fromView: {
    type: String,
  },
});

// 操作事件回调
const emits = defineEmits(["actionsCall"]);
const actionsCall = (action) => {
  emits("actionsCall", action);
};
const stringFormat = (str) => {
  if (str) {
    return str.slice(0, 6) + "..." + str.slice(-4);
  } else {
    return "--";
  }
};

const selectCrossTab = (name) => {
  state.selected_tab = name;
};
</script>
<style lang="scss" scoped>
.nft-detail-card {
  padding-bottom: 80px;
  .detail-base-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-image {
      width: 424px;
      height: 424px;
      background: #ffffff;
      border-radius: 14px;
      font-size: 0;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        max-width: 424px;
        max-height: 424px;
      }
      .unopen-blind {
        margin: 0 auto;
        width: 424px;
        height: 424px;
        background: rgba(235, 235, 235, 0.22);
        text-align: center;
        line-height: 424px;
        position: relative;
        .unopen-blind-mask {
          background: rgba(0, 0, 0, 0.2);
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          .unopen-blind-mask-line {
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            width: 100%;
            height: 75px;
            font-size: 25px;
            font-weight: 600;
            position: absolute;
            top: 50%;
            transform: translate(0%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            cursor: pointer;
            span {
              padding: 0px 20px;
            }
          }
        }
        img {
          vertical-align: middle;
          width: auto;
          height: auto;
        }
      }
    }
    .right-info {
      flex: 1;
      color: #3f1c09;
      margin-left: 33px;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      .base-info-title {
        font-size: 32px;
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
      // .base-info-color {
      //   font-weight: 500;
      //   font-size: 20px;
      // }
      .base-info-list {
        margin-top: 24px;
        .base-info-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 8px;
          .title {
            color: #7f7f7f;
          }
          .value {
            cursor: pointer;
            color: #3f1c09;
          }
        }
      }
      .base-info-item-character-info {
        font-size: 14px;
        color: #7f7f7f;
        .base-info-item-character-info-value {
          color: #3f1c09 !important;
        }
      }
      .detail-actions {
        margin-top: 20px;
      }
    }
  }
  .detail-specific-info {
    margin-top: 48px;
    color: #3f1c09;
    .detail-specific-info-container {
      margin-top: 36px;
      font-size: 14px;
      font-weight: 500;
      .specific-history {
        height: 100%;
      }
    }
  }
}
</style>
