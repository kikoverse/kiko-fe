<template>
  <div class="list">
    <FlySpecialBg></FlySpecialBg>
    <fly-nft
      class="blind-box-container"
      coreType="list"
      v-if="state.walletStatus === 'connected'"
    >
      <template #nft-header>
        <list-screen
          :isShowOpenStatus="
            state.collectionActiveTab === 1 || state.collectionActiveTab === 2
          "
          :showTips="
            state.collectionActiveTab === 1 || state.collectionActiveTab === 2
          "
          :isShowCollection="true"
          @changeTab="changeTab"
          :tabList="tab_list"
          @clickRadio="clickRadio"
          v-if="tab_list && tab_list.length"
          :collectionActiveTab="state.collectionActiveTab"
        ></list-screen>
      </template>
      <template #nft-list>
        <div class="list-box">
          <myCollections
            v-if="state.collectionActiveTab === 0"
            @pushMarket="pushMarket"
            @watchDetail="watchDetail"
            @actionsCall="actionsCall"
          ></myCollections>
          <unsold
            v-if="state.collectionActiveTab === 1"
            @pushMarket="pushMarket"
            @watchDetail="watchDetail"
            @actionsCall="actionsCall"
          ></unsold>
          <sell
            v-if="state.collectionActiveTab === 2"
            @pushMarket="pushMarket"
            @watchDetail="watchDetail"
            @actionsCall="actionsCall"
          ></sell>
          <purchase-record
            v-if="state.collectionActiveTab === 3"
            @pushMarket="pushMarket"
            @watchDetail="watchDetail"
          ></purchase-record>
          <sell-record
            v-if="state.collectionActiveTab === 4"
            @pushMarket="pushMarket"
            @watchDetail="watchDetail"
          ></sell-record>
        </div>
      </template>
    </fly-nft>
    <fly-nft
      class="blind-box-container"
      v-if="state.walletStatus !== 'connected'"
    >
      <template #nft-no-data>
        <nft-no-connected-wallet class="no-data"></nft-no-connected-wallet>
      </template>
    </fly-nft>
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
      @handleClose="handleSoldOutCloseFunc"
      @handleConfirm="handleSoldOutConfirmFunc"
    >
    </nft-sold-out-dialog>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, onUnmounted, watch, ref } from "vue";
import FlyNft from "@FlyUI/FlyNFT.vue";
import NftNoConnectedWallet from "@components/NFT/NFTNoConnectedWallet.vue";
import ListScreen from "@components/NFT/ListScreen.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import utilsFormat from "@utils/format";
import utilsNumber from "@utils/number";
import NftDialog from "@components/NFT/NFTDialog.vue";
import NftSecondDialog from "@components/NFT/DetailsUI/NFTSecondDialog.vue";
import NftSoldOutDialog from "@components/NFT/NFTSoldOutDialog.vue";
import unsold from "@components/NFT/Collection/unsold.vue";
import myCollections from "@components/NFT/Collection/myCollections.vue";
import sell from "@components/NFT/Collection/sell.vue";
import sellRecord from "@components/NFT/Collection/sellRecord.vue";
import purchaseRecord from "@components/NFT/Collection/purchaseRecord.vue";
import { dialogEventMaps } from "./dialog";
import NFT_CONSTANTS from "@constants/nft.js";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
import qs from "qs";
const { t } = useI18n();
const store = useStore();
const router = useRouter();
let state = reactive({
  coreType: "list",
  collectionActiveTab: 1,
  tabIndex: 1,
  baseData: null,
  UserAddress: computed(() => store.state.StoreWallet.accounts),
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  loading: computed(() => store.state.StoreCollection.loading),
  purchaseData: computed(() => store.state.StoreCollection.purchaseData),
  sellRecordData: computed(() => store.state.StoreCollection.sellRecordData),
  secondDialogParams: computed(
    () => store.state.StoreCollection.secondDialogParams
  ),
  dialogParams: computed(() => store.state.StoreCollection.dialogParams),
  soldDialogParams: computed(
    () => store.state.StoreCollection.soldDialogParams
  ),
  dialogEvent: null,
});

const handleSoldOutCloseFunc = () => {
  window.location.reload();
};

const handleSoldOutConfirmFunc = () => {
  window.location.reload();
};

// 二次弹窗
const secondDialogClose = () => {
  store.commit(
    "StoreCollection/CHANGE_SECOND_DIALOG_STATUS",
    NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS
  );
};

const secondDialogConfirm = () => {
  let params = {};
  let price = utilsFormat.formatPrice(state.baseData.offerPrice, 9);
  const gap = 1 - NFT_CONSTANTS.NFT_GAS_FEE;
  price = utilsNumber.bigNum(price).times(gap).toString();
  const currency = utilsFormat.getTokenCurrency(state.baseData.payToken);
  if (state.baseData.type === "box") {
    params = {
      tyArgs: [state.baseData.boxToken, state.baseData.payToken],
      args: [String(state.baseData.chainId)],
      type: "box",
      groupId: state.baseData.groupId,
      chainId: state.baseData.chainId,
    };
  } else {
    params = {
      tyArgs: [
        state.baseData.nftMeta,
        state.baseData.nftBody,
        state.baseData.payToken,
      ],
      args: [String(state.baseData.chainId)],
      type: "nft",
      infoId: state.baseData.nftBoxId,
    };
  }
  state.dialogEvent = dialogEventMaps["AcceptBid"];
  secondDialogClose();
  store.dispatch(
    "StoreCollection/acceptBidContractsCall",
    Object.assign({}, params, {
      price,
      currency,
    })
  );
};

