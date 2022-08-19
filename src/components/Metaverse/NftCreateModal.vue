<template>
  <div class="meta-nft-create-modal">
    <ElDialog
      v-model="state.createNFTDialogParams.dialogVisible"
      custom-class="fly-dialog-el"
      width="390px"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal="true"
      :show-close="false"
    >
      <template #title>
        <div class="meta-nft-create-modal-header">
          <div class="meta-nft-create-modal-header-text">
            <p>{{ $t("metaverse.generate character NFT") }}</p>
            <p style="margin-top: 5px">
              {{ $t("metaverse.minting fees") }} :
              {{ `${state?.metaData?.compositeFee} STC` }}
            </p>
          </div>
          <svg-icon
            name="f-dialog-close"
            class="meta-nft-create-modal-header-svg"
            @click.stop="handleClose"
          ></svg-icon>
        </div>
      </template>

      <div
        class="img-item-wrap"
        v-if="state.selectedElementList && state.selectedElementList.length > 0"
      >
        <img
          v-for="(d, i) in state.selectedElementList"
          :src="d.image"
          class="img-item"
          :key="i"
          :style="{ zIndex: d.maskOrder }"
        />
      </div>
      <fly-space :size="15"></fly-space>
      <div class="detail-info">
        <ElInput
          :placeholder="
            $t('metaverse.enter the name (1-10 English characters)')
          "
          v-model="state.nameValue"
        >
        </ElInput>
        <fly-space :size="15"></fly-space>
        <div :class="$style['detail-info-second']">
          <div :class="$style['role-gender']">
            <div
              v-for="(d, i) in state.genderLabels"
              :key="i"
              @click="selectGender(d)"
              :class="[
                $style['role-gender-item'],
                $style[`role-gender-${d}`],
                $style[state.genderValue === d ? 'selected-gender' : ''],
              ]"
            >
              <svg-icon
                :name="`f-${d}`"
                style="width: 30px; height: 30px"
              ></svg-icon>
            </div>
          </div>
          <ElSelect
            v-model="state.professionValue"
            :suffix-icon="SelectSuffix"
            :popper-append-to-body="false"
          >
            <ElOption
              v-for="d in state.metaData.occupations"
              :key="d.value"
              :label="state.currLang === 'zh' ? d.cnDesc : d.desc"
              :value="d.value"
            ></ElOption>
          </ElSelect>
        </div>
        <fly-space :size="15"></fly-space>
        <fly-button
          v-if="state.canGenerated"
          style="width: 100%; padding: 15px 0px"
          @click="validateParams(state.canGenerated)"
        >
          {{ $t("metaverse.confirm minting") }}
        </fly-button>
      </div>
    </ElDialog>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import FlyButton from "@FlyUI/FlyButton.vue";
import { useStore } from "vuex";
import utilsRegExp from "@utils/regexp.js";
import SelectSuffix from "@components/SelectSuffix.vue";
import utilsFormat from "@utils/format";
const store = useStore();

const state = reactive({
  visible: true,
  createNFTDialogParams: computed(
    () => store.state.StoreMeta.createNFTDialogParams
  ),
  metaData: computed(() => store.state.StoreMeta.metaData),
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  currLang: computed(() => store.state.StoreApp.currLang),
  canGenerated: computed(() => store.getters["StoreMeta/canGenerated"]),
  totalScore: computed(() => store.getters["StoreMeta/totalScore"]),
  accounts: computed(() => store.state.StoreWallet.accounts),
  selectedElementList: computed(
    () => store.state.StoreMeta.selectedElementList
  ),
  genderLabels: ["male", "female"],
  genderValue: "male",
  nameValue: "",
  professionValue: "Adventurer",
});

onMounted(() => {
  state.genderLabels = ["male", "female"];
  state.genderValue = "male";
  state.nameValue = "";
  state.professionValue = "Adventurer";
});

const selectGender = (gender) => {
  state.genderValue = gender;
};

