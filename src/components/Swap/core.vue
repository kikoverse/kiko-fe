<template>
  <div
    class="swap-content"
    :set="
      ((A = formatFrom(
        state.walletStatus,
        state.from.currency,
        state.from.token
      )),
      (B = formatTo(state.walletStatus, state.to.currency, state.to.token)))
    "
  >
    <div class="swap-content-header">
      <div class="swap-content-header-left">
        <p>{{ $t("兑换") }}</p>
        <p>{{ $t("即时兑换代币") }}</p>
      </div>
      <div class="swap-content-header-right">
        <svg-icon
          name="f-setting"
          @click="showDialog('isShowSettingDialog')"
        ></svg-icon>
        <svg-icon
          name="f-record"
          @click="showDialog('isShowHistoryDialog')"
        ></svg-icon>
      </div>
    </div>
    <Fly-space :size="20"></Fly-space>
    <div class="swap-content-core">
      <div class="swap-content-cote-box">
        <div class="swap-content-core-item form">
          <div class="swap-content-core-item-main">
            <Fly-input
              class="swap-content-core-item-main-input"
              placeholder="0.0"
              :value="state.from.inputVal"
              :max="A.disPlayBalance"
              :precision="state.from.exchangePrecision"
              @inputEvent="inputEvent($event, 'from')"
            ></Fly-input>

            <div>
              <div
                class="swap-content-core-item-main-currencyselect"
                @click="showCurrencyListDialog('from')"
              >
                <img v-if="state.from.icon" :src="state.from.icon" />
                <span>
                  {{ A.disPlayCurrency || "STC" }}
                </span>
              </div>
              <div class="swap-content-core-item-right">
                <span
                  v-if="A.disPlayBalance"
                  class="swap-content-core-item-disPlayBalance"
                >
                  {{ $t("余额") }}: {{ A.disPlayBalance }}
                </span>
                <span
                  class="swap-content-core-item-main-max"
                  v-if="
                    state.walletStatus === 'connected' && state.from.currency
                  "
                  @click="setToInputValueMax('from', A.disPlayBalance)"
                >
                  MAX
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="change-content">
          <svg-icon
            name="f-updown"
            @click="transfromCurrencySelect(true)"
          ></svg-icon>
        </div>
        <div class="swap-content-core-item to">
          <div class="swap-content-core-item-main">
            <Fly-input
              class="swap-content-core-item-main-input"
              :value="state.to.inputVal"
              :max="B.disPlayBalance"
              :precision="state.to.exchangePrecision"
              placeholder="0.0"
              @inputEvent="inputEvent($event, 'to')"
            ></Fly-input>
            <div>
              <div
                class="swap-content-core-item-main-currencyselect"
                @click="showCurrencyListDialog('to')"
              >
                <img v-if="state.to.icon" :src="state.to.icon" />
                <span>
                  {{ B.disPlayCurrency }}
                </span>
              </div>
              <div class="swap-content-core-item-right">
                <span
                  v-if="B.disPlayBalance"
                  class="swap-content-core-item-disPlayBalance"
                >
                  {{ $t("余额") }}: {{ B.disPlayBalance }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Fly-space :size="20"></Fly-space>
      <div class="swap-content-core-detail">
        <div
          class="swap-content-core-detail-price"
          v-if="state.swapCalcalatorData"
        >
          <span>{{ $t("价格") }}</span>
          <span>{{ state.swapCalcalatorData.priceFormatStr }}</span>
          <!-- <span>{{ renderDisplayPriceStr }}</span> -->
        </div>
        <Fly-space :size="10"></Fly-space>
        <div
          class="swap-content-core-detail-slippage"
          v-if="state.settings && state.settings.slippageTolerance"
        >
          <span
            >{{ $t("滑点容差") }}
            <Fly-tool-tip
              :placeString="
                $t(
                  '较高的滑点容差有助于交易成功。设置完成后，如果兑换率变动超过此百分比，则此次交易不会被执行。'
                )
              "
              placement="right"
              svgName="f-question"
              :svgStyle="{
                'margin-right': '3px',
              }"
            >
            </Fly-tool-tip>
          </span>

          <span>{{ `${state.settings.slippageTolerance}%` }}</span>
        </div>
      </div>
      <Fly-space :size="30"></Fly-space>
      <div class="swap-content-core-btn">
        <Fly-button
          v-if="state.walletStatus === 'unConnected'"
          @click="connectWallet"
        >
          {{ $t("连接钱包") }}
        </Fly-button>
        <div v-else>
          <Fly-button :type="btnStatus.type" @click="swapFunc(btnStatus)">{{
            btnStatus.text
          }}</Fly-button>
        </div>
      </div>
    </div>
    <Fly-wallet-dialog
      :dialogParams="dialogSetting"
      @handleFailed="handleSucceed"
      @handleClose="handleSucceed"
      @handleSucceed="handleSucceed"
    >
    </Fly-wallet-dialog>
    <history-record
      :dialogVisible="state.isShowHistoryDialog"
      :historyType="'swap'"
      @handleClose="handleClose('isShowHistoryDialog')"
    />
    <search-currency
      :dialogVisible="state.isShowSearchDialog"
      :currencyList="state.currencyList"
      @handleClose="handleClose('isShowSearchDialog')"
      @handleSelect="handleSelectCurrency"
    ></search-currency>
    <!-- <setting-dialog
      :dialogVisible="state.isShowSettingDialog"
      @handleClose="handleClose('isShowSettingDialog')"
    ></setting-dialog> -->
  </div>
