<template>
  <div class="fly-second-dialog">
    <ElDialog
      v-model="state.visible"
      :width="`${
        props.dialogParams?.width ? props.dialogParams.width + 'px' : '440px'
      }`"
      custom-class="fly-dialog-el"
      :before-close="() => emits('handleClose')"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal="true"
      :show-close="false"
    >
      <template #title>
        <div class="fly-second-dialog-header">
          <span v-if="props.dialogParams?.title">
            {{ props.dialogParams.title || "" }}
          </span>
          <slot name="fly-second-dialog-header-title"></slot>
          <svg-icon
            v-if="state.isShowClose"
            name="f-dialog-close"
            class="svg"
            @click.stop="() => emits('handleClose')"
          ></svg-icon>
        </div>
      </template>
      <div class="fly-second-dialog-content">
        <slot name="custom-content"></slot>
        <img
          :src="props.dialogParams?.imgParams?.url"
          v-if="props.dialogParams?.imgParams?.url"
          :style="{
            width: props.dialogParams?.imgParams?.width,
            height: props.dialogParams?.imgParams?.height,
          }"
        />
        <p v-if="props.dialogParams.text">{{ props.dialogParams.text }}</p>
        <slot name="custom-content-desc"> </slot>
      </div>
      <div
        class="fly-second-dialog-footer"
        :set="
          (isSingleBtn =
            props.dialogParams.confirmText && props.dialogParams.cancelText)
        "
      >
        <fly-button
          @click="emits('handleConfirm')"
          class="fly-second-dialog-footer-button"
          type="cancel"
          :style="{ width: isSingleBtn ? '35%' : '80%' }"
          v-if="props.dialogParams.confirmText"
        >
          {{ props.dialogParams.confirmText }}
        </fly-button>
        <fly-button
          type="red"
          class="fly-second-dialog-footer-button"
          @click="emits('handleCancel')"
          v-if="props.dialogParams.cancelText"
          :style="{ width: isSingleBtn ? '35%' : '80%' }"
        >
          {{ props.dialogParams.cancelText }}
        </fly-button>
      </div>
    </ElDialog>
  </div>
</template>

<script setup>
// 二次弹窗
import { defineProps, defineEmits, reactive, watchEffect } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlyButton from "@FlyUI/FlyButton.vue";

const props = defineProps({
  dialogParams: {
    type: Object,
    default: () => {
      return {
        dialogVisible: false,
        isShowClose: true, // 弹窗关闭icon
        title: "", // 标题
        text: "", // 文案
        imgParams: "", // {url: height: width}
        confirmText: "",
        cancelText: "",
      };
    },
  },

  // dialogParams: null,
});
const state = reactive({
  visible: props.dialogVisible,
  isShowClose: props.isShowClose,
});

watchEffect(() => {
  if (props.dialogParams) {
    state.visible = props.dialogParams.dialogVisible;
    state.isShowClose = props.dialogParams?.isShowClose;
  }
});

const emits = defineEmits(["handleClose", "handleCancel", "handleConfirm"]);
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.fly-second-dialog {
  ::v-deep(.el-dialog) {
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
    height: 440px;
    border-radius: 16px;
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: $btn-orange-bgcolor;
    }
  }
  ::v-deep(.el-dialog__body) {
    padding-top: 0px !important;
  }

  .fly-dialog-el {
    background: linear-gradient(180deg, #454545 0%, #2d2d2d 100%) !important;
    ::v-deep(.el-dialog__header) {
      text-align: left !important;
    }
  }
  .fly-second-dialog-header {
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
  .fly-second-dialog-content {
    text-align: center;
    user-select: none;
    img {
      width: 80%;
      border-radius: 16px;
    }
    p {
      margin-top: 20px;
      font-size: 16px;
      color: #010e22;
      font-weight: 600;
    }
    .fly-second-dialog-content-gas {
      margin-top: 3px;
      font-size: 13px;
      color: #969696;
    }
  }

  .fly-second-dialog-footer {
    width: 100%;
    margin-top: 31px;
    display: flex;
    justify-content: space-around;
    .fly-second-dialog-footer-button {
      user-select: none;
      padding: 0;
      height: 59px;
      width: 35%;
      font-size: 16px;
      border-radius: 12px;
      font-weight: normal;
    }
  }
}
</style>
