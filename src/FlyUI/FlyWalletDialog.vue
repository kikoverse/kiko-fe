<template>
  <div class="fly-wallet-dialog">
    <ElDialog
      v-model="state.visible"
      custom-class="fly-dialog-el"
      width="480px"
      :before-close="() => emits('handleClose')"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal="true"
      :show-close="false"
    >
      <template #title>
        <div
          class="fly-wallet-dialog-header"
          :style="{
            'justify-content': props.dialogParams.hasTitle
              ? 'space-between'
              : 'flex-end',
          }"
        >
          <!-- 自定义标题 -->
          <slot name="fly-wallet-dialog-header-title"></slot>
          <span v-if="props.dialogParams.hasTitle">
            {{ props.dialogParams.title }}
          </span>
          <svg-icon
            v-if="props.dialogParams.isShowClose"
            name="f-dialog-close"
            class="fly-wallet-dialog-header-svg"
            @click.stop="() => emits('handleClose')"
          ></svg-icon>
        </div>
      </template>
      <div class="fly-wallet-dialog-content">
        <div class="fly-wallet-dialog-content-core">
          <img
            style="border-radius: 16px"
            src="https://kikoswap.com/static/img/loading.webp"
            v-if="
              props.dialogParams.isUseStatusImg &&
              props.dialogParams.dialogStatus == 'ongoing'
            "
          />
          <svg-icon
            v-if="
              props.dialogParams.isUseStatusImg &&
              props.dialogParams.dialogStatus !== 'ongoing'
            "
            :name="renderContentImg(props.dialogParams.dialogStatus)"
            :style="setWH()"
          ></svg-icon>
          <p
            class="fly-wallet-dialog-content-core-text"
            :class="{ error: props.dialogParams.dialogStatus === 'failed' }"
            v-if="stateText"
          >
            {{ $t(stateText) }}
          </p>
        </div>
        <slot name="fly-wallet-dialog-custom-content"></slot>
        <div
          class="fly-wallet-dialog-content-feedback"
          :style="{
            width: setDiaglogStyle.feedBackWith,
            display:
              !props.dialogParams.phase1 || !props.dialogParams.phase2
                ? 'flex'
                : '',
          }"
          v-if="props.dialogParams.dialogStatus === 'ongoing'"
        >
          <div
            :class="renderColorStyle(props.dialogParams.phase1)"
            class="fly-wallet-dialog-content-feedback-phase1"
            v-if="props.dialogParams.phase1"
          >
            <img
              :src="renderPhaseStatus(props.dialogParams.phase1)"
              alt=""
              :style="{ marginLeft: setDiaglogStyle.loadingMarLeft }"
              :class="rotateAni(props.dialogParams.phase1)"
            />
            <span>{{ $t("在钱包确认操作") }}</span>
          </div>
          <div
            class="fly-wallet-dialog-content-feedback-phase2"
            :class="renderColorStyle(props.dialogParams.phase2)"
          >
            <img
              :src="renderPhaseStatus(props.dialogParams.phase2)"
              alt=""
              :style="{ marginLeft: setDiaglogStyle.loadingMarLeft }"
              :class="rotateAni(props.dialogParams.phase2)"
            />
            <span>{{ $t("请耐心等待网络确认") }}</span>
          </div>
        </div>
      </div>
      <div class="fly-wallet-dialog-footer">
        <fly-button
          @click="emits('handleSucceed')"
          class="fly-wallet-dialog-footer-button"
          type="success_ghost"
          v-if="
            props.dialogParams.successBtnText &&
            props.dialogParams.dialogStatus === 'succeed'
          "
        >
          {{ $t(props.dialogParams.successBtnText) || $t("确认") }}
        </fly-button>
        <fly-button
          type="danger_ghost"
          class="fly-wallet-dialog-footer-button"
          @click="emits('handleFailed')"
          v-if="
            props.dialogParams.failedBtnText &&
            props.dialogParams.dialogStatus === 'failed'
          "
        >
          {{ $t(props.dialogParams.failedBtnText) || $t("确认") }}
        </fly-button>
      </div>
    </ElDialog>
  </div>
</template>