</template>
<script setup>
import { computed, reactive, watch, onUnmounted, onMounted } from "vue";
import FlyWalletDialog from "@FlyUI/FlyWalletDialog.vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlyButton from "@FlyUI/FlyButton.vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import FlyToolTip from "@FlyUI/FlyToolTip.vue";
import { useStore } from "vuex";
import FlyInput from "@FlyUI/FlyInput";
// import TransactionDialog from "@components/TransactionDialog.vue";
import utilsNumber from "@utils/number";
import SearchCurrency from "../SearchCurrency";
import HistoryRecord from "../HistoryRecord.vue";
import { useI18n } from "vue-i18n"; //要在js中使用国际化
import { debounce } from "lodash";
import connectLogic from "@hooks/useMyWallet";
import utilsTool from "@utils/tool.js";
const { t } = useI18n();
const store = useStore();
import Wallet from "../../wallet/index";

import { WALLET_DIALOG_PARAMS } from "@constants/dialog.js";
// import SettingDialog from "../SettingDialog.vue";
// import commonApi from "@api/common";
// import { ElTooltip } from "element-plus";

const { connectWallet } = connectLogic(store);
let state = reactive({
  from: computed(() => store.state.StoreSwap.from),
  to: computed(() => store.state.StoreSwap.to),
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  focusType: computed(() => store.state.StoreSwap.focusType),
  dialogVisible: false,
  balances: computed(() => store.state.StoreWallet.balances),
  settings: computed(() => store.state.StoreApp.settings),
  swapCalcalatorData: computed(() => store.state.StoreSwap.swapCalcalatorData),
  isShowSearchDialog: false, // 是否出现币种弹窗
  currencySelectType: null,
  isShowHistoryDialog: false,
  isShowSettingDialog: false,
  isShowConfirm: computed(() => store.state.StoreSwap.isShowConfirm),
  poolType: computed(() => store.state.StoreSwap.poolType),
  accounts: computed(() => store.state.StoreWallet.accounts),
  defaultItem: computed(() => store.state.StoreCommon.defaultCurrencyItem),
  addTimer: null,
  totalSwapList: computed(() => store.state.StoreSwap.totalSwapList),
  currencyList: computed(() => store.state.StoreCommon.currencyList),
});

const formatFrom = computed(() => store.getters["StoreSwap/formatFrom"]);
const formatTo = computed(() => store.getters["StoreSwap/formatTo"]);

const setToInputValueMax = (type, value) => {
  if (value && utilsNumber.bigNum(value).gt(0)) {
    store.commit("StoreSwap/CHANGE_INPUTVALUE", {
      value: value,
      type,
      automatic: false,
    });
  }
  store.dispatch("StoreSwap/transfromCurrencySelect", {
    isTransfer: false,
    focusType: "from",
  });
};

const btnStatus = computed(() => {
  //币种信息inputVal即可
  if (!state.from.currency || !state.to.currency) {
    return { type: "disabled", text: t("请选择币种") };
  }
  if (state.from.currency && state.to.currency) {
    if (
      !utilsNumber.bigNum(state.from.inputVal).gt(0) &&
      !utilsNumber.bigNum(state.to.inputVal).gt(0)
    ) {
      return { type: "disabled", text: t("请输入数量") };
    }
    if (
      state.focusType &&
      !utilsNumber
        .bigNum(state[state.focusType === "from" ? "to" : "from"].inputVal)
        .gt(0)
    ) {
      return { type: "disabled", text: t("流动性不足") };
    }
  }
  const isGtFrom = utilsNumber
    .bigNum(state.from.inputVal)
    .gt(state.from.balance);
  const isGtTo = utilsNumber.bigNum(state.to.inputVal).gt(state.to.balance);
  if (isGtFrom || isGtTo) {
    return {
      type: "disabled",
      text: t("token余额不足", {
        currency: isGtFrom ? state.from.currency : state.to.currency,
      }),
    };
  }
  // 是否有流动池
  return {
    type: "normal",
    text: t("兑换"),
    isClick: true,
  };
});

