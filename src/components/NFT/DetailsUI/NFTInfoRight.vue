<template>
  <div
    class="details-right-info"
    :set="(t = getCountDown(props.box_detail.endTime))"
  >
    <!-- 标题 -->
    <div class="details-title base-item">
      <div class="item-info title">
        <p class="item-title title-text">
          {{
            state.isNFT ? props.box_detail.seriesName : props.box_detail.name
          }}
        </p>
        <p class="item-value title-text-info" v-if="state.isNFT">
          {{ props.box_detail.name }}
        </p>
      </div>
    </div>

    <!-- 类型 / 稀有值 -->
    <div class="details-type-rarity base-item">
      <div class="item-info type">
        <p class="item-title">{{ $t("category") }}</p>
        <p class="item-value">
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
              (props.blind_box_type !== 'box' &&
                props.box_detail.nftType === 'NORMAL') ||
              (props.box_detail.nftType === 'COMPOSITE_CARD' &&
                props.box_detail?.original === true)
            "
          >
            {{ $t("original NFT") }}
          </span>
          <span v-if="props.blind_box_type === 'box'">
            {{ $t("盲盒") }}
          </span>
        </p>
      </div>
      <div class="item-info rarity" v-if="props.box_detail?.score">
        <p class="item-title">{{ $t("稀有值") }}</p>
        <p class="item-value">
          <fly-amount
            :value="props.box_detail?.score"
            :formatOptions="{
              precision: 0,
            }"
          >
          </fly-amount>
        </p>
      </div>
    </div>

    <!-- avatar info  -->
    <div
      class="details-avatar-info base-item"
      v-if="
        state.isNFT &&
        props.box_detail.nftType === 'COMPOSITE_CARD' &&
        !props.box_detail?.original
      "
    >
      <div class="item-info name">
        <p class="item-title">{{ $t("name") }}</p>
        <p class="item-value">{{ props.box_detail?.customName }}</p>
      </div>
      <div class="item-info job" v-if="props.box_detail?.occupation">
        <p class="item-title">{{ $t("profession") }}</p>
        <p class="item-value">
          {{ mapProfession(props.box_detail?.occupation) || "" }}
        </p>
      </div>
      <div
        class="item-info sex"
        v-if="props.box_detail?.sex === 9 || props.box_detail?.sex === 0"
      >
        <p class="item-title">{{ $t("sex") }}</p>
        <p class="item-value">
          {{ props.box_detail?.sex === 1 ? $t("male") : $t("female") }}
        </p>
      </div>
    </div>

    <!-- 用户信息  -->
    <div class="details-user base-item">
      <div class="item-info creator" v-if="props.box_detail?.creator">
        <p class="item-title">{{ $t("创建者") }}</p>
        <p
          class="item-value"
          @click="
            pushPage(props.box_detail.creator || props.box_detail.address)
          "
        >
          {{
            stringFormat(
              props.box_detail &&
                (props.box_detail.creator || props.box_detail.address)
            )
          }}
        </p>
      </div>
      <div
        class="item-info owner"
        v-if="props.box_detail && props.box_detail.owner"
      >
        <p class="item-title">{{ $t("当前持有者") }}</p>
        <p class="item-value" @click="pushPage(props.box_detail.owner)">
          {{ stringFormat(props.box_detail && props.box_detail.owner) }}
        </p>
      </div>
      <div class="item-info address">
        <p class="item-title">{{ $t("合约地址") }}</p>
        <p
          class="item-value"
          @click="pushPage(state.nft_address.split('::')[0])"
        >
          {{
            state.isNFT
              ? state.nft_address.slice(0, 6) +
                "..." +
                state.nft_address.slice(-4)
              : stringFormat(state.nft_address)
          }}
        </p>
      </div>
    </div>

    <!-- 倒计时 -->
    <div
      class="details-countdown base-item"
      v-if="props.box_detail && props.box_detail.sellType === 2"
    >
      <div class="item-info">
        <p class="item-title">{{ $t("距离结束") }}</p>
        <p class="item-value" v-if="state.countdown">
          <i>{{ state.countdown["day"] }}</i> :
          <i>{{ state.countdown["hours"] }}</i> :
          <i>{{ state.countdown["minutes"] }}</i> :
          <i>{{ state.countdown["seconds"] }}</i>
        </p>
      </div>
    </div>

    <!-- 操作按钮 -->
    <detail-action
      v-if="props.isOwnerQuery !== 'false' || props.box_detail?.sellStatus == 1"
      :box_detail="props.box_detail"
      :action_type="props.action_type"
      :isNFT="state.isNFT"
      @actionsCall="actionsCall"
    ></detail-action>
  </div>
</template>
<script setup>
import SvgIcon from "@components/SvgIcon/Index.vue";
import { reactive, computed, defineProps, defineEmits, onUnmounted } from "vue";
import FlyAmount from "@FlyUI/FlyAmount";
import detailAction from "@components/NFT/DetailActions";
import utilsTools from "@utils/tool";
import { useStore } from "vuex";
const store = useStore();

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
  lang: computed(() => store.state.StoreApp.currLang),
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
  occupations: {
    type: Array,
  },
  isOwnerQuery: {
    type: Boolean,
  },
});
store.dispatch("StoreMeta/getNFTMeatInfo");
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

const mapProfession = (item) => {
  // 历史数据原因 需判断 “None”
  if (item === "None") {
    return false;
  } else {
    let value = { cnDesc: "", desc: "" };
    if (props.occupations) {
      let obj = props.occupations.filter((i) => i.value === item);
      if (obj) {
        value = state.lang === "zh" ? obj[0].cnDesc : obj[0].desc;
      }
    }
    return value || "";
  }
};
// 操作事件回调
const emits = defineEmits(["actionsCall"]);
const actionsCall = (action) => {
  emits("actionsCall", action);
};
</script>
<style scoped lang="scss">
.details-right-info {
  flex: 1;
  height: 599px;
  margin-left: 80px;
  display: flex;
  flex-flow: column;
  // justify-content: space-between;
  .base-item {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
    p {
      font-weight: 400;
      color: #8c8b8c;
    }
    .item-info {
      flex: 1;
      .item-title {
        font-size: 14px;
        margin-bottom: 4px;
      }
      .item-value {
        font-size: 18px;
        color: #fafafa;
        font-weight: normal;
      }
    }
    .title-text {
      font-size: 32px !important;
      color: #fafafa;
    }
  }
  .details-title {
    margin-top: 0 !important;
  }
  .details-user {
    padding: 21px 0;
    background: rgba(255, 255, 255, 0);
    box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.16),
      inset 0px 0px 0px 0px rgba(255, 255, 255, 0.16);
    border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  }
  .details-countdown {
    margin-top: 15px !important;
    i {
      font-style: normal;
      display: inline-block;
      width: 23px;
      background: rgba(250, 250, 250, 0.2);
      text-align: center;
    }
  }
}
</style>
