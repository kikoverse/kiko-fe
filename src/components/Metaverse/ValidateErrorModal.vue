<template>
  <div class="meta-error-validate-modal">
    <ElDialog
      :model-value="state.callBackDialogParams.dialogVisible"
      custom-class="fly-dialog-el"
      width="458px"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal="true"
      :show-close="false"
    >
      <div class="content">
        <p>
          {{ state.callBackDialogParams.text }}
        </p>
        <fly-button class="button" type="danger_ghost" @click="handleClose">
          {{ $t("确认") }}
        </fly-button>
      </div>
    </ElDialog>
  </div>
</template>
<script setup>
import { computed, reactive } from "vue";
import FlyButton from "@FlyUI/FlyButton.vue";
import { useStore } from "vuex";
const store = useStore();
const state = reactive({
  callBackDialogParams: computed(
    () => store.state.StoreMeta.callBackDialogParams
  ),
});

const handleClose = () => {
  store.commit("StoreMeta/SET_CALLBACK_DIALOG_PARAMS_STATUS", {
    dialogVisible: false,
  });
};
</script>
<style lang="scss" scoped>
.meta-error-validate-modal {
  ::v-deep(.el-dialog) {
    min-height: 373px;
    border-radius: 16px;
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
  }
  ::v-deep(.el-dialog__body) {
    padding-top: 0px !important;
  }
  .fly-dialog-el {
    ::v-deep(.el-dialog__header) {
      text-align: left !important;
    }
  }
  .content {
    width: 100%;
    p {
      width: 100%;
      text-align: center;
      font-size: 16px;
      margin: 60px 0px;
      color: #fff;
    }
    .button {
      width: 70%;
      margin-left: 15%;
      padding-right: 0px;
      padding-left: 0px;
      font-size: 16px;
      border-radius: 10px;
    }
  }
}
</style>
