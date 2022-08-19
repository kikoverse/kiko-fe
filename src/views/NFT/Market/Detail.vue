<template>
  <div class="market-detail" v-if="state.box_detail">
    <FlySpecialBg></FlySpecialBg>
    <fly-nft
      class="blind-box-container"
      coreType="card"
      :cardTypeParams="{ minHeight: '800px' }"
      :set="(detailData = state.box_detail)"
    >
      <template #nft-card>
        <detailCard
          :detailData="detailData"
          :action_type="state.action_type_UI"
          @actionsCall="actionsCall"
          :isNFT="state.blind_box_type !== 'box'"
          v-if="detailData"
          :isOnSell="detailData.onSell"
          :isOwner="isOwner(detailData.address)"
          cardType="market"
          :blind_box_type="state.blind_box_type"
          :occupations="state.occupations"
        ></detailCard>
        <fly-loading-fish v-else></fly-loading-fish>
      </template>
    </fly-nft>
    <div class="confirm-alert">
      <Fly-confirm
        :dialogVisible="state.quotation_show"
        :title="t('报价')"
        :isCustomContent="true"
        class="fly-refresh quotation-confirm"
        @handleClose="
          () => {
            state.quotation_show = false;
            state.quotation_inputVal = 1;
            state.quotation_error = [false, false, false];
            state.quotation_isInteger = true;
          }
        "
      >
        <template #core>
          <div class="hight-price-box">
            {{ t("最高出价") }}
            {{ utilsFormat.formatPrice(state.box_detail.topBidPrice) }}
            STC
          </div>
          <fly-space :size="24"></fly-space>
          <div class="quotation-input-box">
            <fly-input-number
              width="100%"
              :value="state.quotation_inputVal"
              @inputEvent="inputEvent"
              :max="999999999"
            ></fly-input-number>
            <fly-space :size="10"></fly-space>
            <div style="text-align: right; color: #fff" class="wallet-account">
              {{ t("钱包余额") + " : " + userAmount }}
              STC
            </div>
            <div v-if="!state.quotation_isInteger" class="error">
              *{{ $t("只能输入整数") }}
            </div>
            <div v-if="state.quotation_error[0]" class="error">
              *{{ $t("报价需大于当前最高出价") }}
            </div>
            <div v-if="state.quotation_error[1]" class="error">
              *{{ $t("可用金额不足") }}
            </div>
            <div v-if="state.quotation_error[2]" class="error">
              *{{ $t("报价需大于起拍价") }}
            </div>
          </div>
        </template>
        <template #footer>
          <fly-button
            @click="bidPrice"
            style="width: 100%; height: 59px; padding: 0; font-size: 14px"
            >{{ $t("确认") }}</fly-button
          >
        </template>
      </Fly-confirm>
      <!-- 修改报价 -->
      <Fly-confirm
        :dialogVisible="editState.edit_price_show"
        :title="t('修改售价')"
        :isCustomContent="true"
        class="fly-refresh quotation-confirm"
        @handleClose="
          () => {
            editState.edit_price_show = false;
            editState.edit_price_error = false;
            editState.edit_price_isInteger = true;
          }
        "
      >
        <template #core>
          <fly-space :size="24"></fly-space>
          <div class="quotation-input-box">
            <fly-input-number
              width="100%"
              :value="editState.edit_price_inputVal"
              @inputEvent="editInputEvent"
              :max="999999999"
            ></fly-input-number>
            <fly-space :size="10"></fly-space>
            <div style="text-align: right">
              {{ t("最高出价") }}
              {{
                (state.box_detail.topBidPrice &&
                  utilsFormat.formatPrice(state.box_detail.topBidPrice)) ||
                "0"
              }}
              STC
            </div>
            <div v-if="!editState.edit_price_isInteger" class="error">
              *{{ $t("只能输入整数") }}
            </div>

            <div v-if="editState.edit_price_error" class="error">
              *{{ $t("售价需大于当前最高出价") }}
            </div>
          </div>
        </template>
        <template #footer>
          <fly-button
            @click="changeBidPrice"
            type="dark"
            style="width: 100%; padding: 0; font-size: 14px"
            >{{ $t("确认") }}</fly-button
          >
        </template>
      </Fly-confirm>

      <!-- dialogVisible单独抽出来是因为该值为modelValue属性 -->
      <nft-dialog
        :dialogVisible="state.dialogEvent && state.dialogParams.isShow"
        :isShowClose="!(state.dialogParams.dialogStatus === 'ongoing')"
        :dialogParams="state.dialogParams"
        @handleClose="
          state.dialogEvent &&
            state.dialogEvent.handleClose(state.dialogParams.dialogStatus)
        "
        @handleSuccess="state.dialogEvent && state.dialogEvent.handleSuccess()"
        @handleFailed="state.dialogEvent && state.dialogEvent.handleFailed()"
      >
      </nft-dialog>

      <nft-second-dialog
        :dialogVisible="state.secondDialogParams.isShow"
        :dialogParams="state.secondDialogParams"
        @handleClose="secondDialogClose"
        @handleCancel="secondDialogClose"
        @handleConfirm="secondDialogConfirm"
      >
      </nft-second-dialog>

      <nft-sold-out-dialog
        :dialogVisible="state.soldDialogParams.isShow"
        :dialogParams="state.soldDialogParams"
        @handleClose="handleSoldOutFunc"
        @handleConfirm="handleSoldOutFunc"
      >
      </nft-sold-out-dialog>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import {
  reactive,
  onMounted,
  ref,
  computed,
  watchEffect,
  watch,
  onUnmounted,
} from "vue";
import { useNFT } from "../../../hooks/useNFT";
import NFT_CONSTANTS from "@constants/nft.js";
import FlyButton from "@FlyUI/FlyButton.vue";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import FlyConfirm from "@FlyUI/FlyConfirm";
import FlyInputNumber from "@FlyUI/FlyInutNumber.vue";
import utilsFormat from "@utils/format";
import utilsRegexp from "@utils/regexp";
import FlySpace from "@FlyUI/FlySpace.vue";
import FlyNft from "@FlyUI/FlyNFT.vue";
// import detailCard from "@components/NFT/DetailCard.vue";
import detailCard from "@components/NFT/Details.vue";
import NftDialog from "@components/NFT/NFTDialog.vue";
import NftSecondDialog from "@components/NFT/DetailsUI/NFTSecondDialog.vue";
import NftSoldOutDialog from "@components/NFT/NFTSoldOutDialog.vue";
import CONSTANTS_TOKENS from "@constants/token";
import utilsNumber from "@utils/number";
import { useRoute } from "vue-router";
import { dialogEventMaps } from "./dialog";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
// import { ElInputNumber } from "element-plus";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const route = useRoute();
import { useStore } from "vuex";
const store = useStore();

