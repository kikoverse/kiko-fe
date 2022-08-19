<template>
  <div class="nft-selector" v-if="state.nftSeriesList">
    <div>
      <!-- 系列 -->
      <ElSelect
        class="series-select"
        v-model="state.nftSeriesValue"
        :suffix-icon="SelectSuffix"
        :popper-append-to-body="false"
      >
        <ElOption
          v-for="d in state.nftSeriesList"
          :key="d.value"
          :label="d.label"
          :value="d.value"
        ></ElOption>
      </ElSelect>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import { onMounted, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import SelectSuffix from "@components/SelectSuffix.vue";
import utilsFormat from "@utils/format";
import metaApi from "@api/meta";

const emits = defineEmits(["filterEvent"]);
const state = reactive({
  nftSeriesList: null,
  nftSeriesValue: "",
});

const setSeriesList = (list) => {
  list = list.map((d) => {
    return {
      ...d,
      label: d.seriesName,
      value: d.series,
    };
  });
  state.nftSeriesList = list;
};

watch(
  () => state.nftSeriesValue,
  (newValues) => {
    if (state.nftSeriesList) {
      const obj = state.nftSeriesList.filter(
        (item) => item.series === newValues
      );
      emits("filterEvent", obj[0]);
    }
  },
  {
    deep: true,
    immediate: true,
    flush: "sync",
  }
);

onMounted(() => {
  metaApi.getSeriesList().then((res) => {
    if (res.code === 200) {
      let result = [];
      for (let i = 0; i < res.data.length; i++) {
        result.push(res.data[i]);
      }
      state.nftSeriesValue = result[0].series;
      setSeriesList(result);
      emits("filterEvent", result[0]);
    }
  });
});
</script>

<style scoped lang="scss">
@import "~@/styles/_vars.scss";
.nft-selector {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .series-select {
    width: 193px;
  }
  ::v-deep(.el-input) {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    height: 36px;
    border: none;
  }
  ::v-deep(.el-input__inner) {
    height: 36px;
    color: $white;
    border: none;
    text-indent: 18px;
    padding: 0;
    background: rgba(255, 255, 255, 0.15);
  }
  ::v-deep(.el-input__inner:focus) {
    border: none;
  }
  ::v-deep(.el-select__popper.el-popper[role="tooltip"]) {
    border: none;
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
    border-radius: 8px;
  }
  ::v-deep(.el-select-dropdown) {
    width: 144px;
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
    border: none;
    border-radius: 8px;
    .el-select-dropdown__list {
      margin-top: 14px !important;
    }
    .el-select-dropdown__item.selected {
      color: $white;
      font-weight: 400;
      background: rgba(255, 255, 255, 0.1);
    }
    .el-select-dropdown__item.hover,
    .el-select-dropdown__item:hover {
      color: $white;
      background: rgba(255, 255, 255, 0.1);
    }
  }
  ::v-deep(.el-popper.is-light .el-popper__arrow::before) {
    display: none;
  }
  ::v-deep(.el-select__popper.el-popper[role="tooltip"]
      .el-popper__arrow::before) {
    border: none;
    display: none;
  }
}
</style>
<style lang="scss" module></style>