const transfromCurrencySelect = (isTransfer) => {
  store.dispatch("StoreSwap/transfromCurrencySelect", {
    focusType: state.focusType,
    isTransfer: isTransfer,
  });
};

const debounceFunc = debounce(
  () => {
    store.dispatch("StoreSwap/transfromCurrencySelect", {
      focusType: state.focusType,
      isTransfer: false,
    });
  },
  500,
  {
    leading: true,
  }
);

onMounted(async () => {
  state.addTimer = setInterval(() => {
    if (state.from.inputVal || state.to.inputVal) {
      transfromCurrencySelect(false);
    }
  }, 5000);
  if (state.currencyList && state.currencyList.length === 0) {
    const data = await store.dispatch("StoreCommon/getCurrencyList");
    if (data && data.length) {
      setDefaultCurrency(data);
    }
  } else {
    setDefaultCurrency(state.currencyList);
  }
});

const setDefaultCurrency = (data) => {
  let item = data.filter((i) => i.shortName === "STC")[0];
  handleSelectCurrency(item);
};

const inputEvent = (val, type) => {
  // 币种选择时候也要去检查是否可以获取计算数据
  store.commit("StoreSwap/CHANGE_INPUTVALUE", {
    value: val,
    type,
    automatic: false,
  });

  if (state.to.currency && state.from.currency) {
    state.focusType = type;
    debounceFunc();
  }
};

const getBalance = async () => {
  let wallet = reactive({
    accounts: computed(() => store.state.StoreWallet.accounts),
    provider: computed(() => store.state.StoreWallet.stcProvider),
  });
  if (state.from.currency && state.from.token) {
    let balance = await Wallet.getAccountBalance({
      provider: wallet.provider,
      account: wallet.accounts[0],
      token: state.from.token,
    });
    store.commit("StoreWallet/SET_WALLET_BALANCE", {
      [state.from.currency]: balance,
    });
  }
  if (state.to.currency && state.to.token) {
    let balance = await Wallet.getAccountBalance({
      provider: wallet.provider,
      account: wallet.accounts[0],
      token: state.to.token,
    });
    store.commit("StoreWallet/SET_WALLET_BALANCE", {
      [state.to.currency]: balance,
    });
  }
};

watch(
  () => state.walletStatus,
  (n) => {
    if (n === "connected") {
      getBalance();
    }
  }
);

const showDialog = (type) => {
  state[type] = true;
  if (type === "isShowHistoryDialog") {
    if (state.totalSwapList.length === 0) {
      store.dispatch("StoreSwap/getExchangeHistoryList", {
        userAddress: state.accounts[0],
        pageSize: 6,
        nextId: 0,
      });
    }
  } else {
    store.commit("StoreApp/CHANGE_SETTING_VISIBLE", true);
  }
};
const handleClose = (type) => {
  state[type] = false;
  if (type === "isShowConfirm") {
    store.commit("StoreSwap/CHANGE_CONFIRM_VISIBLE", false);
  }
};

// const handleConfirm = () => {
//   store.commit("StoreSwap/CHANGE_CONFIRM_VISIBLE", false);
// };

const showCurrencyListDialog = (type) => {
  state.isShowSearchDialog = true;
  state.currencySelectType = type;
};

const handleSelectCurrency = (item) => {
  const { shortName, icon, address, exchangePrecision, displayPrecision } =
    item;
  const params = Object.assign(
    {},
    {
      currency: shortName,
      icon,
      token: address,
      exchangePrecision,
      displayPrecision,
      address: address,
    },
    { type: state.currencySelectType ? state.currencySelectType : "from" }
  );
  store.dispatch("StoreSwap/setSelectCurrencyInfo", params);
  state.isShowSearchDialog = false;
  state.currencySelectType = null;
};
const changeAmountScale = (value, scale) => {
  return utilsNumber.formatNumberMeta(
    utilsNumber.bigNum(value).times(Math.pow(10, scale)).toString(),
    { precision: 0, round: "floor" }
  ).text;
};

