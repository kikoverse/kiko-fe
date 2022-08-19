<template>
  <div class="fly-setting">
    <fly-dialog
      :title="$t('设置')"
      :dialogVisible="state.visible"
      @handleClose="handleClose"
    >
      <template #content>
        <div class="setting">
          <div class="flex-style">
            <span style="margin-right: 5px; font-size: 16px; color: #fff">{{
              $t("滑点容差")
            }}</span>
            <fly-tool-tip
              :placeString="
                $t(
                  '较高的滑点容差有助于交易成功。设置完成后，如果兑换率变动超过此百分比，则此次交易不会被执行。'
                )
              "
              svgName="f-question"
              :svgStyle="{
                'margin-right': '3px',
              }"
            >
            </fly-tool-tip>
          </div>

          <div class="flex-style">
            <el-radio-group
              v-model="state.slippageTolerance"
              class="radio-group"
            >
              <el-radio-button
                v-for="(item, i) in state.labels"
                :key="i"
                :label="item"
                class="radio-button"
                :border="false"
                @change="changeSlippage(item)"
                >{{ item + "%" }}</el-radio-button
              >
            </el-radio-group>
            <div>
              <ElInput
                class="input-el"
                v-model="state.slippageTolerance"
                @input="setSlippage"
                @blur="handleBlurSlipppage"
              /><span class="unit-input">%</span>
            </div>
          </div>

          <div class="footer">
            <div>
              <!-- <div class="flex-style"> -->
              <span style="margin-right: 5px; font-size: 16px; color: #fff">{{
                $t("多节点兑换")
              }}</span>
              <fly-tool-tip
                :placeString="$t('关闭后将只进行直接币对交易')"
                svgName="f-question"
                :svgStyle="{
                  'margin-right': '3px',
                  'font-size': '14px',
                }"
              >
              </fly-tool-tip>
            </div>

            <div class="switchSlippage" @click="changeSwitchSlippage">
              <img
                src="../../src/assets/common/setting-open.png"
                v-if="state.switchSlippage"
              />
              <img
                src="../../src/assets/common/setting-close.png"
                v-if="!state.switchSlippage"
              />
            </div>
          </div>
        </div>
      </template>
    </fly-dialog>
  </div>
</template>

<script setup>
import FlyDialog from "@FlyUI/FlyDialog.vue";
import { reactive, defineProps, watch, defineEmits, computed } from "vue";
import session from "@utils/session";
import { useStore } from "vuex";
import FlyToolTip from "@FlyUI/FlyToolTip.vue";

let state = reactive({
  visible: props.dialogVisible,
  labels: ["0.1", "0.5", "1.0"],
  slippageTolerance: computed(
    () => store.state.StoreApp.settings.slippageTolerance
  ),
  switchSlippage: computed(() => store.state.StoreApp.settings.switchSlippage),
});
const store = useStore();

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
});

const changeSwitchSlippage = () => {
  let val = !state.switchSlippage;
  store.dispatch("StoreApp/changeSwitchSlippage", val);
};
watch(
  () => props.dialogVisible,
  (n) => {
    state.visible = n;
  }
);

const emits = defineEmits(["handleClose"]);

const handleClose = () => {
  let value = session.getItem("slippageTolerance");
  if (value === null) {
    setSlippage("0.5");
  }
  emits("handleClose", false);
};
const changeSlippage = (value) => {
  session.setItem("slippageTolerance", value);
  store.dispatch("StoreApp/changeSlippage", value);
};

const setSlippage = (value) => {
  value = value.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
  value = value.replace(/^\./g, ""); // 验证第一个字符是数字
  value = value.replace(/\.{2,}/g, "."); // 只保留第一个, 清除多余的
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  /* eslint-disable-next-line */
  value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
  if (value === "0.00") {
    value = 0.01;
  } else if (value > 49.99) {
    value = 49.99;
  }
  changeSlippage(value);
};

const handleBlurSlipppage = () => {
  if (state.slippageTolerance === "0.0" || state.slippageTolerance === "0") {
    changeSlippage(0.01);
  }
};
</script>

