<template>
  <div class="no-liquidity-data">
    <!-- <fly-space :size="40"></fly-space> -->
    <!-- <p>未找到流動性 您可以添加流動性以獲取LP Token並享受額外代幣激勵</p> -->
    <p>{{ $t("未找到流动性") }}</p>
    <p>{{ $t("您可以添加流动性以获取LP Token并享受额外代币激励") }}</p>
    <Fly-space :size="40"></Fly-space>
    <Fly-button class="no-liquidity-data-btn" @click="addPool"
      >{{ state === "unConnected" ? $t("连接钱包") : $t("添加流动性") }}
    </Fly-button>
  </div>
</template>
<script setup>
import FlyButton from "@FlyUI/FlyButton.vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import { useStore } from "vuex";
import connectLogic from "@hooks/useMyWallet";
import { computed, ref } from "vue";
const store = useStore();
const { connectWallet } = connectLogic(store);
let state = ref(computed(() => store.state.StoreWallet.walletStatus));
const addPool = () => {
  if (state.value === "unConnected") {
    connectWallet();
    return;
  }
  store.commit("StoreLiquidity/CHANGE_POOL_TYPE", "add");
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.no-liquidity-data {
  font-size: 14px;
  color: $text-white-color;
  .no-liquidity-data-btn {
    width: 100%;
    width: 100%;
    padding: 15px 0px;
    font-weight: bold;
  }
}
</style>