const dialogSetting = reactive({
  ...WALLET_DIALOG_PARAMS,
  dialogText: `正在兑换`, // 购买中等
  successText: `兑换成功`,
  failedText: `兑换失败`,
  isShowClose: false,
});
const handleSucceed = () => {
  window.location.reload();
};
const swapFunc = async (status) => {
  if (status.isClick) {
    dialogSetting.dialogVisible = true;
    dialogSetting.dialogStatus = "ongoing";
    let wallet = reactive({
      provider: computed(() => store.state.StoreWallet.stcProvider),
    });
    let amount;
    if (state.focusType === "from") {
      amount = [
        changeAmountScale(state.from.inputVal, state.from.exchangePrecision),
        changeAmountScale(
          state.swapCalcalatorData.minReceived,
          state.to.exchangePrecision
        ),
      ];
    } else if (state.focusType === "to") {
      amount = [
        changeAmountScale(
          state.swapCalcalatorData.maxSold,
          state.from.exchangePrecision
        ),
        changeAmountScale(state.to.inputVal, state.to.exchangePrecision),
      ];
    }
    try {
      const params = {
        provider: wallet.provider,
        tokenCode: state.swapCalcalatorData.fullPath,
        amount,
        focusType: state.focusType,
      };

      const hash = await Wallet.swapToken(params);
      if (hash) {
        dialogSetting.phase1 = "succeed";
        let res = await utilsTool.getChainTransactionInfo({ txnHash: hash });
        if (res?.status === "Executed") {
          dialogSetting.phase2 = "succeed";
          setTimeout(() => {
            dialogSetting.isShowClose = true;
            dialogSetting.dialogStatus = "succeed";
          }, 1500);
        }
      } else {
        dialogSetting.isShowClose = true;
        dialogSetting.dialogStatus = "failed";
      }
    } catch (error) {
      dialogSetting.isShowClose = true;
      dialogSetting.dialogStatus = "failed";
    }
  }
};
onUnmounted(() => {
  store.commit("StoreSwap/CLEAR_SWAP_DATA");
  clearInterval(state.addTimer);
});
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/mixin.scss";
.confirm-btn {
  width: 100%;
  padding: 15px 0px;
  font-weight: bold;
  font-size: 16px;
}
.swap-content {
  width: 100%;
  color: $text-white-color;
  .swap-content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .swap-content-header-left {
      p:first-child {
        font-size: 20px;
        font-weight: bold;
      }
      p:last-child {
        margin-top: 5px;
        font-size: 14px;
      }
    }
    .swap-content-header-right {
      .svg-icon {
        width: 18px;
        height: 18px;
        color: $text-white-color;
      }
      .svg-icon:last-child {
        margin-left: 26px;
      }
    }
  }
  .swap-content-core {
    .change-content {
      text-align: center;
    }
    .swap-content-cote-box {
      background: #464646;
      border-radius: 8px;
    }
    .swap-content-core-item {
      height: 81px;
      padding: 10px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      border-radius: 19px;
      .swap-content-core-item-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;

        .swap-content-core-item-main-input {
          ::v-deep(.el-input__inner) {
            border: none;
            color: $text-gray3-color;
            background: none;
            font-size: 24px;
            outline: none;
          }
          width: 230px;
        }
        .swap-content-core-item-main-max {
          color: $text-orange-color2;
          font-size: 12px;
          margin-left: 6px;
          cursor: pointer;
        }
        .swap-content-core-item-right {
          text-align: right;
          white-space: nowrap;
        }
        .swap-content-core-item-disPlayBalance {
          font-size: 12px;
          color: $text-white-color;
        }
        .swap-content-core-item-main-currencyselect {
          margin-left: auto;
          width: 120px;
          padding: 4px;
          display: flex;
          align-items: center;
          background: #585858;
          color: $text-white-color;
          border-radius: 8px;
          &:hover {
            opacity: 0.6;
            cursor: pointer;
          }
          img {
            border-radius: 50%;
            width: 24px;
            height: 24px;
          }
          span {
            text-align: right;
            font-size: 20px;
            display: inline-block;
            padding-left: 3px;
            min-width: 80px;
            max-width: 140px;
            font-weight: bold;
            @include textOverflow();
          }
        }
      }
    }
    .swap-content-core-detail {
      padding: 0px 16px;
      .swap-content-core-detail-price {
        display: flex;
        align-items: center;
        justify-content: space-around;
        span {
          display: inline-block;
          flex: 1;
          font-size: 14px;
          // text-align: left;
        }
        span:nth-child(2) {
          flex: 4;
        }
        span:last-child {
          text-align: right;
        }
      }
      .swap-content-core-detail-slippage {
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 14px;
        }
      }
    }
    .swap-content-core-btn {
      .fly-button {
        width: 100%;
        padding: 15px 0px;
      }
    }
  }
}
</style>
