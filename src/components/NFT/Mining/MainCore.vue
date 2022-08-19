<template>
  <div :class="$style['mining-core-container']" v-if="!state.isLoading">
    <total-power-card> </total-power-card>
    <user-power-card></user-power-card>
    <div :class="$style['mining-core-container-slot-wrap']">
      <div
        v-for="(d, i) in state.slotArrays"
        :key="i"
        :class="$style['mining-core-container-slot-item-wrap']"
        @click.stop="clickSlotEvent(i + 1, d.hasNFT)"
      >
        <div
          :ref="
            (el) => {
              if (el) state.slotDOMs[i] = el;
            }
          "
          @mouseenter="changeBtnStatus(i, true)"
          @mouseleave="changeBtnStatus(i, false)"
          :class="$style['mining-core-container-slot-item']"
        >
          <div
            :class="$style['mining-core-container-slot-item-img-box']"
            v-if="d?.imageLink"
          >
            <img :src="d?.imageLink" />
            <div
              :class="$style['mining-core-container-slot-item-img-box-desc']"
            >
              <svg-icon
                name="mininglight"
                style="margin-right: 3px; margin-left: 5px"
              ></svg-icon>
              <span>{{ $t("算力") }}:</span>
              <fly-amount
                :value="d.score"
                :formatOptions="{ precision: 2, trailingZero: true }"
              ></fly-amount>
            </div>
          </div>
          <div
            :class="$style['mining-core-container-slot-item-no-info']"
            v-else
          >
            <div :class="$style['no-nft']">
              <svg-icon
                name="f-add-mining"
                style="width: 38px; height: 38px"
              ></svg-icon>
            </div>
            <p>{{ $t("nftmining.nft-selector-title") }}</p>
          </div>
          <div
            :ref="
              (el) => {
                if (el) state.shadowDOMs[i] = el;
              }
            "
            v-if="d.hasNFT && state.listShow[i]"
            :class="$style['mining-core-container-slot-item-shadow-box']"
          >
            <fly-button
              :class="$style['mining-core-container-slot-item-shadow-box-btn']"
              @click.stop.prevent="
                store.dispatch('StoreNFTMining/removeNFT', {
                  imageLink: d.imageLink,
                  nftName: d.name,
                  order: d.order,
                  meta: d.nftMeta,
                  body: d.nftBody,
                })
              "
              >{{ $t("赎回") }}</fly-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <p
    :class="$style['mining-slot-desc']"
    v-if="!state.isLoading"
    @click="Wallet.unStakeNFT({ provider: state.provider })"
  >
    {{ $t("nftmining.nft-slot-desc") }}
  </p>
  <fly-loading-fish v-if="state.isLoading"></fly-loading-fish>

  <selector-modal
    :dialogParams="state.selectorDialogParams"
    @handleClose="
      store.commit('StoreNFTMining/SET_SELECTOR_DIALOG_PARAMS', {
        dialogVisible: false,
      })
    "
  ></selector-modal>
  <reward-dialog></reward-dialog>
  <second-dialog></second-dialog>
</template>
<script setup>
/* eslint-disable */
import {
  computed,
  onMounted,
  reactive,
  defineProps,
  defineEmits,
  watchEffect,
  watch,
  onUnmounted,
} from "vue";
import SelectorModal from "./SelectorModal.vue";
import TotalPowerCard from "./TotalCard.vue";
import UserPowerCard from "./UserPowerCard.vue";
import changeSlotBgFunc from "./changeSlotBgFunc";
import FlyButton from "@FlyUI/FlyButton.vue";
import CONSTANTS_DIALOG from "@constants/dialog.js";
import SecondDialog from "./SecondDialog.vue";
import RewardDialog from "./RewardDialog.vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlyAmount from "@FlyUI/FlyAmount";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import Wallet from "@wallet";
import { useStore } from "vuex";

const store = useStore();

let state = reactive({
  isLoading: true,
  slotDOMs: [],
  shadowDOMs: [],
  slotArrays: computed(() => store.state.StoreNFTMining.nftStakeList),
  selectorDialogParams: computed(
    () => store.state.StoreNFTMining.selectorDialogParams
  ),
  accounts: computed(() => store.state.StoreWallet.accounts),
  currLang: computed(() => store.state.StoreApp.currLang),
  provider: computed(() => store.state.StoreWallet.stcProvider),
  listShow: [],
});

