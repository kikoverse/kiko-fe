<template>
  <div class="fly-connect-wallet">
    <fly-button
      type="dark"
      v-if="state.walletStatus === 'unConnected'"
      @click="connectWalletMethod"
    >
      {{ $t("连接钱包") }}
    </fly-button>
    <div
      class="fly-connect-wallet-connected"
      v-if="state.walletStatus === 'connected'"
    >
      <transition name="slide-fade">
        <span
          class="fly-connect-wallet-connected-amountstc"
          v-if="state.balances && state.balances[CONSTANTS_TOKENS.STC]"
          >{{ stcBalance(state.balances[CONSTANTS_TOKENS.STC]) }}
          <span style="margin-left: 3px">STC</span>
        </span>
      </transition>

      <span class="fly-connect-wallet-connected-account"
        >{{ renderAccount }}
      </span>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive } from "vue";
import FlyButton from "@FlyUI/FlyButton.vue";
import { useStore } from "vuex";
import connectLogic from "@hooks/useMyWallet";
import utilsFormat from "@utils/format";
import Cookies from "js-cookie";
import CONSTANTS_TOKENS from "@constants/token";
const store = useStore();
let state = reactive({
  accounts: computed(() => store.state.StoreWallet.accounts),
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  provider: computed(() => store.state.StoreWallet.stcProvider),
  balances: computed(() => store.state.StoreWallet.balances),
});
const { connectWallet, isStarMaskInstalled, renderAccount, walletInit } =
  connectLogic(store);

const init = async () => {
  const isStalled = isStarMaskInstalled();
  if (!isStalled) return;
  walletInit();
};

init();

onMounted(() => {
  if (Cookies.get("connect-status")) {
    connectWallet();
  }
});

const connectWalletMethod = () => {
  connectWallet();
  Cookies.set("connect-status", "connected", { expires: 7 });
};

const stcBalance = (balance) => {
  return utilsFormat.formatBalance(balance, 9);
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
$h: 35px;
.fly-connect-wallet {
  height: $h;
  display: inline-block;
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
  .fly-button {
    height: $h;
    box-sizing: border-box;
    padding: 0px 16px;
    width: auto;
    max-width: 150px;
  }
  .fly-connect-wallet-connected {
    height: $h;
    font-size: 16px;
    border-radius: 8px;
    background-color: $btn-light-orange-bgcolor;
    display: flex;
    align-items: center;
    .fly-connect-wallet-connected-amountstc {
      background: $btn-orange-bgcolor;
      color: $white;
      border-radius: 8px;
      height: 100%;
      line-height: $h;
      padding: 0px 16px;
      text-align: center;
    }
    .fly-connect-wallet-connected-account {
      color: $text-orange-color;
      width: 80px;
      text-align: center;
      box-sizing: border-box;
    }
  }
}
</style>
