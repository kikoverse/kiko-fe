<template>
  <div class="mining-second-dialog">
    <fly-second-dialog
      :dialogParams="state.secondDialogParams"
      @handleClose="state.secondDialogParams?.handleClose"
      @handleConfirm="state.secondDialogParams?.handleConfirm"
      @handleCancel="state.secondDialogParams?.handleCancel"
      class="mining-dialog-box"
      :class="
        state.secondDialogParams?.dataParams?.gas ? 'mining-earnings-box' : ''
      "
    >
      <template #custom-content>
        <div class="mining-second-dialog-content">
          <p
            class="mining-second-dialog-content-title"
            v-if="state.secondDialogParams?.isShowTitle"
          >
            {{ $t("提取收益确认") }}
          </p>
          <div class="mining-second-dialog-content-block">
            <div
              class="mining-second-dialog-content-block-item"
              v-if="state.secondDialogParams?.dataParams?.draw"
            >
              <p class="mining-second-dialog-content-block-item-label">
                {{ $t("farms.farm-swap-draw") }}
              </p>
              <fly-amount
                class="mining-second-dialog-content-block-item-amount"
                :value="state.secondDialogParams.dataParams.draw"
                :formatOptions="{ precision: 4, trailingZero: true }"
                displaySuffix="STC"
              ></fly-amount>
            </div>
            <div
              class="mining-second-dialog-content-block-item"
              v-if="state.secondDialogParams?.dataParams?.gas"
            >
              <p class="mining-second-dialog-content-block-item-label">
                {{ $t("farms.farm-swap-draw-gas") }}
              </p>
              <fly-amount
                class="mining-second-dialog-content-block-item-amount"
                :value="state.secondDialogParams.dataParams.gas"
                :formatOptions="{ precision: 4, trailingZero: true }"
                displaySuffix="STC"
              ></fly-amount>
            </div>
          </div>
        </div>
      </template>
      <template #custom-content-desc>
        <p
          v-if="state.secondDialogParams?.nftName"
          class="mining-second-dialog-nftname"
        >
          {{
            $t("nftmining.remove-nft-card-desc", {
              name: state.secondDialogParams.nftName,
            })
          }}
        </p>
      </template>
    </fly-second-dialog>
  </div>
</template>
<script setup>
/* eslint-disable */
import FlySecondDialog from "@FlyUI/FlySecondDialog.vue";
import CONSTANTS_DIALOG from "@constants/dialog.js";
import FlyAmount from "@FlyUI/FlyAmount";
import { computed, onMounted, reactive, watch } from "vue";
import { useStore } from "vuex";

let state = reactive({
  secondDialogParams: computed(
    () => store.state.StoreNFTMining.secondDialogParams
  ),
});

const store = useStore();
</script>
<style lang="scss" scoped>
.mining-second-dialog {
}
.mining-dialog-box {
  ::v-deep(.fly-second-dialog-content) {
    margin-top: 18px;
  }
}
.mining-earnings-box {
  ::v-deep(.fly-dialog-el) {
    height: 373px !important;
  }
}
.mining-second-dialog-content {
  text-align: center;
  user-select: none;

  .mining-second-dialog-content-title {
    font-size: 20px;
    font-weight: 600;
    color: $white;
  }
  .mining-second-dialog-content-error {
    font-size: 16px;
    font-weight: 500;
    color: #f36346;
    margin-top: 10px;
  }
  .mining-second-dialog-content-block {
    margin-top: 20px;
    .mining-second-dialog-content-block-item {
      padding: 8px 20px;
      display: flex;
      justify-content: space-between;
      .mining-second-dialog-content-block-item-label {
        font-weight: 400;
        color: #8b8b8b;
        font-size: 16px;
      }
      .mining-second-dialog-content-block-item-amount {
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
  img {
    width: 80%;
    border-radius: 16px;
  }
  p {
    // margin-top: 20px;
    font-size: 16px;
    color: #010e22;
    font-weight: 600;
  }
  .mining-second-dialog-content-gas {
    margin-top: 3px;
    font-size: 13px;
    color: #969696;
  }
}
.mining-second-dialog-nftname {
  margin-top: 16px;
  font-size: 20px;
  font-weight: 600;
  color: #fba800;
}
</style>
