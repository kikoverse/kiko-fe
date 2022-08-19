<template>
  <div class="nft-selector" v-if="state.nftSeriesList">
    <div>
      <!-- 系列 -->
      <!-- <ElSelect
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
      </ElSelect> -->
      <!-- 类型 -->
      <ElSelect
        class="type-select"
        v-model="state.nftTypeValue"
        :suffix-icon="SelectSuffix"
        :popper-append-to-body="false"
      >
        <ElOption
          v-for="d in state.nftTypesList"
          :key="d.value"
          :label="d.label"
          :value="d.value"
        ></ElOption>
      </ElSelect>
    </div>

    <div class="nft-selector-sort" @click="changeSortDir">
      <div class="sort-item">
        <img
          src="../../assets/nft/arrow-up.png"
          v-if="state.sortDirValue === 'desc'"
        />
        <img
          src="../../assets/nft/arrow-down.png"
          v-if="state.sortDirValue === 'asc'"
        />
      </div>
      <!-- 排序类别 -->
      <ElSelect
        class="sort-select"
        v-model="state.sortRule"
        :suffix-icon="SelectSuffix"
        :popper-append-to-body="false"
      >
        <ElOption
          v-for="d in state.sortList"
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
import { computed, onMounted, reactive, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import commonApi from "@api/common";
import { useI18n } from "vue-i18n";
import SelectSuffix from "@components/SelectSuffix.vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import { nftTypesList, sortList } from "./selector.js";
import utilsFormat from "@utils/format";

const { t } = useI18n();
const store = useStore();
const emits = defineEmits(["filterEvent"]);
const state = reactive({
  nftSeriesList: null,
  nftSeriesValue: "",
  nftTypesList: nftTypesList,
  nftTypeValue: "",
  sortList: sortList,
  sortRule: "ctime",
  sortDirValue: "asc",
  initLoad: true,
});

const setSeriesList = (list) => {
  list.unshift({
    groupId: "",
    groupName: utilsFormat.computedLangCtx("all collections"),
    seriesName: utilsFormat.computedLangCtx("all collections"),
  });
  list = list.map((d) => {
    return {
      ...d,
      label: d.groupName,
      value: d.groupId,
    };
  });
  state.nftSeriesList = list;
};

watch(
  () => [
    state.sortRule,
    state.sortDirValue,
    state.nftTypeValue,
    state.nftSeriesValue,
  ],
  (newValues) => {
    const params = {
      sortRule: newValues[0],
      sort: newValues[1] === "asc" ? 1 : 2,
      nftType: newValues[2],
      groupId: newValues[3],
    };
    emits("filterEvent", params);
  },
  {
    deep: true,
    immediate: true,
    flush: "sync",
  }
);

onMounted(() => {
  commonApi.getNFTSeriesList().then((res) => {
    if (res.code === 200) {
      let result = [];
      for (let i = 0; i < res.data.length; i++) {
        result.push(res.data[i]);
      }
      setSeriesList(result);
    }
  });
});

const changeSortDir = () => {
  // if (state.sortDirValue) {}
  state.sortDirValue = state.sortDirValue === "asc" ? "desc" : "asc";
};
</script>

<style scoped lang="scss">
@import "~@/styles/_vars.scss";
.nft-selector {
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

  .type-select {
    margin-left: 20px;
    width: 144px;
  }
  .sort-select {
    width: 128px;
    ::v-deep(.el-select-dropdown) {
      width: 128px;
    }
  }
}
.nft-selector {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .nft-selector-sort {
    display: flex;
    align-items: center;
    .sort-item {
      cursor: pointer;
      width: 32px;
      height: 36px;
      text-align: center;
      line-height: 36px;
      margin-right: 6px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.15);
      img {
        vertical-align: middle;
      }
    }
  }
}
</style>
<style lang="scss" module></style>
