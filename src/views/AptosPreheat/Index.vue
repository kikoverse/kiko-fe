<template>
  <FlySpecialBg></FlySpecialBg>
  <div class="container">
    <div
      class="nft-card-item"
      :class="$style['nft-card-item']"
      v-for="item in state.list"
      :key="item.id"
      @click="clickAirdop(item)"
    >
      <div :class="$style['img-box']">
        <img :src="item.boxUrl" alt="" />
        <div :class="$style['btn']">
          <FlyButton @click="submit">
            <div>{{ $t("领取") }}</div>
          </FlyButton>
        </div>
      </div>
      <div :class="$style['item-content']">
        <div :class="$style['descBox']">
          <span>{{
            store.state.StoreApp.currLang === "en"
              ? `${item.enName}`
              : store.state.StoreApp.currLang === "zh"
              ? `${item.cnName}`
              : ""
          }}</span>
          <div
            :class="$style['item-desc']"
            v-html="
              store.state.StoreApp.currLang === 'en'
                ? item.enRule
                : store.state.StoreApp.currLang === 'zh'
                ? item.cnRule
                : ''
            "
          ></div>
        </div>
      </div>
    </div>
  </div>
  <Fly-wallet-dialog
    :dialogParams="dialogSetting"
    @handleFailed="handleSucceed"
    @handleClose="handleSucceed"
    @handleSucceed="handleSucceed"
  >
  </Fly-wallet-dialog>
</template>
<script setup>
import { reactive } from "vue";
import { useStore } from "vuex";
import { getAirdropList } from "../../api/active";
import { WALLET_DIALOG_PARAMS } from "../../constants/dialog";
import { getContractWidthSingerAddress } from "../../walletUtils/stcContract";
import FlyWalletDialog from "@FlyUI/FlyWalletDialog.vue";
import FlyButton from "../../FlyUI/FlyButton.vue";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
const store = useStore();
const state = reactive({
  list: [],
});
const dialogSetting = reactive({
  ...WALLET_DIALOG_PARAMS,
  dialogText: `正在领取`,
  successText: `领取成功`,
  failedText: `领取失败`,
  isShowClose: false,
});
getAirdropList().then((res) => {
  if (res.code == 200) {
    state.list = res.data;
  }
});
const handleSucceed = () => {
  dialogSetting.dialogVisible = false;
  window.location.reload();
};
const clickAirdop = async (item) => {
  dialogSetting.dialogVisible = true;
  dialogSetting.dialogStatus = "ongoing";
  try {
    await getContractWidthSingerAddress(
      store.state.StoreWallet.stcProvider,
      item.transactionAddress,
      [item.boxAddress],
      () => {
        dialogSetting.phase1 = "succeed";
      }
    );

    dialogSetting.phase2 = "succeed";
    setTimeout(() => {
      dialogSetting.isShowClose = true;
      dialogSetting.dialogStatus = "succeed";
    }, 1500);
  } catch (error) {
    dialogSetting.isShowClose = true;
    dialogSetting.dialogStatus = "failed";
  }
};
</script>
<style lang="scss" scoped module>
$border-radius: 8px;
$gray: #7f7f7f;
$fontWeight: bold;
$black: #010e22;
.nft-card-item {
  width: 380px;
  background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
  border-radius: 8px;
  font-size: 14px;
  user-select: none;
  margin-bottom: 20px;
  overflow: hidden;
  margin-right: 28px;
  position: relative;
  cursor: pointer;
  &:hover {
    box-shadow: 0 18px 32px -18px rgba(0, 0, 0, 0.6) !important;
    transform: translateY(-3px);
    .img-box {
      // .descBox {
      //   opacity: 0;
      // }
      .btn {
        opacity: 1;
      }
    }
  }
  .img-box {
    width: 100%;
    height: 200px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    background: #e8906c;
    display: flex;
    justify-content: center;
    img {
      cursor: pointer;
      height: 100%;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }
    .btn {
      position: absolute;
      transition: 0.3s all ease;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      opacity: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.3);
    }
  }
  .item-content {
    padding: 12px 16px 24px 16px;
    color: #fff;

    .category {
      display: block;
      background: rgba(251, 168, 0, 0.3);
      color: #fba800;
      border-radius: 4px;
      height: 23px;
      line-height: 23px;
      padding: 0 10px;
    }
    .item-desc {
      margin-top: 5px;
      font-size: 12px;
      color: #fba800;
    }

    .descBox {
      display: block;
    }
  }
}
</style>
