<template>
  <div class="header">
    <img src="../../../assets/poap/bg.png" alt="" />
    <div class="title">POAP</div>
    <div class="nav">
      <div class="nav-l">
        <h1>{{ $t("Hey") }} {{ props.account }}</h1>
        <div class="nav-list">
          <div
            class="nav-item"
            :class="{ active: isClaimed == 1 }"
            @click="checkItem(1)"
          >
            {{ $t("Claimed") }} <span></span>
          </div>
          <div
            class="nav-item"
            :class="{ active: isClaimed == 2 }"
            @click="checkItem(2)"
          >
            {{ $t("Unclaimed") }} <span></span>
          </div>
        </div>
      </div>
      <div class="logo">
        <img src="../../../assets/poap/logo.png" alt="" />
      </div>
    </div>
  </div>
  <div v-if="state.firstLoading">
    <template v-if="state.list.length > 0">
      <template v-if="isClaimed == 1">
        <div class="container" v-for="item in state.list" :key="item.year">
          <h3>{{ item.year }}</h3>
          <div class="itemBox">
            <div
              class="item"
              :class="{ get: d.isHas }"
              v-for="d in item.honorGroups"
              :key="d.id"
            >
              <img :src="d.nft_image" alt="" />
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="isClaimed == 2">
        <div class="container" v-for="item in state.list" :key="item.year">
          <h3>{{ item.year }}</h3>
          <div class="un-itemBox">
            <div class="un-item" v-for="d in item.honorGroups" :key="d.id">
              <div class="image-box">
                <img :src="d.imageUrl" alt="" />
              </div>
              <div class="mask" @click="submit(d)">
                <button>
                  {{ $t("领取") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <div class="none-box" v-else>
      <img src="../../../assets/poap/none.png" class="none" alt="" />
      <p>{{ $t("You don't have any POAP yet") }}</p>
    </div>
  </div>

  <fly-loading-fish v-else></fly-loading-fish>
  <Fly-wallet-dialog
    :dialogParams="dialogSetting"
    @handleFailed="handleSucceed"
    @handleClose="handleSucceed"
    @handleSucceed="handleSucceed"
  >
  </Fly-wallet-dialog>
</template>
<script setup>
import commonApi from "@api/common";
import FlyWalletDialog from "@FlyUI/FlyWalletDialog.vue";
import { reactive, ref } from "vue";
import {
  getClaimedList,
  gethonorReceive,
  getunClaimedList,
} from "../../../api/achievement";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import { useStore } from "vuex";
import { WALLET_DIALOG_PARAMS } from "../../../constants/dialog";
import { getContractWidthSingerAddress } from "../../../walletUtils/stcContract";
const store = useStore();
const props = defineProps({
  account: {
    type: String,
    default: "",
  },
});
const state = reactive({
  list: [],
  firstLoading: false,
});
const handleSucceed = () => {
  dialogSetting.dialogVisible = false;
  window.location.reload();
};
const dialogSetting = reactive({
  ...WALLET_DIALOG_PARAMS,
  dialogText: `正在领取`,
  successText: `领取成功`,
  failedText: `领取失败`,
  isShowClose: false,
});

const isClaimed = ref(1);
const checkItem = (id) => {
  isClaimed.value = id;
  state.firstLoading = false;
  if (id == 1) {
    getClaimedList(props.account).then((res) => {
      state.firstLoading = true;
      state.list = res.data;
    });
  } else {
    getunClaimedList(props.account).then((res) => {
      state.firstLoading = true;
      state.list = res.data;
    });
  }
};

const submit = (d) => {
  dialogSetting.dialogVisible = true;
  dialogSetting.dialogStatus = "ongoing";
  gethonorReceive({
    account: props.account,
    groupId: d.id,
  }).then((res) => {
    console.log(res);
    dialogSetting.dialogText = "还未导入陈列室，正在导入";
    if (res.code == 406) {
      importGallery([d.nftMeta, d.nftBody], "gellery", props.account, d.nftType)
        .then(() => {
          dialogSetting.dialogText = "导入成功,正在领取";
          gethonorReceive({
            account: props.account,
            groupId: d.id,
          }).then((res) => {
            if (res.code == 200) {
              dialogSetting.phase1 = "succeed";
              dialogSetting.phase2 = "succeed";
              setTimeout(() => {
                dialogSetting.isShowClose = true;
                dialogSetting.dialogStatus = "succeed";
              }, 1000);
            }
          });
        })
        .catch(() => {
          dialogSetting.isShowClose = true;
          dialogSetting.dialogStatus = "failed";
        });
    } else if (res.code == 200) {
      dialogSetting.phase1 = "succeed";
      dialogSetting.phase2 = "succeed";
      setTimeout(() => {
        dialogSetting.isShowClose = true;
        dialogSetting.dialogStatus = "succeed";
      }, 1000);
    } else {
      dialogSetting.isShowClose = true;
      dialogSetting.dialogStatus = "failed";
    }
  });
};

const importGallery = async (tyArgs, type, account, typeSBT) => {
  const res = await commonApi.getUserResourceList(account);
  let isImport = false;
  if (res && res.result && res.result.resources) {
    let matchString = "";
    if (type === "blindbox") {
      matchString = tyArgs[0];
    } else {
      matchString = `NFTGallery::NFTGallery<${tyArgs[0]}, ${tyArgs[1]}>`;
    }
    for (let [k] of Object.entries(res.result.resources)) {
      if (k.includes(matchString)) {
        isImport = true;
      }
    }
  }
  if (!isImport) {
    try {
      const fn = typeSBT == 1 ? "IdentifierNFTScripts" : "NFTGalleryScripts";
      await getContractWidthSingerAddress(
        store.state.StoreWallet.stcProvider,
        `0x1::${fn}::accept`,
        tyArgs,
        () => {
          dialogSetting.phase1 = "succeed";
        }
      );
    } catch (error) {
      dialogSetting.isShowClose = true;
      dialogSetting.dialogStatus = "failed";
    }
  }
};
getClaimedList(props.account).then((res) => {
  state.firstLoading = true;
  state.list = res.data;
});
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  position: relative;
  margin-top: -38px;
  img {
    width: 100%;
  }
  .title {
    position: absolute;
    text-align: center;
    width: 100%;
    top: 30px;
    font-size: 48px;
    color: #fff;
    // font-weight: bold;
  }
  .nav {
    display: flex;
    justify-content: space-between;
    margin-top: -30px;
    .logo {
      width: 152px;
      img {
        width: 100%;
      }
    }
    h1 {
      margin-top: 35px;
      color: #fff;
      font-size: 18px;
    }
    .nav-list {
      margin-top: 30px;
      width: 910px;
      height: 44px;
      background: #242424;
      border-radius: 9px;
      display: flex;
      color: #fff;
      .nav-item {
        position: relative;
        line-height: 44px;
        margin-left: 40px;
        padding: 0 10px;
        color: #8c8b8c;
        cursor: pointer;
        &.active {
          color: #fff;
          span {
            display: block;
          }
        }
        span {
          width: 100%;
          height: 2px;
          background: #fff;
          position: absolute;
          bottom: 0;
          left: 0;
          display: none;
        }
      }
    }
  }
}

.none-box {
  p {
    text-align: center;
    color: #8c8b8c;
    font-size: 20px;
    margin-top: 10px;
  }
  .none {
    width: 240px;
    margin: 0 auto;
    display: block;
    margin-top: 100px;
  }
}
.container {
  color: #fff;
  margin-bottom: 40px;
  margin-top: 15px;
  h3 {
    font-size: 36px;
    margin-bottom: 30px;
    color: #fba800;
  }
  .itemBox {
    display: flex;
    flex-wrap: wrap;
    .item {
      margin-bottom: 20px;
      position: relative;
      margin-right: 30px;
      cursor: pointer;
      // box-shadow: 0 18px 32px -18px rgba(0, 0, 0, 0.6);
      transition: 0.5s all ease;
      .mask {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        display: none;
        button {
          display: none;
        }
      }

      // &.get {
      //   .mask {
      //     display: none !important;
      //   }
      // }
      &:hover {
        transform: translateY(-3px);
        // .mask {
        //   display: flex;
        //   button {
        //     display: block;
        //   }
        // }
      }
      img {
        width: 230px;
        height: 230px;
        object-fit: contain;
      }
    }
  }
  .un-item {
    width: 280px;
    height: 228px;
    overflow: hidden;
    background: #242424;
    border-radius: 18px;
    text-align: center;
    .image-box {
      width: 100%;
      height: 170px;
      background: #000;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    &:hover {
      transform: translateY(-3px);
    }
    button {
      width: 138px;
      height: 28px;
      font-size: 12px;
      color: #9f3200;
      background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
      border: none;
      box-shadow: 0px 12px 15px 0px rgba(253, 168, 0, 0.39);
      border-radius: 8px;
      margin-top: 18px;
      cursor: pointer;
      font-weight: bold;
    }
  }
}
</style>
