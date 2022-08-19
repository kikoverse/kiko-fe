<template>
  <div class="nft-bid-dialog">
    <ElDialog
      v-model="state.visible"
      :width="`${props.width ? props.width + 'px' : '662px'}`"
      custom-class="fly-dialog-el"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="props.isClickModal"
      :modal="true"
      :show-close="false"
    >
      <template #title>
        <div class="nft-bid-dialog-header">
          <span>
            {{ $t("出售NFT") }}
          </span>
          <svg-icon
            v-if="state.isShowClose"
            name="f-dialog-close"
            class="svg"
            @click.stop="handleClose"
          ></svg-icon>
        </div>
      </template>
      <div class="nft-bid-dialog-content">
        <p>{{ $t(BID_DIALOG_PARAMS.label) }}</p>
        <div class="bid-type">
          <a
            v-for="(item, i) in BID_DIALOG_PARAMS.BIDTYPES"
            :key="i"
            @click="changeAction(i)"
            :class="state.typeIndex === i ? 'active' : ''"
            :style="i === 0 ? 'border-right:none' : 'border-left:none'"
          >
            {{ $t(item) }}
          </a>
        </div>
        <div class="sell-type-content">
          <div class="fix-content" v-if="state.typeIndex === 0">
            <p>
              {{
                $t(
                  state.typeIndex === 0
                    ? BID_DIALOG_PARAMS.FIXEDPRICE[0]
                    : BID_DIALOG_PARAMS.AUCTIONPRICE[0]
                )
              }}
            </p>
            <div class="fix-input-box">
              <fly-input
                class="fix-price-input"
                :value="String(state.price || '')"
                @inputEvent="inputEvent"
                validateType="integer"
                max="999999999"
              >
              </fly-input>
              <span>STC</span>
            </div>
          </div>
          <div class="bid-content" v-if="state.typeIndex === 1">
            <div class="bid-input-box">
              <p>
                {{
                  $t(
                    state.typeIndex === 0
                      ? BID_DIALOG_PARAMS.FIXEDPRICE[0]
                      : BID_DIALOG_PARAMS.AUCTIONPRICE[0]
                  )
                }}
              </p>
              <div class="bid-price-content-box">
                <fly-input
                  class="bid-price-input"
                  :value="String(state.price || '')"
                  @inputEvent="inputEvent"
                  validateType="integer"
                  max="999999999"
                >
                </fly-input>
                <span>STC</span>
              </div>
            </div>
            <div class="bid-time">
              <p>
                {{ $t(BID_DIALOG_PARAMS.AUCTIONPRICE[1]) }}
              </p>
              <fly-selector
                :items="timeOptions"
                @emit="handleTime"
                :value="state.endDay"
                class="bid-time-change"
                :width="`100%`"
              ></fly-selector>
            </div>
          </div>
          <div v-if="state.errorInfo" class="error">
            *{{ $t("请输入价格") }}
          </div>
          <div class="bid-text">
            <p>{{ $t("说明") }}:</p>
            <p>{{ $t(BID_DIALOG_PARAMS.FIXEDTEXT) }}</p>
            <p>{{ $t(BID_DIALOG_PARAMS.AUCTIONTEXT) }}</p>
            <p>{{ $t(BID_DIALOG_PARAMS.FEETEXT) }}</p>
          </div>
        </div>
      </div>
      <div class="nft-bid-dialog-footer">
        <fly-button
          @click="handleConfirm"
          class="nft-bid-dialog-footer-button"
          v-if="props.dialogParams.confirmText"
        >
          {{ props.dialogParams.confirmText }}
        </fly-button>
      </div>
    </ElDialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch, computed } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlyButton from "@FlyUI/FlyButton.vue";
import { BID_DIALOG_PARAMS } from "@constants/dialog.js";
import FlyInput from "@FlyUI/FlyInput.vue";
import FlySelector from "@FlyUI/FlySelector.vue";
import { useStore } from "vuex";
const store = useStore();
import { useI18n } from "vue-i18n";
const { t } = useI18n();

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
  typeIndex: 0,
  price: "",
  endDay: 1,
  errorInfo: false,
  currLang: computed(() => store.state.StoreApp.currLang),
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

let timeOptions = [];

watch(
  () => state.currLang,
  () => {
    BID_DIALOG_PARAMS.TIME.map((i) => {
      timeOptions.push({ label: i + " " + t("天"), value: i });
    });
  }
);
BID_DIALOG_PARAMS.TIME.map((i) => {
  timeOptions.push({ label: i + " " + t("天"), value: i });
});

const handleTime = (i) => {
  state.endDay = i.value;
};
const handleClose = () => {
  emits("handleClose");
};

