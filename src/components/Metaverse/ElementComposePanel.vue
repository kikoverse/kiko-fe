<template>
  <div
    :class="$style['compose-container']"
    class="compose-container"
    v-if="state.metaData"
  >
    <div :class="$style['role-box']">
      <div :class="$style['role-box-score']">
        <svg-icon name="f-rarity" style="margin-right: 3px"></svg-icon>
        <fly-amount
          :value="state.totalScore"
          :formatOptions="{ precision: 0, trailingZero: true }"
        >
        </fly-amount>
      </div>
      <!-- <img src="../../assets/metaverse/right-empty-box.png" /> -->
      <template
        v-if="state.selectedElementList && state.selectedElementList.length > 0"
      >
        <img
          v-for="(d, i) in state.selectedElementList"
          :src="d.image"
          :key="i"
          :style="{ zIndex: d.maskOrder }"
        />
      </template>
    </div>
    <fly-space :size="20"></fly-space>
    <div :class="$style['info-box']">
      <fly-space :size="20"></fly-space>
      <template v-if="state.walletStatus === 'connected'">
        <fly-button
          v-if="
            state.selectedElementList && state.selectedElementList.length > 0
          "
          :class="[$style['create-btn']]"
          @click="
            store.commit('StoreMeta/SET_CREATE_DIALOG_PARAMS', {
              dialogVisible: true,
            })
          "
        >
          {{ $t("metaverse.next") }}
        </fly-button>
        <fly-button v-else type="disabled" :class="[$style['create-btn']]">
          {{ $t("metaverse.next") }}
        </fly-button>
      </template>
      <template v-else>
        <fly-button @click="connectWallet" :class="[$style['create-btn']]">
          {{ $t("链接钱包") }}
        </fly-button>
      </template>
    </div>
  </div>
  <validate-error-modal></validate-error-modal>
</template>
<script setup>
import { computed, reactive } from "vue";
import FlyButton from "@FlyUI/FlyButton.vue";
import FlyAmount from "@FlyUI/FlyAmount.vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import { useStore } from "vuex";
import connectLogic from "@hooks/useMyWallet";
import ValidateErrorModal from "./ValidateErrorModal.vue";
const store = useStore();
const { connectWallet } = connectLogic(store);

const state = reactive({
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
</script>

<style lang="scss" module>
.compose-container {
  margin-left: 60px;
  .role-box {
    position: relative;
    text-align: center;
    width: 426px;
    height: 436px;
    background: rgba(216, 216, 216, 0.2);
    margin: 0 auto;
    .role-box-score {
      z-index: 99;
      min-width: 62px;
      height: 24px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 16px;
      position: absolute;
      padding: 0px 5px;
      right: 5px;
      top: 5px;
      line-height: 24px;
      color: $theme-light-color;
      font-size: 14px;
    }
    img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }
  .info-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    // background: rgba(0,s 0, 0, 0.4);
    .create-btn {
      width: 426px;
      padding: 0px;
      height: 60px;
      line-height: 60px;
      font-size: 16px;
    }
  }
}
</style>