<style lang="scss" scoped>
$marginBtm: 20px;
// $text-color: #b2b2b2;
.flex-style {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
}
.fly-setting {
  ::v-deep(.el-dialog) {
    background-image: url("../../src/assets/common/bg.png");
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100% auto;
  }
  ::v-deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    box-shadow: none;
  }
  ::v-deep(.el-dialog__header) {
    padding: 30px 25px 0px;
    color: $white;
  }
  ::v-deep(.el-dialog__body) {
    padding: 25px 25px 32px;
  }

  .setting {
    width: 350px;
    border-radius: 24px;
    p {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: $white;
      line-height: 22px;
      overflow: hidden;
      label {
        float: left;
        line-height: 35px;
        margin-right: 5px;
      }
      svg {
        margin-top: 8px;
      }
    }
    .radio-group {
      // margin: 16px auto;
      margin: 16px 0px;
      ::v-deep(.el-radio-button) {
        &:focus {
          box-shadow: none;
        }
      }
      ::v-deep(.el-radio-button__inner) {
        width: 100%;
        height: 100%;
        text-align: center;
        margin-right: 8px;
        width: 64px;
        height: 35px;
        border-radius: 8px;
        border: 0.2px solid $gray;
        line-height: 35px;
        padding: 0 10px;
        text-align: center;
        background-color: $gray;
        color: $white;
        &:hover {
          color: $theme_light_color;
        }
        &:focus {
          background-color: $theme_light_color !important;
          color: $black;
        }
      }
      ::v-deep(.el-radio-button__original-radio:checked
          + .el-radio-button__inner) {
        background-color: $theme_light_color !important;
        color: $black;
        border: none !important;
        outline: none !important;
      }
    }
    .input-el {
      width: 96px;
      height: 33px;
      border-radius: 6px;
      // border: 1px solid $gray;
      position: relative;
      box-sizing: content-box;
      // top: 3px;
      display: inline-block;
      :v-deep(.el-input__inner:focus) {
        border: 2px solid $theme_light_color !important;
      }
      ::v-deep(.el-input__inner) {
        height: 34px;
        line-height: 33px;
        border: none;
        background: transparent;
        border: 1px solid $gray;
        outline: none;
        // border-color: #fff;
        color: $theme_light_color;
        position: relative;
        &:focus-within {
          border-color: $theme_light_color !important;
          border: 2px solid;
        }
      }
    }
    .unit-input {
      position: relative;
      left: -20px;
      color: #b2b2b2;
    }
    .fly-switch {
      width: 55px;
      float: right;
      height: 35px;
    }
    .slippageswitch {
      float: right;
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      position: relative;
      width: 40px;
      height: 20px;
      background: #ccc;
      border-radius: 10px;
      margin-top: 5px;
      transition: border-color 0.3s, background-color 0.3s;
      &:hover {
        cursor: pointer;
      }
    }
    .slippageswitch::after {
      content: "";
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0, 0, 2px, #999;
      transition: 0.4s;
      top: 2px;
      position: absolute;
      left: 2px;
    }

    .slippageswitch:checked {
      background: $theme_light_color;
    }
    /* 当input[type=checkbox]被选中时：伪元素显示下面样式 位置发生变化 */
    .slippageswitch:checked::after {
      content: "";
      position: absolute;
      left: 55%;
      top: 2px;
    }
  }
  .footer {
    font-size: 16px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .switchSlippage {
      cursor: pointer;
      img {
        width: 55px;
        // height: 25px;
        // width: 60px;
        // height: 35px;
      }
    }
  }
  // .footer {
  //   width: 388px;
  //   margin-top: 24px;
  //   .footer-btn {
  //     width: 100%;
  //     height: 27px;
  //     color: $theme_light_color;
  //     border-color: $theme_light_color;
  //     padding: 10px 0px;
  //     &:focus,
  //     &:hover {
  //       color: $white;
  //       border-color: $theme_light_color;
  //       background-color: $theme_light_color;
  //     }
  //   }
  // }
}
</style>
