<template>
  <div>
    <FlySpecialBg></FlySpecialBg>
    <div class="nft-blindbox-core" v-if="state.blindBoxData">
      <div class="nft-blindbox-core-header">
        <div class="nft-blindbox-core-header-left">
          <img :src="state.blindBoxData.boxTokenLogo" />
          <!-- <img src="../../../assets/nft/box.gif" /> -->
        </div>
        <div class="nft-blindbox-core-header-right">
          <p class="nft-blindbox-core-header-right-title">
            {{ state.blindBoxData.name }}
          </p>
          <Fly-space :size="36"></Fly-space>
          <p
            class="nft-blindbox-core-header-right-quantity"
            v-if="state.remainQuantity"
          >
            <span>{{ $t("剩余数量") }}</span>
            <span>{{ state.remainQuantity }}</span>
          </p>
          <Fly-space :size="36"></Fly-space>
          <div class="nft-blindbox-core-price-content">
            <p class="nft-blindbox-core-header-right-price">
              <span>{{ $t("售价") }}</span>
              <span> {{ state.blindBoxData.sellingPrice }} STC</span>
            </p>
          </div>

          <Fly-space :size="36"></Fly-space>
          <template v-if="state.walletStatus === 'unConnected'">
            <fly-button
              type="light"
              class="nft-blindbox-core-header-right-button light"
              @click="connectWallet"
            >
              {{ $t("链接钱包") }}
            </fly-button>
          </template>
          <template v-if="state.walletStatus === 'connected'">
            <fly-button
              type="brown"
              class="nft-blindbox-core-header-right-button"
              :style="{ cursor: 'default' }"
              v-if="
                productStatus === 'unopened' &&
                state.sellingTime &&
                state.loaded
              "
            >
              <p>{{ t("即将到来") }}： {{ state.sellingTime }}</p>
            </fly-button>
            <fly-button
              class="nft-blindbox-core-header-right-button"
              @click="changeBuyModalStatus(true)"
              v-if="
                productStatus === 'ongoing' ||
                (state.loaded &&
                  !state.sellingTime &&
                  productStatus !== 'sellout')
              "
            >
              {{ $t("购买") }}
            </fly-button>
            <fly-button
              type="disabled"
              class="nft-blindbox-core-header-right-button"
              v-if="productStatus === 'sellout'"
              :style="{ cursor: 'default' }"
            >
              {{ $t("售罄") }}
            </fly-button>
          </template>
        </div>
      </div>
      <Fly-space :size="70"></Fly-space>
      <div class="nft-blindbox-core-introduces">
        <div v-for="(d, i) in state.blindBoxData.introduces" :key="i">
          <Fly-space :size="68" v-if="i !== 0"></Fly-space>
          <p class="nft-blindbox-core-introduces-title">
            {{ t(`${d.title}`) }}
          </p>
          <Fly-space :size="16"></Fly-space>
          <p
            class="nft-blindbox-core-introduces-desc"
            v-html="
              state.lang === 'en'
                ? `${d.enDesc}`
                : state.lang === 'zh'
                ? `${d.cnDesc}`
                : ''
            "
          ></p>
        </div>
      </div>
    </div>
    <fly-loading-fish v-else></fly-loading-fish>
    <Fly-confirm
      :title="t('购买盲盒')"
      :dialogVisible="state.isShowBuyModal"
      class="nft-blindbox-core-buy-dialog"
      :isCustomContent="true"
      :width="440"
      @handleClose="changeBuyModalStatus(false)"
      @handleSuccess="handleDialog('success')"
      @handleFailed="handleDialog('failed')"
    >
      <template #core>
        <div class="nft-blindbox-core-buy-dialog-content">
          <!-- <p>
            {{
              t("剩余可购买", {
                content: state.remainQuantity,
              })
            }}
          </p> -->
          <Fly-space :size="10"></Fly-space>
          <fly-input-number
            width="100%"
            class="fly-input-number"
            :value="state.inputVal"
            @inputEvent="inputEvent"
          ></fly-input-number>
          <Fly-space :size="10"></Fly-space>
          <div class="nft-blindbox-core-buy-dialog-content-details">
            <span>{{ t("总价") }}：{{ totalCost }} STC</span>
            <span>{{ t("钱包余额") }}：{{ userAmount }} STC</span>
          </div>
          <div class="nft-blindbox-core-buy-dialog-content-errors">
            <!-- <p v-if="state.errors[0]">
              * {{ t("购买数量需小于剩余可购买数量") }}
            </p> -->
            <p v-if="!state.inputVal_isInteger">*{{ t("只能输入整数") }}</p>
            <p v-if="state.errors[1]">* {{ t("可用金额不足") }}</p>
            <p v-if="state.errors[0]">* {{ t("超过单次最大购买数量5") }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="nft-blindbox-core-buy-dialog-footer">
          <fly-button type="cancel" @click="changeBuyModalStatus(false)">
            {{ t("取消") }}
          </fly-button>
          <fly-button @click="buyBlindBox">
            {{ t("确认") }}
          </fly-button>
        </div>
      </template>
    </Fly-confirm>
    <nft-dialog
      :dialogVisible="state.dialogParams.isShow"
      :isShowClose="!(state.dialogParams.dialogStatus === 'ongoing')"
      class="nft-blindbox-core-buycb-dialog"
      :dialogParams="state.dialogParams"
      @handleClose="handleCloseBuyCbModal"
      @handleSuccess="handleSuccess"
      @handleFailed="handleFailed"
    ></nft-dialog>
    <nft-sold-out-dialog
      :dialogVisible="state.soldDialogParams.isShow"
      :dialogParams="state.soldDialogParams"
      @handleClose="handleSoldOutCloseFunc"
      @handleConfirm="handleSoldOutConfirmFunc"
    >
    </nft-sold-out-dialog>
  </div>
</template>
<script setup>
import {
  computed,
  ref,
  reactive,
  onUnmounted,
  watch,
  onBeforeMount,
} from "vue";
import FlyConfirm from "@FlyUI/FlyConfirm";
import NFT_CONSTANTS from "@constants/nft.js";
import NftDialog from "@components/NFT/NFTDialog.vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import FlyButton from "@FlyUI/FlyButton.vue";
import FlyInputNumber from "@FlyUI/FlyInutNumber.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import utilsDate from "@utils/date.js";
import { isUndefined } from "lodash";
import { useRouter, useRoute } from "vue-router";
import utilsNumber from "@utils/number";
import utilsFormat from "@utils/format";
import connectLogic from "@hooks/useMyWallet";
import CONSTANTS_TOKENS from "@constants/token";
import NftSoldOutDialog from "@components/NFT/NFTSoldOutDialog.vue";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import utilsRegexp from "@utils/regexp";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
const store = useStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { connectWallet } = connectLogic(store);
let state = reactive({
  lang: computed(() => store.state.StoreApp.currLang),
  blindBoxData: computed(() => store.state.StoreBlindBox.blindBoxData),
  sellingTime: null,
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  timer: null, //倒计时定时器
  balances: computed(() => store.state.StoreWallet.balances),
  isShowBuyModal: computed(() => store.state.StoreBlindBox.isShowBuyModal),
  remainQuantity: computed(() => store.state.StoreBlindBox.remainQuantity),
  inputVal: 1,
  loaded: false,
  inputVal_isInteger: true,
  errors: [false, false],
  buyStatus: computed(() => store.state.StoreBlindBox.buyStatus),
  provider: computed(() => store.state.StoreWallet.stcProvider),
  dialogParams: computed(() => store.state.StoreBlindBox.dialogParams),
  soldDialogParams: computed(() => store.state.StoreBlindBox.soldDialogParams),
});

const handleSoldOutCloseFunc = () => {
  window.location.reload();
};
const productStatus = computed(
  () => store.getters["StoreBlindBox/productStatus"]
);

const handleCloseBuyCbModal = () => {
  window.location.reload();
  // store.commit(
  //   "StoreBlindBox/CHANGE_BUY_CB_MODAL_STATUS",
  //   NFT_CONSTANTS.INIT_DIALOG_PARAMS
  // );
  // store.dispatch("StoreBlindBox/getOfferingAmount", {
  //   boxToken: state.blindBoxData.boxToken,
  //   type: "detail",
  // });
};

const handleSuccess = () => {
  router.push({
    name: "nftcollection",
    params: {
      tabIndex: 1,
    },
  });
};

const handleFailed = () => {
  window.location.reload();
};

const userAmount = computed(() => {
  return utilsNumber.formatNumberMeta(
    utilsFormat.formatBalance(state.balances[CONSTANTS_TOKENS.STC], 9),
    {
      precision: 0,
    }
  ).text;
});

const handleDialog = (type) => {
  store.commit(
    "StoreBlindBox/CHANGE_BUY_CB_MODAL_STATUS",
    NFT_CONSTANTS.INIT_DIALOG_PARAMS
  );
  if (type === "success") {
    router.push({
      name: "nftcollection",
      params: {
        tabIndex: 1,
      },
    });
  }
};

const totalCost = computed(() => {
  return utilsNumber
    .bigNum(state.blindBoxData.sellingPrice)
    .times(state.inputVal)
    .toString();
});

const formateDate = (obj) => {
  const { day, hour, minute, second } = obj;
  if (
    isUndefined(day) &&
    isUndefined(hour) &&
    isUndefined(minute) &&
    isUndefined(second)
  ) {
    // 倒计时结束。可以售卖
    return;
  }
  return `${day === 0 ? "" : `${day}D`} ${hour}:${minute}:${second}`;
};

const changeBuyModalStatus = (flag) => {
  store.commit("StoreBlindBox/CHANGE_BUY_MODAL_STATUS", flag);
  state.inputVal = 1;
  state.errors = [false, false];
  state.inputVal_isInteger = true;
};

const validateVal = () => {
  // if (utilsNumber.bigNum(val).gt(state.remainQuantity)) {
  //   state.errors[0] = true;
  //   return false;
  // }
  if (utilsNumber.bigNum(totalCost.value).gt(userAmount.value)) {
    state.errors[1] = true;
    return false;
  }
  return true;
};

const inputEvent = (e) => {
  state.inputVal = Number(e);
  state.inputVal_isInteger = true;
  state.errors = [false, false];
  validateVal(e);
};

const buyBlindBox = async () => {
  state.inputVal_isInteger = true;
  state.errors = [false, false];
  if (!utilsRegexp.isInteger(state.inputVal)) {
    state.inputVal_isInteger = false;
    return;
  }
  if (!validateVal(state.inputVal)) {
    return;
  }
  if (state.inputVal > 5) {
    state.errors[0] = true;
    return;
  }
  store.commit("StoreBlindBox/CHANGE_BUY_MODAL_STATUS", false);
  store.commit("StoreBlindBox/CHANGE_BUY_CB_MODAL_STATUS", {
    isShow: true,
  });
  store.dispatch("StoreBlindBox/buyBlindbox", {
    tyArgs: [state.blindBoxData.boxToken, state.blindBoxData.payToken],
    args: [String(state.inputVal)],
    boxToken: state.blindBoxData.boxToken,
  });
};

watch(
  () => state.blindBoxData && state.blindBoxData.sellingTime,
  () => {
    state.timer = setInterval(() => {
      state.sellingTime = formateDate(
        utilsDate.countdown(state.blindBoxData.sellingTime)
      );
      state.loaded = true;
    }, 1000);
  }
);

onBeforeMount(() => {
  const id = ref(route.params.id).value;
  if (id) {
    store.dispatch("StoreBlindBox/getOfferingBoxData", { id });
  }
});

onUnmounted(() => {
  store.commit(
    "StoreBlindBox/CHANGE_BUY_CB_MODAL_STATUS",
    NFT_CONSTANTS.INIT_DIALOG_PARAMS
  );
  store.commit("StoreBlindBox/SET_BLINDBOX_DATA", null);
  if (state.timer) {
    clearInterval(state.timer);
  }
});
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.loading-img {
  width: 140px;
  height: 140px;
}
.nft-blindbox-core {
  .nft-blindbox-core-header {
    display: flex;
    .nft-blindbox-core-header-left {
      background: #e8906c;
      width: 599px;
      height: 599px;
      border-radius: 14px;
      font-size: 0;
      overflow: hidden;
      // border-top: 48px solid #fff;
      // border-bottom: 48px solid #fff;
      // border-left: 24px solid #fff;
      // border-right: 24px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .nft-blindbox-core-header-right {
      width: 521px;
      color: #fafafa;
      margin-left: 80px;
      position: relative;
      .nft-blindbox-core-header-right-title {
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
      }
      .nft-blindbox-core-price-content {
        height: 39px;
        padding: 18px 0;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding-left: 16px;
      }
      .nft-blindbox-core-header-right-price {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 16px;
        span {
          display: block;
        }
        :first-child {
          font-size: 14px;
        }
      }
      .nft-blindbox-core-header-right-quantity {
        font-size: 18px;
        span {
          display: block;
        }
        :first-child {
          font-size: 14px;
        }
      }
      .nft-blindbox-core-header-right-button {
        width: 100%;
        height: 56px;
        line-height: 56px;
        padding: 0px;
        border-radius: 4px;
      }
      .nft-blindbox-core-header-right-button.light {
        background-color: transparent;
      }
    }
  }
  .nft-blindbox-core-introduces {
    color: $text-black-color;
    font-size: 14px;
    color: #ffffff;
    .nft-blindbox-core-introduces-title {
      font-size: 24px;
    }
  }

  .nft-blindbox-core-buycb-dialog {
    .nft-blindbox-core-buycb-dialog-text {
      margin-top: 10px;
      font-size: 16px;
      width: 400px;
    }
    .nft-blindbox-core-buycb-dialog-btn {
      width: 80%;
      margin-left: 10%;
      padding-left: 0px;
      padding-right: 0px;
    }
  }
}
.nft-blindbox-core-buy-dialog {
  ::v-deep(.fly-dialog-el) {
    width: 440px;
    height: 347px;
    background: linear-gradient(180deg, #454545 0%, #2d2d2d 100%);
    color: $white;
  }
  ::v-deep(.el-dialog__header) {
    padding: 32px 25px 24px 27px !important;
  }
  .nft-blindbox-core-buy-dialog-content {
    .fly-input-number {
      :v-deep(.el-input__inner) {
        background: rgba(255, 255, 255, 0.1) !important;
        color: $white;
      }
    }
  }

  .nft-blindbox-core-buy-dialog-content-details {
    text-align: right;
    span {
      display: block;
    }
    color: $white;
  }
  .nft-blindbox-core-buy-dialog-content-errors {
    margin-top: 3px;
    font-size: 12px;
    text-align: right;
    color: $text-error-color;
  }

  .nft-blindbox-core-buy-dialog-footer {
    display: flex;
    justify-content: space-between;
    .fly-button {
      width: 35%;
    }
  }
}
</style>