<script setup>
// 公共的钱包操作反馈
import { defineProps, defineEmits, reactive, computed, watchEffect } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlyButton from "@FlyUI/FlyButton.vue";
import { useStore } from "vuex";
// import dialogOnGoingImg from "//kikoswap.com/static/img/loading.webp";
// import dialogFailedImg from "../assets/nft/dialog-error.png";
// import dialogSuccessImg from "../assets/nft/dialog-ok.png";
import dialogLoadingImg from "../assets/nft/dialog-loading.png";
import dialogPhaseSuccessImg from "../assets/nft/dialog-success.png";

const store = useStore();
const props = defineProps({
  dialogParams: {
    type: Object,
    default: () => {
      return {
        dialogVisible: false,
        isShowClose: false, // 弹窗关闭icon
        hasTitle: false,
        dialogStatus: "ongoing", //ongoing  failed  succeed
        dialogText: "", // 购买中等
        phase1: "", // loading succeed
        phase2: "", // loading succeed
        successBtnText: "",
        failedBtnText: "",
        successText: "",
        failedText: "",
      };
    },
  },
});
const state = reactive({
  currLang: computed(() => store.state.StoreApp.currLang),
  visible: false,
});
const stateText = computed(() => {
  let str = "";
  switch (props.dialogParams.dialogStatus) {
    case "ongoing":
      str = props.dialogParams.dialogText;
      break;
    case "succeed":
      str = props.dialogParams.successText;
      break;
    case "failed":
      str = props.dialogParams.failedText;
      break;
  }
  return str;
});
watchEffect(() => {
  if (props.dialogParams) {
    state.visible = props.dialogParams.dialogVisible;
  }
});

const setDiaglogStyle = computed(() => {
  if (state.currLang === "en") {
    return {
      dialogWidth: "500px",
      feedBackWith: "440px",
      loadingMarLeft: "20px",
    };
  }
  return {
    dialogWidth: "440px",
  };
});

const renderContentImg = (type) => {
  console.log("====type====", type);
  const obj = {
    failed: "dialog-error",
    succeed: "dialog-ok",
  };
  return obj[type];
};

const renderPhaseStatus = (type) => {
  const obj = {
    loading: dialogLoadingImg,
    succeed: dialogPhaseSuccessImg,
  };
  return obj[type];
};

const setWH = () => {
  return {
    "margin-bottom": "20px",
    width: "63px",
    height: "56px",
  };
};

const rotateAni = (type) => {
  if (type === "loading") {
    return "loading-img";
  }
};

const renderColorStyle = (type) => {
  if (type === "loading") {
    return "loading-div";
  }
};

const emits = defineEmits(["handleClose", "handleSucceed", "handleFailed"]);
</script>

<style lang="scss" scoped>
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

.fly-wallet-dialog {
  ::v-deep(.el-dialog) {
    background-image: url("../../src/assets/common/bg.png");
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100%;
    border-radius: 23px;
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: $btn-orange-bgcolor;
    }
  }
  ::v-deep(.el-dialog__body) {
    padding-top: 10px !important;
  }
  .fly-wallet-dialog-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-weight: bold;
    .fly-wallet-dialog-header-svg {
      width: 28px;
      height: 28px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .fly-wallet-dialog-content {
    // background: red;
    .fly-wallet-dialog-content-core {
      text-align: center;
      img {
        display: inline-block;
        width: 140px;
        user-select: none;
      }
      .fly-wallet-dialog-content-core-text {
        font-size: 20px;
        color: $theme_light_color;
        font-weight: 600;
        margin-bottom: 20px;
        &.error {
          color: $theme_danger_color;
        }
      }
    }
  }
  .fly-wallet-dialog-content-mining-success {
    color: #8b8b8b;
    text-align: center;
  }
  .fly-wallet-dialog-content-feedback {
    // transform: rotate(-20deg, 0deg);
    // transform-origin: right center;
    width: 323px;
    height: 109px;
    background: rgba(175, 138, 51, 0.07);
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
      overflow: hidden;
      color: #fff;
      &.loading-div {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
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
    .fly-wallet-dialog-content-feedback-phase1 {
      margin-top: 30px;
    }
    .fly-wallet-dialog-content-feedback-phase2 {
      margin-top: 10px;
    }
  }
  .fly-wallet-dialog-footer {
    width: 100%;
    margin-top: 0px;
    .fly-wallet-dialog-footer-button {
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