const pushMarket = () => {
  router.push({
    path: "/nftmarket",
  });
};
const actionsCall = async ({ action, baseData }) => {
  state.baseData = baseData;
  if (action === "CancelSell") {
    state.dialogEvent = dialogEventMaps["CancelSell"];
    let params = {};
    if (baseData.type === "box") {
      params = {
        tyArgs: [baseData.boxToken, baseData.payToken],
        args: [String(baseData.chainId)],
        type: "box",
        groupId: baseData.groupId,
        chainId: baseData.chainId,
      };
    } else {
      params = {
        type: "nft",
        tyArgs: [baseData.nftMeta, baseData.nftBody, baseData.payToken],
        args: [String(baseData.chainId)],
        infoId: baseData.nftBoxId,
      };
    }
    store.dispatch("StoreCollection/cancelSellContractsCall", params);
  }
  if (action === "AcceptBid") {
    const price = utilsFormat.formatPrice(baseData.offerPrice, 9);
    const currency = utilsFormat.getTokenCurrency(baseData.payToken);
    store.commit("StoreCollection/CHANGE_SECOND_DIALOG_STATUS", {
      isShow: true,
      imgUrl: baseData.icon,
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
    });
  }
};

const tab_list = computed(() => store.getters["StoreCollection/tab_list"]);

onUnmounted(() => {
  clearData();
});

const loadData = () => {
  const params = ref(router.currentRoute).value.params;
  if (!params.tabIndex) {
    return;
  }
  const tabIndex = Number(params.tabIndex);
  state.collectionActiveTab = tabIndex;
  if (state.UserAddress && state.UserAddress[0]) {
    if (tabIndex === 1) {
      // store.dispatch("StoreCollection/groupList", state.UserAddress[0]);
      store.dispatch("StoreCollection/getUnSellingData", state.UserAddress[0]);
    }
    if (tabIndex === 2) {
      // store.dispatch("StoreCollection/groupList", state.UserAddress[0]);
      store.dispatch("StoreCollection/getSellingData", state.UserAddress[0]);
    }
    if (tabIndex === 3) {
      store.dispatch("StoreCollection/getPurchaseHistory", {
        address: state.UserAddress[0],
        type: "change",
      });
    }
    if (tabIndex === 4) {
      store.dispatch("StoreCollection/getSalesHistory", {
        address: state.UserAddress[0],
        type: "change",
      });
    }
  }
};
watch(
  () => state.UserAddress,
  (n, o) => {
    // if (n !== o) {
    //   clearData();
    // }
    if (n && n[0] && n !== o) {
      loadData();
    }
  }
);
onMounted(() => {
  clearData();
  loadData();
});

const clearData = () => {
  store.commit("StoreCollection/SET_LOADING_STATUS", true);
  store.commit("StoreCollection/SET_DETAIL_TYPE", null);
  store.commit("StoreCollection/SET_DETAIL_INFO", null);
  store.commit("StoreCollection/SET_SHOW_RULES", [true, true]);
  store.commit("StoreCollection/SET_UNSOLD_BOX_DATA", []);
  store.commit("StoreCollection/SET_UNSOLD_NFT_DATA", []);
  store.commit("StoreCollection/SET_SELLING_DATA", []);
  store.commit(
    "StoreCollection/CHANGE_SECOND_DIALOG_STATUS",
    NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS
  );
  store.commit(
    "StoreCollection/CHANGE_DIALOG_STATUS",
    NFT_CONSTANTS.INIT_DIALOG_PARAMS
  );
  state.dialogEvent = null;
};

const isNFT = (type) => NFT_CONSTANTS.NFT_TYPES.indexOf(type) > -1;

const watchDetail = (d, sellType, account) => {
  state.coreType = "card";
  debugger;
  if (sellType === "unsold") {
    let query = {};
    if (isNFT(d.type)) {
      query = {
        id: d.id,
        sellType,
        nftId: d.nftId,
        nftMeta: d.nftMeta,
        nftBody: d.nftBody,

        // payToken: d.payToken,
      };
    } else {
      query = {
        id: d.id,
        sellType,
        boxToken: d.boxToken,
        account: account,
        // payToken: d.payToken,
      };
    }
    console.log("query", query);
    const url = qs.stringify(query);
    console.log("url", url);
    window.open(
      `${window.location.origin}/nftcollectiondetail?${url}`,
      "_blank"
    );
    // router.push({
    //   path: "/nftcollectiondetail",
    //   query,
    // });
  }
  if (sellType === "selling") {
    let query = {};
    if (isNFT(d.type)) {
      query = {
        sellType,
        infoId: d.nftBoxId,
      };
    }
    if (d.type === "box") {
      query = {
        sellType,
        groupId: d.groupId,
        chainId: d.chainId,
        account: account,
      };
    }
    const url = qs.stringify(query);
    window.open(
      `${window.location.origin}/nftcollectiondetail?${url}`,
      "_blank"
    );
    // router.push({
    //   path: "/nftcollectiondetail",
    //   query,
    // });
  }
};
const changeTab = (i) => {
  router.push({
    params: {
      tabIndex: i,
    },
  });
};
const clickRadio = (data) => {
  const rules = data.map((d) => d.isOpen);
  store.commit("StoreCollection/SET_SHOW_RULES", rules);
};
</script>

<style lang="scss" scoped>
.blind-box-container {
  margin: 0 auto;
  padding-bottom: 30px;
}
.list-box {
  width: 1200px;
  padding: 60px 0;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  // :nth-child(4n) {
  //   // margin-right: 0;
  // }
}
</style>