const validateParams = (flag) => {
  if (!flag) return;
  try {
    if (
      utilsRegExp.isChinese(state.nameValue) ||
      (state.nameValue && state.nameValue.length > 20) ||
      (state.nameValue && state.nameValue.length < 1) ||
      !state.nameValue
    ) {
      throw new Error("error");
    }
    store.commit("StoreMeta/SET_CREATE_DIALOG_PARAMS", {
      dialogVisible: false,
    });
    store.dispatch("StoreMeta/generateNFTRole", {
      userAddress: state.accounts[0],
      customName: state.nameValue,
      sex: state.genderValue === "male" ? 1 : 0,
      occupation: state.professionValue,
      groupId: state.selectedElementList[0].groupId,
      elementList: state.selectedElementList,
    });
  } catch (e) {
    store.commit("StoreMeta/SET_CALLBACK_DIALOG_PARAMS_STATUS", {
      dialogVisible: true,
      text: utilsFormat.computedLangCtx(
        "the role card name is 1-10 English characters or special symbols"
      ),
    });
  }
};

const handleClose = () => {
  state.genderLabels = ["male", "female"];
  state.genderValue = "male";
  state.nameValue = "";
  state.professionValue = "Adventurer";
  store.commit("StoreMeta/SET_CREATE_DIALOG_PARAMS", {
    dialogVisible: false,
  });
};
</script>
<style lang="scss" scoped>
.img-item-wrap {
  position: relative;
  width: 100%;
  height: 350px;
  .img-item {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}

.meta-nft-create-modal {
  ::v-deep(.el-dialog) {
    min-height: 373px;
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
    border-radius: 16px;
  }
  ::v-deep(.el-dialog__body) {
    padding-top: 0px !important;
  }
  .fly-dialog-el {
    ::v-deep(.el-dialog__header) {
      text-align: left !important;
    }
  }

  .meta-nft-create-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 15px;
    .meta-nft-create-modal-header-text {
      color: #fff;
      p:first-child {
        font-weight: 500;
        font-size: 20px;
      }
      p:last-child {
        font-size: 14px;
      }
    }
    .meta-nft-create-modal-header-svg {
      width: 28px;
      height: 28px;
    }
  }
}

.detail-info {
  ::v-deep(.el-select) {
    .el-input__inner {
      color: #fff !important;
      font-size: 16px;
    }
  }
  ::v-deep(.el-input) {
    border: none;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    height: 56px;
    border: 1px solid rgba(54, 54, 54, 1);
  }
  ::v-deep(.el-input::hover) {
    border: 1px solid transparent;
  }
  ::v-deep(.el-input__inner) {
    background: rgba(54, 54, 54, 1);
    height: 56px;
    color: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(54, 54, 54, 1);
    width: 100%;
  }
  ::v-deep(.el-input__inner:focus) {
    border: 1px solid rgba(54, 54, 54, 1);
  }
  ::v-deep(.el-input__inner::placeholder) {
    color: rgba(255, 255, 255, 0.4);
    font-size: 16px;
  }
  ::v-deep(.el-select__popper.el-popper[role="tooltip"]) {
    border: none;
  }
  ::v-deep(.el-select .el-input.is-focus .el-input__inner) {
    border-color: transparent;
    color: #fff;
  }
  ::v-deep(.el-select__popper.el-popper[role="tooltip"]) {
    background: transparent;
  }

  ::v-deep(.el-select-dropdown) {
    background: #363636;
    border: none;
    border-radius: 8px;
    .el-select-dropdown__wrap {
      background: #363636;
      border-radius: 8px;
    }
    .el-select-dropdown__item.selected {
      color: #ffffff;
      background-color: rgba(1, 1, 0, 0.2);
    }
    .el-select-dropdown__item:hover {
      color: #ffffff;
      background-color: rgba(1, 1, 0, 0.2);
    }
  }
  ::v-deep(.el-popper.is-light .el-popper__arrow::before) {
    display: none;
  }
  ::v-deep(.el-select__popper.el-popper[role="tooltip"]
      .el-popper__arrow::before) {
    border: none;
  }
}
</style>

<style lang="scss" module>
.detail-info-second {
  display: flex;
  // width: 245px;
  width: 100%;
  justify-content: space-between;
  .role-gender {
    display: flex;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    padding: 0px 15px;
    align-items: center;
    .role-gender-item {
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 56px;
      &.selected-gender {
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}
</style>