const num = ref(1);

let state = reactive({
  soldDialogParams: computed(() => store.state.StoreNftMarket.soldDialogParams),
  occupations: computed(() => store.state.StoreMeta.metaData?.occupations),
  quotation_show: false, // 报价弹窗
  quotation_error: [false, false, false],
  quotation_inputVal: 1,
  quotation_isInteger: true,
  balances: computed(() => store.state.StoreWallet.balances),
  id: "", // NFT的id
  groupId: "", // 盲盒id
  chainId: "",
  dialogEvent: null,
  dialogParams: computed(() => store.state.StoreNftMarket.dialogParams),
  secondDialogParams: NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS,
  secondDialogEvent: null,
  bidOfferPrice: null,
  blind_box_type: computed(() => {
    return ref(route.query.type).value;
  }), // 盲盒或是NFT
  blind_box_detail: computed(() => store.state.StoreNftMarket.blind_box_detail),
  nft_box_detail: computed(() => store.state.StoreNftMarket.nft_box_detail),
  // 盲盒详情
  box_detail: computed(() => {
    const type = ref(route.query.type).value;
    if (type === "box" && Object.keys(state.blind_box_detail).length > 0) {
      return Object.assign({}, store.state.StoreNftMarket.blind_box_detail, {
        editBidPrice: utilsFormat.formatPrice(
          store.state.StoreNftMarket.blind_box_detail?.topBidPrice
        ),
      });
    } else if (Object.keys(state.nft_box_detail).length > 0) {
      return Object.assign({}, store.state.StoreNftMarket.nft_box_detail, {
        editBidPrice: utilsFormat.formatPrice(
          store.state.StoreNftMarket.nft_box_detail?.topBidPrice
        ),
      });
    }
  }),

  action_type_UI: computed(() => {
    if (!state.box_detail.onSell) {
      return "SOLDOUT";
    } else {
      if (store.state.StoreWallet.accounts[0] === state.box_detail.owner) {
        return "OWNERSELL";
      } else {
        return "BUYERSELL";
      }
    }
  }), // 操作类型展示控制
  action_type: "", // 操作按钮类型, 用来判断展示弹窗
  contract_params: computed(() => {
    let contractType = state.blind_box_type == "box" ? "BLIND_BOX" : "NFT";
    let id =
      state.blind_box_type == "box"
        ? ref(route.query.chainId).value
        : state.box_detail.nftId;
    let codes =
      state.blind_box_type == "box"
        ? [state.box_detail.boxToken, state.box_detail.payToken]
        : [
            state.box_detail.nftMeta,
            state.box_detail.nftBody,
            state.box_detail.payToken,
          ];
    // let provider = store.state.StoreWallet.stcProvider;
    let offerPrice = 1;
    return { id, codes, contractType, offerPrice };
  }),
});

