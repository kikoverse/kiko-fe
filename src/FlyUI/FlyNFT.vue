<template>
  <div class="fly-nft">
    <fly-space :size="25"></fly-space>
    <flyUI-change-button
      :activeIndex="state.activeIndex"
      :tabs="state.tabs"
      class="fly-nft-header"
    ></flyUI-change-button>
    <fly-space :size="25"></fly-space>
    <slot name="nft-header"></slot>
    <div
      class="nft-card-core"
      v-if="props.coreType === 'card'"
      :style="{ 'min-height': props.cardTypeParams.minHeight }"
    >
      <slot name="nft-card"> </slot>
    </div>
    <div
      :class="{ 'nft-card-core': props.cardStyleType }"
      v-if="props.coreType === 'list'"
      :style="{ 'min-height': props.listTypeParams.minHeight }"
    >
      <slot name="nft-list"> </slot>
    </div>
    <slot name="nft-no-data"></slot>
  </div>
</template>
<script setup>
import { reactive, defineProps, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import FlyUIChangeButton from "@FlyUI/FlyUIChangeButton.vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import { findIndex } from "lodash";
const route = useRoute();

let state = reactive({
  tabs: [
    {
      label: "系列",
      path: "/nftblindbox",
    },
    {
      label: "市场",
      path: "/nftmarket",
    },

    {
      label: "我的NFT",
      path: {
        name: "nftcollection",
        params: {
          tabIndex: "0",
        },
      },
    },
    {
      label: "创建系列",
      path: "/createCollection",
    },
    {
      label: "平台回购",
      path: "/nftbuyback",
    },
    {
      label: "NFT挖矿",
      path: "/nftmining",
    },
  ],
  activeIndex: null,
});
let props = defineProps({
  coreType: String,
  cardStyleType: {
    type: Boolean,
    default: false,
  },
  listTypeParams: {
    type: Object,
    default: () => {
      return {
        minHeight: "",
      };
    },
  },
  cardTypeParams: {
    type: Object,
    default: () => {
      return {
        minHeight: "",
      };
    },
  },
});

onMounted(() => {
  const path = ref(route.path).value;
  console.log(path);
  state.activeIndex = findIndex(state.tabs, { path });
  if (path.indexOf("/nftcollection") > -1) {
    state.activeIndex = 2;
  }
});
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/_vars.scss";
.fly-nft {
  width: 1200px;
  .fly-nft-header {
    width: 100%;
    background: rgba(255, 255, 255, 0.15);
  }
  .nft-card-core {
    width: 100%;
    height: auto;
    border-radius: 34px;
    padding: 35px 0;
    box-sizing: border-box;
  }
}
</style>
