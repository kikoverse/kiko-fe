<template>
  <div v-if="state.list && state.list.length > 0" :class="$style['card-wrap']">
    <div
      v-for="(d, i) in state.list"
      :key="i"
      :class="$style['card-wrap-item']"
      @mouseenter="changeBtnStatus(i, true)"
      @mouseleave="changeBtnStatus(i, false)"
    >
      <div :class="$style['item-content']">
        <img :src="d.imageLink" />
        <p :class="$style['card-wrap-item-text']">
          {{ $t("nftmining.mining-power") }}：
          <fly-amount
            :value="d.score"
            :formatOptions="{
              precision: 2,
              trailingZero: true,
            }"
          >
          </fly-amount>
        </p>
      </div>
      <div v-show="d.isShow" :class="$style['stake-show']">
        <fly-button
          :class="$style['card-wrap-item-btn']"
          @click="
            store.dispatch('StoreNFTMining/stakeNFT', {
              imageLink: d.imageLink,
              id: d.nftId,
              meta: d.nftMeta,
              body: d.nftBody,
            })
          "
          >{{ $t("质押") }}</fly-button
        >
      </div>
    </div>
  </div>
  <user-no-nft v-else></user-no-nft>
</template>
<script setup>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import FlyButton from "@FlyUI/FlyButton.vue";
import FlyAmount from "@FlyUI/FlyAmount";
import UserNoNft from "./UserNoNFT.vue";

const store = useStore();

let state = reactive({
  list: computed(() => store.state.StoreNFTMining.nftList),
});

const changeBtnStatus = (i, flag) => {
  if (flag) {
    state.list[i].isShow = true;
    return;
  }
  state.list[i].isShow = false;
};
</script>
<style lang="scss" module>
.card-wrap {
  display: flex;
  flex-wrap: wrap;
  max-height: 60vh;
  overflow: scroll;
  img {
    width: 144px;
    height: 144px;
  }

  .card-wrap-item {
    width: 144px;
    height: 173px;
    margin-bottom: 24px;
    text-align: center;
    margin-right: 16px;
    position: relative;
    .item-content {
      position: absolute;
      z-index: 99;
    }
    &:nth-child(4n) {
      margin-right: 0;
    }
    .card-wrap-item-text {
      margin-top: 4px;
      color: #ffffff;
      font-size: 14px;
      text-align: left;
    }
    .card-wrap-item-btn {
      margin-top: 3px;
      width: 120px;
      padding: 8px;
      border-radius: 4px;
      font-size: 14px;
      border: none;
      background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
      box-shadow: 0px 12px 15px 0px rgba(253, 168, 0, 0.39);
      margin: 57px 0;
      color: #000000;
      font-size: 16px;
    }
    .stake-show {
      width: 144px;
      height: 144px;
      position: absolute;
      z-index: 1000;
      background: rgba(11, 7, 0, 0.5);
      top: 0;
      cursor: pointer;
    }
  }
}
</style>
