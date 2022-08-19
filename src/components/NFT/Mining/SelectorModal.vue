<template>
  <div class="nft-mining-selector-dialog">
    <ElDialog
      v-model="state.visible"
      custom-class="fly-dialog-el"
      width="672px"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal="true"
      :show-close="false"
    >
      <template #title>
        <div class="nft-mining-selector-dialog-header">
          <div class="nft-mining-selector-dialog-header-text">
            <p>{{ $t("nftmining.nft-selector-title") }}</p>
            <p style="margin-top: 5px">
              {{ $t("nftmining.nft-selector-rule") }}
            </p>
          </div>
          <svg-icon
            name="f-dialog-close"
            class="nft-mining-selector-dialog-header-svg"
            @click.stop="handleClose"
          ></svg-icon>
        </div>
      </template>
      <user-nft-card></user-nft-card>
    </ElDialog>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, watchEffect } from "vue";
import UserNftCard from "./UserNFTCard.vue";
import SvgIcon from "@components/SvgIcon/Index.vue";

const state = reactive({
  visible: false,
});
const emits = defineEmits(["handleClose", "handleSuccess", "handleFailed"]);
const props = defineProps({
  dialogParams: Object,
});

watchEffect(() => {
  if (props.dialogParams) {
    state.visible = props.dialogParams.dialogVisible;
  }
});
const handleClose = () => {
  emits("handleClose");
};
</script>
<style lang="scss" scoped>
@import "~@/styles/_vars.scss";
.nft-mining-selector-dialog {
  ::v-deep(.el-dialog) {
    border-radius: 8px;
    padding: 32px 24px;
    height: 717px;
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: $btn-orange-bgcolor;
    }
  }
  ::v-deep(.el-dialog__body) {
    padding: 0px !important;
    // padding: 0px 0px 30px !important;
  }
  ::v-deep(.el-dialog__header) {
    padding: 0 !important;
  }
  .fly-dialog-el {
    ::v-deep(.el-dialog__header) {
      text-align: left !important;
    }
  }

  .nft-mining-selector-dialog-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    .nft-mining-selector-dialog-header-text {
      color: $white;
      p:first-child {
        font-weight: 500;
        font-size: 24px;
      }
      p:last-child {
        font-size: 14px;
      }
    }
    .nft-mining-selector-dialog-header-svg {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
