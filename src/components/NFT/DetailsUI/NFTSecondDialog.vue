<template>
  <div class="nft-second-dialog">
    <ElDialog
      v-model="state.visible"
      :width="`${props.width ? props.width + 'px' : '424px'}`"
      custom-class="fly-dialog-el"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="props.isClickModal"
      :modal="true"
      :show-close="false"
    >
      <template #title>
        <div class="nft-second-dialog-header">
          <span>
            {{ props.title || "" }}
          </span>
          <svg-icon
            v-if="state.isShowClose"
            name="f-dialog-close"
            class="svg"
            @click.stop="handleClose"
          ></svg-icon>
        </div>
      </template>
      <div class="nft-second-dialog-content">
        <img
          :src="props.dialogParams.imgUrl"
          v-if="props.dialogParams.imgUrl"
        />
      </div>
      <div class="nft-second-dialog-footer">
        <p v-if="props.dialogParams.text">{{ props.dialogParams.text }}</p>
        <p
          v-if="props.dialogParams.gasInfo"
          class="nft-second-dialog-content-gas"
        >
          {{ props.dialogParams.gasInfo }}
        </p>
        <div class="nft-second-buttons">
          <fly-button
            class="nft-second-dialog-footer-button"
            @click="emits('handleCancel')"
            v-if="props.dialogParams.cancelText"
          >
            {{ props.dialogParams.cancelText }}
          </fly-button>
          <fly-button
            @click="emits('handleConfirm')"
            class="nft-second-dialog-footer-button"
            v-if="props.dialogParams.confirmText"
          >
            {{ props.dialogParams.confirmText }}
          </fly-button>
        </div>
      </div>
    </ElDialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlyButton from "@FlyUI/FlyButton.vue";
// import { ElDialog } from "element-plus";

const props = defineProps({
  dialogVisible: {
    type: Boolean,
  },
  isClickModal: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
  },
  isShowClose: {
    type: Boolean,
    default: true,
  },
  dialogParams: null,
});
const state = reactive({
  visible: props.dialogVisible,
  isShowClose: props.isShowClose,
});

watch(
  () => props.dialogVisible,
  (n) => {
    state.visible = n;
  }
);

watch(
  () => props.isShowClose,
  (n) => {
    state.isShowClose = n;
  }
);

const emits = defineEmits(["handleClose", "handleCancel", "handleConfirm"]);

const handleClose = () => {
  emits("handleClose");
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.nft-second-dialog {
  border-radius: 16px;
  ::v-deep(.el-dialog) {
    border-radius: 34px;
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: $btn-orange-bgcolor;
    }
  }
  ::v-deep(.el-dialog__header) {
    padding: 24px;
    padding-bottom: 8px;
  }
  ::v-deep(.el-dialog__body) {
    padding: 24px;
    padding-top: 0px;
  }
  .fly-dialog-el {
    ::v-deep(.el-dialog__header) {
      text-align: left !important;
    }
  }
  .nft-second-dialog-header {
    display: flex;
    justify-content: flex-end;
    font-weight: bold;
    .svg {
      width: 28px;
      height: 28px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .nft-second-dialog-content {
    text-align: center;
    user-select: none;
    height: 376px;
    background: #e8906c;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .nft-second-dialog-footer {
    width: 100%;
    margin-top: 16px;
    .nft-second-dialog-content-gas {
      margin-top: 3px;
      font-size: 13px;
      color: #969696;
    }
    p {
      font-size: 20px;
      color: #ffffff;
      font-weight: 500;
      text-align: center;
    }
    .nft-second-buttons {
      display: flex;
      justify-content: space-around;
      margin-top: 16px;
      margin-bottom: 24px;
      :first-child {
        border: 1px solid #fba800;
        background: none;
        color: #fba800;
      }
    }
    .nft-second-dialog-footer-button {
      user-select: none;
      // padding-right: 0px;
      // padding-left: 0px;
      padding: 15px 15px;
      width: 35%;
      font-size: 16px;
      border-radius: 8px;
      box-shadow: none;
    }
  }
}
</style>
