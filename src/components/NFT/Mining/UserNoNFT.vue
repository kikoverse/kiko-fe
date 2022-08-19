<template>
  <div class="mining-no-data">
    <!-- <img src="../../../assets/nft/f-mining-no-data.png" /> -->
    <SvgIcon name="f-no-data"></SvgIcon>
    <p style="color: #8b8b8b">
      {{ $t("nftmining.nft-selector-nodata") }}
    </p>
    <p class="mining-no-data-link" @click="pushMarket">
      {{ $t("可在市场进行购买") }}
    </p>
  </div>
</template>
<script setup>
import utilsRouter from "@utils/router";
import { useStore } from "vuex";
import SvgIcon from "@components/SvgIcon/Index.vue";
const store = useStore();
const pushMarket = () => {
  store.commit("StoreNFTMining/SET_SELECTOR_DIALOG_PARAMS", {
    dialogVisible: false,
  });
  utilsRouter.push({
    path: "/nftmarket",
  });
};
</script>
<style lang="scss" scoped>
.mining-no-data {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 90px;
  width: 100%;
  height: 60vh;
  font-size: 16px;
  svg {
    display: inline-block;
    margin-bottom: 40px;
    width: 90px;
    height: 90px;
  }
  .mining-no-data-link {
    color: #fba800;
    border-bottom: 1px dashed #fba800;
    cursor: pointer;
  }
}
</style>
