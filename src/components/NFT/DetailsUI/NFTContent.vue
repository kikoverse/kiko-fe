<template>
  <div class="details-content">
    <nft-detail-tab
      :cross_bar_array="state.cross_bar_array"
      @selectCrossTab="selectCrossTab"
      :selected_tab="state.selected_tab"
    ></nft-detail-tab>
    <div class="detail-specific-info-container">
      <div
        class="specific-description"
        v-if="state.selected_tab === 'description'"
      >
        {{
          props.box_detail && state.currLang === "en"
            ? props.box_detail.enDescription
            : props.box_detail.cnDescription
        }}
      </div>
      <div
        class="specific-rarevalue"
        v-if="
          state.selected_tab === 'rarevalue' &&
          props.isNFT &&
          props.box_detail.nftType !== 'COMPOSITE_ELEMENT'
        "
      >
        <nft-detail-specific
          :box_detail="props.box_detail"
        ></nft-detail-specific>
      </div>
      <div
        class="specific-history"
        v-if="
          state.selected_tab === 'history' &&
          props.isNFT &&
          props.box_detail.nftType !== 'COMPOSITE_ELEMENT'
        "
      >
        <nft-detail-history :box_detail="props.box_detail"></nft-detail-history>
      </div>
    </div>
  </div>
</template>
<script setup>
import NftDetailTab from "./NFTDetailTab.vue";
import NftDetailSpecific from "./NFTDetailSpecific.vue";
import NftDetailHistory from "./NFTDetailHistory.vue";
import { reactive, computed, watchEffect } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const store = useStore();
let state = reactive({
  cross_bar_array: null,
  contract_address: computed(() => store.state.StoreNFTDetail.contract_address),
  accounts: computed(() => store.state.StoreWallet.accounts),
  currLang: computed(() => store.state.StoreApp.currLang),
  selected_tab: "",
});
let props = defineProps({
  box_detail: {
    type: Object,
    default: () => {},
  },
  blind_box_type: String,
  isNFT: Boolean,
});
const selectCrossTab = (name) => {
  state.selected_tab = name;
};
const getBarArray = () => {
  if (props.isNFT) {
    if (props.box_detail.nftType === "COMPOSITE_ELEMENT") {
      return [
        {
          id: "description",
          name: t("描述"),
        },
      ];
    } else {
      return [
        {
          id: "description",
          name: t("描述"),
        },
        {
          id: "rarevalue",
          name: t("稀有值"),
        },
        {
          id: "history",
          name: t("历史"),
        },
      ];
    }
  } else {
    return [
      {
        id: "description",
        name: t("描述"),
      },
    ];
  }
};
watchEffect(() => {
  state.cross_bar_array = getBarArray();
  state.selected_tab = state.cross_bar_array?.[0]?.id;
});
</script>
<style lang="scss" scoped>
.details-content {
  margin-top: 70px;
  color: #ffffff;
  .detail-specific-info-container {
    margin-top: 32px;
    font-size: 14px;
    .specific-history {
      height: 100%;
    }
  }
}
</style>