store.dispatch("StoreMeta/getNFTMeatInfo");

const editState = reactive({
  edit_price_inputVal: 1,
  edit_price_show: false, // 修改报价弹窗
  edit_price_error: false,
  edit_price_isInteger: true,
});

const isOwner = (address) =>
  computed(() => {
    if (store.state.StoreWallet.accounts?.[0]) {
      return address === store.state.StoreWallet.accounts?.[0];
    }
  });

const box_detail_nft = computed(() => {
  const type = ref(route.query.type).value;
  if (type === "box" && state.blind_box_detail) {
    return Object.assign({}, store.state.StoreNftMarket.blind_box_detail, {
      editBidPrice: utilsFormat.formatPrice(
        store.state.StoreNftMarket.blind_box_detail?.topBidPrice
      ),
    });
  } else if (state.nft_box_detail) {
    return Object.assign({}, store.state.StoreNftMarket.nft_box_detail, {
      editBidPrice: utilsFormat.formatPrice(
        store.state.StoreNftMarket.nft_box_detail?.topBidPrice
      ),
    });
  }
});
watchEffect(() => {
  if (state.box_detail && editState.edit_price_show) {
    editState.edit_price_inputVal = Number(
      utilsFormat.formatBalance(state.box_detail.sellingPrice || 0, 9)
    );
  }
});
onMounted(() => {
  state.id = ref(route.query.id).value;
  state.groupId = ref(route.query.groupId).value;
  state.chainId = ref(route.query.chainId).value;
  if (state.blind_box_type === "box") {
    // 请求盲盒详情
    store.dispatch("StoreNftMarket/queryBlindBoxDetail", {
      groupId: state.groupId,
      chainId: state.chainId,
    });
  } else {
    // 请求NFT详情
    store.dispatch("StoreNftMarket/queryNFTDetail", { id: state.id });
  }
});

onUnmounted(() => {
  state.bidOfferPrice = 0;
  store.commit("StoreNftMarket/BLIND_BOX_DETAIL", null);
  store.commit("StoreNftMarket/NFT_BOX_DETAIL", null);
});

const userAmount = computed(() => {
  return utilsNumber.formatNumberMeta(
    utilsFormat.formatBalance(state.balances[CONSTANTS_TOKENS.STC], 9),
    {
      precision: 0,
    }
  ).text;
});

