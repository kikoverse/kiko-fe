<template>
  <div v-if="state.firstLoading">
    <div class="container" v-for="item in state.list" :key="item.year">
      <h3>2022</h3>
      <div class="itemBox">
        <div
          class="item"
          :class="{ get: d.isHas }"
          v-for="d in item.honorGroups"
          :key="d.id"
        >
          <img :src="d.imageUrl" alt="" />
          <div class="mask" @click="submit(d)">
            <FlyButton>
              <div>{{ $t("领取") }}</div>
            </FlyButton>
          </div>
        </div>
      </div>
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
import { reactive } from "vue";
import {
  getAllClaimedList,
  getClaimedList,
  gethonorReceive,
} from "../../../api/achievement";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import { useStore } from "vuex";
import FlyButton from "../../../FlyUI/FlyButton.vue";
import { WALLET_DIALOG_PARAMS } from "../../../constants/dialog";
import { getContractWidthSingerAddress } from "../../../walletUtils/stcContract";
const store = useStore();
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
const mergeArr = (arr1, arr2) => {
  const json1 = arr2Json(arr1, "year");
  const json2 = arr2Json(arr2, "year");
  const arr = [];
  for (const key in json1) {
    if (json2[key]) {
      json1[key] = {
        ...json1[key],
        honorGroups: mergeArrGroups(
          json1[key].honorGroups,
          json2[key].honorGroups
        ),
      };
      delete json2[key];
    }
    arr.push(json1[key]);
  }
  for (const key in json2) {
    arr.push(json2[key]);
  }
  return arr;
};
const mergeArrGroups = (arr1, arr2) => {
  const json1 = arr2Json(arr1, "id");
  const json2 = arr2Json(arr2, "id");
  const arr = [];
  for (const key in json1) {
    if (json2[key]) {
      json1[key] = { ...json1[key], isHas: true };
      delete json2[key];
    }
    arr.push(json1[key]);
  }
  for (const key in json2) {
    arr.push(json2[key]);
  }
  return arr;
};

const arr2Json = (arr, key) => {
  let newJson = {};
  for (const item of arr) {
    newJson[item[key]] = item;
  }
  return newJson;
};

const submit = (d) => {
  dialogSetting.dialogVisible = true;
  dialogSetting.dialogStatus = "ongoing";
  gethonorReceive({
    account: store.state.StoreWallet.accounts[0],
    groupId: d.id,
  }).then((res) => {
    console.log(res);
    dialogSetting.dialogText = "还未导入陈列室，正在导入";
    if (res.code == 406) {
      importGallery(
        [d.nftMeta, d.nftBody],
        "gellery",
        store.state.StoreWallet.accounts[0],
        d.nftType
      )
        .then(() => {
          dialogSetting.dialogText = "导入成功,正在领取";
          gethonorReceive({
            account: store.state.StoreWallet.accounts[0],
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
getAllClaimedList(store.state.StoreWallet.accounts[0]).then((res) => {
  state.firstLoading = true;
  console.log(res);
  console.log(mergeArr(state.list, res.data), "111");
  state.list = mergeArr(state.list, res.data);
});
getClaimedList(store.state.StoreWallet.accounts[0]).then((res) => {
  console.log(res);
  console.log(mergeArr(state.list, res.data), "222");

  state.list = mergeArr(state.list, res.data);
});
</script>
<style lang="scss" scoped>
.container {
  color: #fff;
  margin-bottom: 40px;
  h3 {
    font-size: 28px;
    margin-bottom: 30px;
  }
  .itemBox {
    display: flex;
    flex-wrap: wrap;
    .item {
      margin-bottom: 20px;
      position: relative;
      margin-right: 30px;
      cursor: pointer;
      box-shadow: 0 18px 32px -18px rgba(0, 0, 0, 0.6);
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
        button {
          display: none;
        }
      }

      &.get {
        .mask {
          display: none !important;
        }
      }
      &:hover {
        transform: translateY(-3px);
        .mask {
          display: flex;
          button {
            display: block;
          }
        }
      }
      img {
        width: 250px;
        height: 150px;
        border-radius: 10px;
      }
    }
  }
}
</style>
