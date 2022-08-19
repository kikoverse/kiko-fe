<template>
  <div class="fly-search" v-if="state.visible">
    <Fly-dialog
      :title="$t('选择代币')"
      :dialogVisible="state.visible"
      :isClickModal="false"
      @handleClose="handleClose"
    >
      <template #content>
        <div class="search">
          <p class="input-box">
            <ElInput
              v-model="state.searchValue"
              class="input-el"
              :placeholder="$t('搜索名称或粘贴地址')"
            />
          </p>
          <ul class="list">
            <li
              class="item"
              v-for="(item, i) in state.filterData"
              :key="i"
              @click="handleSelect(item)"
            >
              <img :src="item.icon" alt="" class="icon" />
              <!-- <svg-icon name="BTC" class="icon"></svg-icon> -->
              <p class="info">
                <strong>{{ item.shortName }}</strong>
                <span>{{ item.fullName }}</span>
              </p>
            </li>
          </ul>
        </div>
        <ElEmpty
          v-if="state.listData.length === 0"
          :description="$t('暂无数据')"
        />
      </template>
    </Fly-dialog>
  </div>
</template>

<script setup>
/* eslint-disable */
import FlyDialog from "@FlyUI/FlyDialog.vue";
import {
  reactive,
  defineProps,
  onMounted,
  watch,
  defineEmits,
  onUpdated,
  computed,
  watchEffect,
} from "vue";
import { useStore } from "vuex";

const store = useStore();

let state = reactive({
  visible: props.dialogVisible,
  searchValue: "",
  listData: computed(() => store.state.StoreCommon.currencyList),
  filterData: [],
});
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
});
watchEffect(() => {
  if (state.listData && state.listData.length) {
    state.filterData = state.listData;
  }
});
watch(
  () => props.dialogVisible,
  (n) => {
    state.visible = n;
  }
);
onUpdated(() => {
  state.searchValue = "";
});
watch(
  () => state.searchValue,
  (n) => {
    state.filterData = state.listData.filter(
      (item) => item.fullName.includes(n) || item.address.indexOf(n) !== -1
    );
  }
);

const emits = defineEmits(["handleClose", "handleSelect"]);

const handleClose = () => {
  emits("handleClose", false);
};

const handleSelect = (item) => {
  emits("handleSelect", item);
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@styles/mixin.scss";
.fly-search {
  ::v-deep(.el-dialog) {
    background-image: url("../../src/assets/common/bg.png");
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100%;
  }
  ::v-deep(.el-dialog__body) {
    padding: 14px 0 32px;
  }
  .search {
    max-height: 450px;
    overflow-y: scroll;
    .input-box {
      margin-bottom: 20px;
      padding: 0 28px;
    }
    ::v-deep(.el-input__inner) {
      width: 388px;
      height: 44px;
      background: rgba(255, 255, 255, 0.08);
      // box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.43),
      //   0px -2px 0px 0px rgba(0, 0, 0, 0.13);
      border-radius: 8px;
      border: none;
      // border-color: #ededed;
      font-size: 16px;
      font-weight: bold;
      color: #fff;
    }
    .item {
      width: 100%;
      list-style: none;
      margin-bottom: 10px;
      overflow: hidden;
      display: flex;
      padding: 6px 28px;
      box-sizing: border-box;
      color: $text-white-color;
      &:hover {
        @include commonHoverStyle2();
      }
    }
    .icon {
      margin-right: 20px;
      width: 24px;
      height: 24px;
      margin-top: 9px;
      border-radius: 10px;
    }
    .info {
      strong,
      span {
        display: block;
      }
    }
  }
}
</style>
