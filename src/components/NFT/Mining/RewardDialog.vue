<template>
  <fly-wallet-dialog
    :dialogParams="state.walletDialogParams"
    @handleFailed="state.walletDialogParams?.handleFailed"
    @handleClose="state.walletDialogParams?.handleClose"
    @handleSucceed="state.walletDialogParams?.handleSucceed"
  >
    <template #fly-wallet-dialog-custom-content>
      <div style="text-align: center; color: #8b8b8b">
        <p v-if="state.walletDialogParams?.miningData?.draw">
          {{
            $t("提取{amount}{symbol}至钱包", {
              amount: formatAmount(state.walletDialogParams.miningData.draw),
              symbol: "STC",
            })
          }}
        </p>
        <fly-space :size="20"></fly-space>
      </div>
    </template>
  </fly-wallet-dialog>
</template>
<script setup>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import FlyWalletDialog from "@FlyUI/FlyWalletDialog.vue";
import utilsNumber from "@utils/number";
import FlySpace from "@FlyUI/FlySpace.vue";
const store = useStore();
const state = reactive({
  walletDialogParams: computed(
    () => store.state.StoreNFTMining.walletDialogParams
  ),
});
const formatAmount = (amount) => {
  return utilsNumber.formatNumberMeta(utilsNumber.bigNum(amount), {
    precision: 4,
    trailingZero: true,
    round: "floor",
  }).text;
};
</script>
<style lang="scss" scoped></style>