const handleConfirm = () => {
  if (state.price === "") {
    state.errorInfo = true;
    return false;
  }
  emits("handleClose");
  let params = {};
  if (state.typeIndex === 0) {
    params = {
      type: state.typeIndex,
      price: state.price,
    };
  } else {
    params = {
      type: state.typeIndex,
      price: state.price,
      end_day: state.endDay,
    };
  }
  emits("handleConfirm", params);
};

const inputEvent = (val) => {
  if (val !== "") {
    state.errorInfo = false;
  }
  state.price = val;
};
const changeAction = (i) => {
  state.typeIndex = i;
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.nft-bid-dialog {
  ::v-deep(.el-dialog) {
    border-radius: 16px;
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: $btn-orange-bgcolor;
    }
  }
  ::v-deep(.el-dialog__header) {
    padding: 32px 26px 24px 24px !important;
  }
  ::v-deep(.el-dialog__body) {
    padding: 0px 24px 55px 22px !important;
  }

  .nft-bid-dialog-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    line-height: 36px;
    color: #ffffff;
    span {
      font-size: 24px;
    }
    .svg {
      width: 28px;
      height: 28px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .nft-bid-dialog-content {
    p {
      font-size: 16px;
      color: $white;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .bid-type {
      width: 100%;
      display: flex;
      margin-bottom: 24px;
      a {
        flex: 1;
        height: 88px;
        border: 1px solid $white;
        line-height: 88px;
        text-align: center;
        float: right;
        position: relative;
        color: $white;
        &:first-child {
          float: left;
          border-radius: 8px 0px 0px 8px;
          border-right: none;
        }
        &:last-child {
          border-radius: 0px 8px 8px 0px;
        }
        &:hover {
          cursor: pointer;
        }
        .svg {
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      .active {
        border: 1px solid #fba800 !important;
        background: rgba(251, 168, 0, 0.05);
        color: #fba800;
      }
    }
    .fix-content {
      width: 100%;
      overflow: hidden;
      margin-bottom: 24px;
      border-radius: 8px;
      .fix-input-box {
        width: 100%;
        height: 88px;
        line-height: 88px;
        color: $white;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        .fix-price-input {
          width: 90%;
          float: left;
        }
        ::v-deep(.el-input__inner) {
          background: none;
          border: none;
          height: 88px;
          padding-left: 24px;
          color: $white;
        }
      }
      span {
        display: inline-block;
        line-height: 88px;
        color: $white;
        font-size: 24px;
      }
    }
    .bid-content {
      color: $white;
      margin-bottom: 24px;
      .bid-input-box {
        width: 372px;
        display: inline-block;
        .bid-price-content-box {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        .bid-price-input {
          width: 83%;
          float: left;
        }
        ::v-deep(.el-input__inner) {
          background: none;
          border: none;
          height: 88px;
          padding-left: 24px;
          color: $white;
        }
        span {
          display: inline-block;
          line-height: 88px;
          font-size: 24px;
          color: $white;
        }
      }
      .bid-time {
        width: 228px;
        display: inline-block;
        margin-left: 16px;
        .bid-time-change {
          width: 100%;
          height: 88px;
          line-height: 88px;
          ::v-deep(.el-select .el-input__inner) {
            height: 88px;
            border-radius: 8px;
            font-size: 20px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: $white;
            padding-left: 24px;
            &:hover {
              border-color: $white;
            }
          }
          ::v-deep(.el-select__popper.el-popper[role="tooltip"]) {
            background: linear-gradient(
              180deg,
              #3e3e3e 0%,
              #3e3e3e 0%,
              #252525 100%
            );
            color: $white;
            border: none;
          }
          ::v-deep(.el-popper__arrow) {
            display: none;
          }
          ::v-deep(.el-select-dropdown__item) {
            height: 45px;
            line-height: 45px;
            &:hover {
              background: rgba(251, 168, 0, 0.05);
              color: #fba800;
            }
            color: $white;
          }
          ::v-deep(.el-select-dropdown__item.selected) {
            background: rgba(251, 168, 0, 0.05);
            color: #fba800;
          }
        }
      }
    }
    .error {
      color: #fba800;
      margin-bottom: 24px;
    }

    .bid-text {
      margin-bottom: 24px;
      p {
        font-size: 14px;
        color: $white;
        margin-bottom: 2px;
        font-weight: normal;
      }
    }
  }

  .nft-bid-dialog-footer {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
    .nft-bid-dialog-footer-button {
      user-select: none;
      width: 100%;
      padding: 15px 15px;
      font-size: 20px;
      border-radius: 8px;
      background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
      box-shadow: 0px 12px 15px 0px rgba(253, 168, 0, 0.39);
      color: #a03300;
    }
  }
}
</style>