const secondDialogConfirm = () => {
  if (!state.action_type) return;
  if (state.action_type === "BidPrice") {
    secondDialogClose();
    // state.dialogEvent = dialogEventMaps["Purchase"];
    // store.dispatch(
    //   "StoreNftMarket/purchaseFun",
    //   Object.assign({}, state.contract_params, {
    //     nftId: ref(route.query.id).value,
    //     groupId: ref(route.query.groupId).value,
    //     chainId: ref(route.query.chainId).value,
    //   })
    // );
    state.dialogEvent = dialogEventMaps["BidPrice"];
    store.dispatch(
      "StoreNftMarket/bidPrice",
      Object.assign({}, state.contract_params, {
        offerPrice: state.bidOfferPrice,
        nftId: ref(route.query.id).value,
        groupId: ref(route.query.groupId).value,
        chainId: ref(route.query.chainId).value,
      })
    );
  }
  if (state.action_type === "Purchase") {
    secondDialogClose();
    state.dialogEvent = dialogEventMaps["Purchase"];
    store.dispatch(
      "StoreNftMarket/purchaseFun",
      Object.assign({}, state.contract_params, {
        nftId: ref(route.query.id).value,
        groupId: ref(route.query.groupId).value,
        chainId: ref(route.query.chainId).value,
        sellType: state.box_detail.sellType,
      })
    );
  }
  if (state.action_type === "AcceptBid") {
    secondDialogClose();
    state.contract_params.id = state.chainId;
    state.dialogEvent = dialogEventMaps["AcceptBid"];
    let price = utilsFormat.formatPrice(state.box_detail.topBidPrice);
    const gap = 1 - NFT_CONSTANTS.NFT_GAS_FEE;
    price = utilsNumber.bigNum(price).times(gap).toString();
    store.dispatch(
      "StoreNftMarket/acceptPrice",
      Object.assign({}, state.contract_params, {
        price,
        currency: utilsFormat.getTokenCurrency(state.box_detail.payToken),
        nftId: ref(route.query.id).value,
        groupId: ref(route.query.groupId).value,
        chainId: ref(route.query.chainId).value,
      })
    );
  }
};

// 操作按钮事件
const actionsCall = (data) => {
  state.action_type = data.action;
  switch (data.action) {
    case "UpdateBid":
      editState.edit_price_show = true;
      break;
    case "Purchase":
      state.secondDialogParams = Object.assign(
        {},
        NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS,
        {
          isShow: true,
          imgUrl: state.box_detail.boxTokenLogo || state.box_detail.imageLink,
          text: t("市场买入", {
            price: utilsFormat.formatPrice(state.box_detail.sellingPrice),
            currency: utilsFormat.getTokenCurrency(state.box_detail.payToken),
          }),
        }
      );
      break;
    case "BidPrice":
      state.quotation_show = true;
      break;
    case "AcceptBid":
      // 调用接受报价的接口
      if (state.box_detail.topBidPrice) {
        const price = utilsFormat.formatPrice(state.box_detail.topBidPrice);
        const currency = utilsFormat.getTokenCurrency(
          state.box_detail.payToken
        );
        state.secondDialogParams = Object.assign(
          {},
          NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS,
          {
            isShow: true,
            imgUrl: state.box_detail.boxTokenLogo || state.box_detail.imageLink,
            text: t("确认报价", {
              price,
              currency,
            }),
            gasInfo: t("NFT手续费", {
              currency,
              gasAmount: utilsNumber
                .bigNum(price)
                .times(NFT_CONSTANTS.NFT_GAS_FEE)
                .toString(),
            }),
          }
        );
      }
      break;
    case "CancelSell":
      state.dialogEvent = dialogEventMaps["CancelSell"];
      state.contract_params.id = state.chainId;
      store.dispatch(
        "StoreNftMarket/cancelSell",
        Object.assign({}, state.contract_params, {
          nftId: ref(route.query.id).value,
          groupId: ref(route.query.groupId).value,
          chainId: ref(route.query.chainId).value,
        })
      );
      break;
    default:
      break;
  }
};

const checkValue = (value) => {
  state.quotation_error = [false, false, false];
  const topBidPrice = utilsNumber
    .bigNum(state.box_detail.topBidPrice)
    .div(Math.pow(10, 9))
    .toString();
  const sellingPrice = utilsNumber
    .bigNum(state.box_detail.sellingPrice)
    .div(Math.pow(10, 9))
    .toString();
  if (utilsNumber.bigNum(topBidPrice).gt(0)) {
    // 小于报价错误
    if (utilsNumber.bigNum(value).lte(topBidPrice)) {
      state.quotation_error = [true, false, false];
      return false;
    }
    // 大于可用金额错误
    if (utilsNumber.bigNum(value).gt(userAmount.value)) {
      state.quotation_error = [false, true, false];
      return false;
    }
    return true;
  }
  // 等于起拍价错误
  else if (utilsNumber.bigNum(value).lte(sellingPrice)) {
    state.quotation_error = [false, false, true];
    return false;
  } else {
    return true;
  }
};
const inputEvent = (e) => {
  state.quotation_isInteger = true;
  state.quotation_error = [false, false, false];
  state.quotation_inputVal = Number(e);
};

