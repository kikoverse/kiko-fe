<template>
  <div class="nft-dialog">
    <ElDialog
      v-model="state.visible"
      :width="`${props.width ? props.width + 'px' : '440px'}`"
      custom-class="fly-dialog-el"
      :before-close="() => emits('handleClose')"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal="true"
      :show-close="false"
    >
      <template #title>
        <div
          class="nft-dialog-header"
          :style="{
            'justify-content': `${
              props.dialogParams.title ? 'space-between' : 'flex-end'
            }`,
          }"
        >
          <span v-if="props.dialogParams.title">
            {{ props.dialogParams.title }}
          </span>
          <svg-icon
            v-if="state.isShowClose"
            name="f-dialog-close"
            class="svg"
            @click.stop="() => emits('handleClose')"
          ></svg-icon>
        </div>
      </template>
      <div class="nft-dialog-content">
        <div class="nft-dialog-content-core">
          <img src="../../assets/nft/dialog-error.png" />
          <fly-space :size="15"></fly-space>
          <p class="nft-dialog-content-core-text">
            {{ props.dialogParams.text }}
          </p>
          <fly-space :size="4"></fly-space>
          <p class="nft-dialog-content-core-subtext">
            {{ props.dialogParams.subText }}
          </p>
        </div>
      </div>
      <div class="nft-dialog-footer">
        <fly-button
          type="red"
          class="nft-dialog-footer-button"
          @click="() => emits('handleConfirm')"
        >
          {{ $t(dialogParams.btnText) }}
        </fly-button>
      </div>
    </ElDialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import FlyButton from "@FlyUI/FlyButton.vue";
// import { ElDialog } from "element-plus";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  dialogVisible: {
    type: Boolean,
  },
  width: {
    type: Number,
  },
  isShowClose: {
    type: Boolean,
    default: true,
  },
  dialogParams: {},
});
const state = reactive({
  visible: props.dialogVisible,
  isShowClose: props.isShowClose,
  // dialogStatus: props.dialogStatus,
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

const emits = defineEmits(["handleClose", "handleConfirm"]);
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(200deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.nft-dialog {
  ::v-deep(.el-dialog) {
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
    border-radius: 16px;
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: $btn-orange-bgcolor;
    }
  }
  ::v-deep(.el-dialog__body) {
    padding-top: 10px !important;
  }
  .nft-dialog-header {
    display: flex;

    align-items: center;
    font-weight: bold;
    span {
      font-size: 18px;
    }
    .svg {
      width: 28px;
      height: 28px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .nft-dialog-content {
    // background: red;
    .nft-dialog-content-core {
      text-align: center;
      img {
        display: inline-block;
        width: 63px;
        user-select: none;
      }
      .nft-dialog-content-core-text {
        font-size: 20px;
        color: $white;
        font-weight: 600;
      }
      .nft-dialog-content-core-subtext {
        font-size: 14px;
        color: #8b8b8b;
      }
    }
  }
  .nft-dialog-content-feedback {
    width: 323px;
    height: 109px;
    background: #fafafa;
    border-radius: 16px;
    margin: 0 auto;
    margin-top: 20px;
    overflow: hidden;
    // display: flex;
    // justify-content: center;
    // flex-direction: column;
    div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: #000928;
      overflow: hidden;
      &.loading-div {
        color: #8b8b8b;
      }
      img {
        width: 14px;
        height: 14px;
        margin-left: 60px;
        display: inline-block;
      }
      span {
        margin-left: 10px;
        font-size: 16px;
        font-weight: 600;
      }
    }
    .loading-img {
      transition: 0.5s;
      animation: rotate 1s linear infinite;
    }
    .nft-dialog-content-feedback-phase1 {
      margin-top: 30px;
    }
    .nft-dialog-content-feedback-phase2 {
      margin-top: 10px;
    }
  }
  .nft-dialog-footer {
    width: 100%;
    margin-top: 20px;
    .nft-dialog-footer-button {
      padding-right: 0px;
      padding-left: 0px;
      width: 70%;
      margin-left: 15%;
      font-size: 16px;
      border-radius: 10px;
    }
  }
}
</style>
