<template>
  <div class="metaverse-wallet-cb">
    <fly-wallet-dialog
      :dialogParams="state.dialogParams"
      @handleFailed="state.dialogParams?.handleFailed"
      @handleClose="state.dialogParams?.handleClose"
      @handleSucceed="state.dialogParams?.handleSucceed"
    >
      <template
        #fly-wallet-dialog-custom-content
        v-if="state.dialogParams.isUseCustomContent"
      >
        <div class="break-down-nft-content">
          <!-- <p style="font-size: 16px">
          {{ $t("metaverse.disassembling character NFT succeeded") }}
        </p> -->
          <p style="positive: relative; top: -15px; font-size: 22px">
            {{ $t("获得") }}
          </p>
          <div v-for="(d, i) in state.dialogParams.customContent" :key="i">
            <span>{{ d.key }} ：</span>
            <span>{{ d.value }}</span>
          </div>
        </div>
      </template>
    </fly-wallet-dialog>
  </div>
</template>
<script setup>
import { computed, reactive } from "vue";
import FlyWalletDialog from "@FlyUI/FlyWalletDialog.vue";
import { useStore } from "vuex";
const store = useStore();
const state = reactive({
  dialogParams: computed(() => store.state.StoreMeta.dialogParams),
});
</script>
<style scoped></style>
<style lang="scss">
.metaverse-wallet-cb {
  .fly-wallet-dialog-footer {
    // padding: 0px 20px;
    width: calc(100% - 40px) !important;
    .fly-wallet-dialog-footer-button {
      width: 100% !important;
      margin-left: 20px !important;
    }
  }
}
.break-down-nft-content {
  padding: 0px 20px;
  p,
  span {
    text-align: center;
    font-size: 16px;
    color: #fff;
  }
  div {
    margin-top: 10px;
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
    span {
      color: rgba(255, 255, 255, 0.8);
    }
  }
  div:last-child {
    margin-bottom: 30px;
  }
}
</style>