// const { enterNFTSlot, setSlotBg } = changeSlotBgFunc(state);

const clickSlotEvent = (index, hasNFT) => {
  if (hasNFT) return;
  store.commit("StoreNFTMining/SET_CURRENT_NFT_ORDER", index);
  store.commit("StoreNFTMining/SET_SELECTOR_DIALOG_PARAMS", {
    dialogVisible: true,
  });
};
const getMiningData = () =>
  store.dispatch("StoreNFTMining/getMiningData", state?.accounts[0] || null);

const init = async () => {
  store.dispatch("StoreNFTMining/getNFTfee");
  const data = await getMiningData();
  if (data === "ok") {
    setTimeout(() => {
      state.isLoading = false;
    }, 1500);
  }
};

const changeBtnStatus = (i, flag) => {
  if (flag) {
    state.listShow[i] = true;
    return;
  }
  state.listShow[i] = false;
};

init();

const onceWatch = watchEffect(() => {
  if (state.accounts && state.accounts[0]) {
    Promise.any([
      store.dispatch("StoreNFTMining/getStakeNFTList", state.accounts[0]),
      getMiningData(),
      store.dispatch("StoreNFTMining/getUserNFTList", state.accounts[0]),
    ]).then(() => {
      setTimeout(() => {
        state.isLoading = false;
      }, 1500);
      onceWatch && onceWatch();
    });
  }
});

let polling = (fn) => {
  return new Promise((resolve) => {
    fn();
    setTimeout(() => {
      if (typeof polling === "function") {
        resolve(polling(fn));
      }
    }, 5000);
  });
};

polling(getMiningData);

onUnmounted(() => {
  polling = null;
  store.commit("StoreNFTMining/CLEAR_DATA");
});
</script>
<style lang="scss" module>
.mining-core-container {
  position: relative;
  width: 1200px;
  overflow: hidden;
  margin-top: 38px;
  .mining-core-container-slot-wrap {
    width: 100%;
    margin-top: 32px;
    overflow: hidden;
    .mining-core-container-slot-item-wrap {
      :hover {
        cursor: pointer;
      }
      float: left;
      height: 229px;
      width: 229px;
      margin-right: 13px;
      background: rgba(255, 255, 255, 0.1);
      text-align: center;
      &:last-child {
        margin-right: 0;
      }
      .mining-core-container-slot-item {
        height: 198px;
        background: rgba(255, 255, 255, 0.1);
        width: 198px;
        margin: 16px 15px 16px;
        position: relative;
        .mining-core-container-slot-item-img-box {
          width: 198px;
          height: 198px;
          position: relative;
          img {
            width: 198px;
            height: 198px;
            border: none;
            position: absolute;
            left: 0;
          }
          .mining-core-container-slot-item-img-box-desc {
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 0%,
              #000000 100%
            );
            opacity: 0.74;
            width: 198px;
            padding: 5px 0px;
            color: #fff;
            font-size: 14px;
            position: absolute;
            bottom: 0px;
            z-index: 100;
            text-align: left;
            font-weight: 400;
            span {
              margin-right: 10px;
            }
          }
        }
        .mining-core-container-slot-item-no-info {
          .no-nft {
            padding: 65px 80px 0;
          }
          p {
            margin-top: 24px;
            color: $white;
            font-size: 14px;
          }
        }
        .mining-core-container-slot-item-shadow-box {
          width: 198px;
          height: 198px;
          position: absolute;
          z-index: 1000;
          background: rgba(11, 7, 0, 0.5);
          top: 0;
          cursor: pointer;
          .mining-core-container-slot-item-shadow-box-btn {
            width: 160px;
            height: 30px;
            font-size: 16px;
            line-height: 30px;
            position: relative;
            font-weight: normal;
            padding: 0;
            margin: 84px 19px;
            background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
            box-shadow: 0px 12px 15px 0px rgba(253, 168, 0, 0.39);
            color: #000000;
            border: none;
            &:hover {
              opacity: 0.9 !important;
            }
          }
        }
      }
    }
  }
}
.mining-slot-desc {
  font-weight: 600;
  color: #8b8b8b;
  font-size: 14px;
  margin-top: 51px;
}
</style>
