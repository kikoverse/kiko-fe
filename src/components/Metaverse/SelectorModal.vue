<template>
  <div class="meta-nft-selector-modal">
    <ElDialog
      v-model="state.selectorDialogParams.dialogVisible"
      custom-class="fly-dialog-el"
      width="672px"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal="true"
      :show-close="false"
    >
      <template #title>
        <div class="meta-nft-selector-modal-header">
          <div class="meta-nft-selector-modal-header-text">
            <p>{{ $t("metaverse.disassemble an nft") }}</p>
            <p style="margin-top: 5px">
              {{ $t("metaverse.disassemble an nft rule") }}
            </p>
          </div>
          <svg-icon
            name="f-dialog-close"
            class="meta-nft-selector-modal-header-svg"
            @click.stop="handleClose"
          ></svg-icon>
        </div>
      </template>

      <div
        v-if="state.allSplitNFT && state.allSplitNFT.length > 0"
        class="card-wrap"
      >
        <div
          v-for="(d, i) in state.allSplitNFT"
          :key="i"
          class="card-wrap-item"
          @mouseenter="changeBtnStatus(i, true)"
          @mouseleave="changeBtnStatus(i, false)"
        >
          <div class="card-wrap-item-box">
            <img :src="d.image" />
            <div class="card-wrap-item-box-info">
              <p>
                <span>{{ $t("算力") }}:</span>
                <fly-amount
                  :value="d?.score"
                  :formatOptions="{ precision: 0, trailingZero: false }"
                ></fly-amount>
              </p>
              <p>
                {{ d.customName }}
              </p>
            </div>
            <div v-show="d.isShow">
              <div class="card-wrap-item-box-shadow">
                <fly-button
                  class="card-wrap-item-btn"
                  @click="brakeDownNFT(d)"
                  >{{ $t("metaverse.disassemble") }}</fly-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-nft-data" v-else>
        <SvgIcon name="f-no-data"></SvgIcon>
        <p style="color: #8b8b8b">
          {{ $t("metaverse.no NFT available") }}
        </p>
        <p class="no-nft-data-link" @click="pushMarket">
          {{ $t("metaverse.please go to the market") }}
        </p>
      </div>
    </ElDialog>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, watchEffect } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlyButton from "@FlyUI/FlyButton.vue";
import FlyAmount from "@FlyUI/FlyAmount.vue";
import { useStore } from "vuex";
import utilsRouter from "@utils/router";
const store = useStore();

const state = reactive({
  visible: true,
  selectorDialogParams: computed(
    () => store.state.StoreMeta.selectorDialogParams
  ),
  allSplitNFT: computed(() => store.state.StoreMeta.allSplitNFT),
});
const emits = defineEmits(["handleClose", "handleSuccess", "handleFailed"]);

const handleClose = () => {
  store.commit("StoreMeta/SET_SELECTOR_DIALOG_PARAMS", {
    dialogVisible: false,
  });
};

const brakeDownNFT = (data) => {
  store.dispatch("StoreMeta/breakDownNFTRole", data);
};

const changeBtnStatus = (index, flag) => {
  state.allSplitNFT[index].isShow = flag;
};

const pushMarket = () => {
  utilsRouter.push({
    path: "/nftmarket",
  });
};
</script>
<style lang="scss" scoped>
.meta-nft-selector-modal {
  ::v-deep(.el-dialog) {
    min-height: 373px;
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
    border-radius: 16px;
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: $btn-orange-bgcolor;
    }
  }
  ::v-deep(.el-dialog__body) {
    padding-top: 0px !important;
    // padding: 0px 0px 30px !important;
  }
  .fly-dialog-el {
    ::v-deep(.el-dialog__header) {
      text-align: left !important;
    }
  }

  .meta-nft-selector-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 15px;
    .meta-nft-selector-modal-header-text {
      color: #fff;
      p:first-child {
        font-weight: 500;
        font-size: 20px;
      }
      p:last-child {
        font-size: 14px;
      }
    }
    .meta-nft-selector-modal-header-svg {
      width: 30px;
      height: 30px;
    }
  }

  .card-wrap {
    display: flex;
    flex-wrap: wrap;
    max-height: 60vh;
    height: 60vh;
    overflow: scroll;
    .card-wrap-item {
      // padding-left: 2px;
      // padding: 0px 10px;
      margin-bottom: 10px;
      margin-right: 15px;
      height: auto;
      text-align: center;
      height: 200px;
      &:hover {
        cursor: pointer;
      }
      &:nth-child(4n + 4) {
        margin-right: 0px;
      }
      .card-wrap-item-box {
        position: relative;
        width: 144px;
        height: 144px;
        img {
          width: 144px;
          height: 144px;
        }
        .card-wrap-item-box-info {
          color: #fff;
          font-size: 14px;
          p {
            text-align: left;
          }
        }

        .card-wrap-item-box-shadow {
          position: absolute;
          background: rgba(0, 0, 0, 0.4);
          color: #fff;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0px; // bottom: 10px;
          // left: 42px;
          .card-wrap-item-btn {
            margin-top: 10px;
            width: 110px;
            padding: 8px;
            border-radius: 5px;
            font-size: 14px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -70%);
            color: #fff;
            &:hover {
              opacity: 1;
            }
          }
        }
      }
      .card-wrap-item-text {
        font-size: 14px;
        text-align: center;
        text-align: left;
        margin-left: 5px;
        margin-top: 10px;
      }
    }
  }
  .no-nft-data {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 60vh;
    svg {
      display: inline-block;
      margin-bottom: 20px;
      width: 90px;
      height: 90px;
    }
    .no-nft-data-link {
      color: #fba800;
      border-bottom: 1px dashed #fba800;
      cursor: pointer;
    }
  }
}
</style>