const checkEditValue = (value) => {
  if (
    utilsNumber
      .bigNum(value)
      .lte(
        utilsNumber.bigNum(state.box_detail.topBidPrice).div(Math.pow(10, 9))
      )
  ) {
    editState.edit_price_error = true;
    return false;
  }
  return true;
};

const editInputEvent = (e) => {
  editState.edit_price_isInteger = true;
  editState.edit_price_error = false;
  editState.edit_price_inputVal = Number(e);
};

const changeBidPrice = () => {
  editState.edit_price_isInteger = true;
  editState.edit_price_error = false;
  const isInteger = utilsRegexp.isInteger(editState.edit_price_inputVal);
  if (!isInteger) {
    editState.edit_price_isInteger = false;
    return;
  }
  if (state.action_type_UI === "OWNERSELL") {
    state.action_type = "UpdateBid";
    if (checkEditValue(editState.edit_price_inputVal)) {
      editState.edit_price_show = false;
      state.dialogEvent = dialogEventMaps["UpdateBid"];
      store.dispatch(
        "StoreNftMarket/updatePrice",
        Object.assign({}, state.contract_params, {
          newPrice: editState.edit_price_inputVal,
          nftId: ref(route.query.id).value,
          groupId: ref(route.query.groupId).value,
          chainId: ref(route.query.chainId).value,
        })
      );
      state.action_type = "";
    }
  }
};
const bidPrice = () => {
  const isInteger = utilsRegexp.isInteger(state.quotation_inputVal);
  if (!isInteger) {
    state.quotation_isInteger = false;
    return;
  }
  state.quotation_error = [false, false, false];
  if (state.quotation_inputVal)
    // state.quotation_inputVal = 1;
    state.action_type = "BidPrice";
  if (checkValue(state.quotation_inputVal)) {
    const sellPrice = utilsNumber
      .bigNum(state.box_detail.sellingPrice)
      .div(Math.pow(10, 9))
      .toString();
    state.bidOfferPrice = state.quotation_inputVal;
    state.quotation_show = false;
    setTimeout(() => state.quotation_inputVal, 1000);
    state.dialogEvent = dialogEventMaps["BidPrice"];
    store.dispatch(
      "StoreNftMarket/bidPrice",
      Object.assign({}, state.contract_params, {
        offerPrice: state.bidOfferPrice,
        nftId: ref(route.query.id).value,
        boxToken: state.box_detail.boxToken,
        payToken: state.box_detail.payToken,
        groupId: ref(route.query.groupId).value,
        chainId: ref(route.query.chainId).value,
      })
    );
    // 弃用原出价逻辑
    // if (utilsNumber.bigNum(state.bidOfferPrice).gte(sellPrice)) {
    //   state.secondDialogParams = Object.assign(
    //     {},
    //     NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS,
    //     {
    //       isShow: true,
    //       imgUrl: state.box_detail.boxTokenLogo || state.box_detail.imageLink,
    //       text: t("市场买入", {
    //         price: sellPrice,
    //         currency: utilsFormat.getTokenCurrency(state.box_detail.payToken),
    //       }),
    //     }
    //   );
    // } else {
    //   state.dialogEvent = dialogEventMaps["BidPrice"];
    //   store.dispatch(
    //     "StoreNftMarket/bidPrice",
    //     Object.assign({}, state.contract_params, {
    //       offerPrice: state.bidOfferPrice,
    //       nftId: ref(route.query.id).value,
    //       groupId: ref(route.query.groupId).value,
    //       chainId: ref(route.query.chainId).value,
    //     })
    //   );
    // }
  }
};

const secondDialogClose = () => {
  state.secondDialogParams = NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS;
};

const handleSoldOutFunc = () => {
  window.location.reload();
};
</script>
<style lang="scss" scoped>
.blind-box-container {
  margin: 0 auto;
  padding-bottom: 30px;
}
.error {
  text-align: right;
  margin-top: 3px;
  font-size: 12px;
  color: #f36346;
}
.quotation-confirm {
  ::v-deep(.el-dialog) {
    width: 440px;
    height: 363px;
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
    color: $white;
  }
  .hight-price-box {
    color: $white;
  }
}
</style>
