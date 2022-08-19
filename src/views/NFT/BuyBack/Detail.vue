<template>
  <div class="buy-back-detail">
    <FlySpecialBg></FlySpecialBg>
    <fly-nft
      class="blind-box-container"
      coreType="card"
      :cardTypeParams="{ minHeight: '800px' }"
    >
      <template #nft-card>
        <detailCard
          v-if="state.buyBackDetail"
          :detailData="state.buyBackDetail"
          :action_type="'RECOVERY'"
          :blind_box_type="'nft'"
          :isNFT="true"
          @actionsCall="actionsCall"
        ></detailCard>
        <fly-loading-fish v-else></fly-loading-fish>
      </template>
    </fly-nft>

    <nft-dialog
      :dialogVisible="state.dialogParams.isShow"
      :isShowClose="!(state.dialogParams.dialogStatus === 'ongoing')"
      :dialogParams="state.dialogParams"
      @handleClose="handleClose"
      @handleSuccess="handleSuccess"
      @handleFailed="handleFailed"
    >
    </nft-dialog>

    <nft-second-dialog
      :dialogVisible="state.secondDialogParams.isShow"
      :dialogParams="state.secondDialogParams"
      @handleClose="secondDialogClose"
      @handleCancel="secondDialogClose"
      @handleConfirm="sencondDialogConfirm"
    >
    </nft-second-dialog>
  </div>
</template>
<script setup>
import { reactive, onMounted, ref, computed, watch, onUnmounted } from "vue";
import NFT_CONSTANTS from "@constants/nft.js";
import FlyNft from "@FlyUI/FlyNFT.vue";
// import detailCard from "@components/NFT/DetailCard.vue";
import detailCard from "@components/NFT/Details.vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import NftDialog from "@components/NFT/NFTDialog.vue";
import NftSecondDialog from "@components/NFT/DetailsUI/NFTSecondDialog.vue";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import utilsNumber from "@utils/number";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
const { t } = useI18n();
const route = useRoute();
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();
let state = reactive({
  provider: computed(() => store.state.StoreWallet.stcProvider),
  buyBackDetail: computed(() => store.state.StoreBuyBack.buyBackDetail),
  accounts: computed(() => store.state.StoreWallet.accounts),
  secondDialogParams: NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS,
  dialogParams: computed(() => store.state.StoreBuyBack.dialogParams),
});

watch(
  () => state.accounts,
  (n) => {
    if (n && n[0]) {
      initData();
    }
  }
);

const initData = async () => {
  const groupId = ref(route.query.groupId).value;
  const token = ref(route.query.token).value;
  const id = ref(route.query.id).value;
  store.dispatch("StoreBuyBack/getDetailData", {
    id,
    groupId,
    token,
    account: state.accounts[0],
  });
};

onMounted(() => {
  initData();
  store.commit(
    "StoreBuyBack/CHANGE_DIALOG_STATUS",
    NFT_CONSTANTS.INIT_DIALOG_PARAMS
  );
});

const actionsCall = ({ action }) => {
  if (action === "Recovery") {
    const price = state.buyBackDetail.buyPrice;
    const currency = state.buyBackDetail.currency;
    state.secondDialogParams = Object.assign(
      {},
      NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS,
      {
        isShow: true,
        imgUrl: state.buyBackDetail.icon,
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
};

const secondDialogClose = () => {
  state.secondDialogParams = NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS;
  store.commit(
    "StoreBuyBack/CHANGE_DIALOG_STATUS",
    NFT_CONSTANTS.INIT_DIALOG_PARAMS
  );
};

const sencondDialogConfirm = () => {
  state.secondDialogParams = Object.assign(
    {},
    NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS
  );
  const { nftMeta, nftBody, payToken, nftId } = state.buyBackDetail;
  const params = {
    price: state.buyBackDetail.buyPrice,
    currency: state.buyBackDetail.currency,
    tyArgs: [nftMeta, nftBody, payToken],
    args: [String(nftId)],
  };
  store.dispatch("StoreBuyBack/buyBackFunc", params);
};

const handleClose = () => {
  if (state.dialogParams.dialogStatus === "success") {
    handleSuccess();
  } else if (state.dialogParams.dialogStatus === "failed") {
    handleFailed();
  }
  store.commit(
    "StoreBuyBack/CHANGE_DIALOG_STATUS",
    NFT_CONSTANTS.INIT_DIALOG_PARAMS
  );
};

const handleSuccess = () => {
  router.push({
    name: "nftcollection",
    params: {
      tabIndex: 4,
    },
  });
};

const handleFailed = () => {
  window.location.reload();
};

onUnmounted(() => {
  store.commit("StoreBuyBack/SET_BUYBACKINFO_DETAIL", null);
});
</script>
<style lang="scss" scoped>
.blind-box-container {
  margin: 0 auto;
  padding-bottom: 30px;
  .nft-buyback-confirm-img {
    max-width: 120px;
    text-align: center;
  }
}
</style>
