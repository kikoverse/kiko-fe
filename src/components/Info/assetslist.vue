<template>
  <div :class="$style['container-list']">
    <p :class="$style['container-list-title']">{{ $t("行情") }}</p>
    <fly-space :size="20"></fly-space>
    <div
      :class="$style['container-list-content']"
      v-if="state.assetsList && state.assetsList.length > 0"
    >
      <div :class="$style['container-list-content-tabs']">
        <div
          v-for="(d, i) in state.tabs"
          :key="i"
          :class="$style['container-list-content-tabs-item']"
        >
          {{ $t(d) }}
        </div>
      </div>
      <div :class="$style['container-list-content-body']">
        <div
          :class="$style['container-list-content-body-item']"
          v-for="(d, i) in state.assetsList"
          :key="i"
        >
          <span
            :class="$style['container-list-content-body-item-ml']"
            style="font-weight: bold"
          >
            {{ d.sort + 1 }}</span
          >
          <div :class="$style['container-list-content-body-item-name']">
            <img :src="d.icon" />
            <span style="font-weight: bold"> {{ d.name }}</span>
          </div>
          <span :class="$style['container-list-content-body-item-flex2']">
            <fly-amount
              :value="d.price"
              displayPreFix="$"
              :formatOptions="{
                precision: 4,
              }"
            >
            </fly-amount>
          </span>
          <span :class="$style['container-list-content-body-item-flex2']">
            <fly-amount
              :value="d.rate"
              :formatOptions="{
                precision: 2,
                showSign: true,
                percentStyle: true,
              }"
              :isShowTradeColor="true"
            >
            </fly-amount>
          </span>
          <span :class="$style['container-list-content-body-item-flex2']">
            <fly-amount
              :value="d.amount"
              :formatOptions="{
                precision: 2,
                compact: true,
                grouped: true,
              }"
              displayPreFix="$"
            >
            </fly-amount>
          </span>
          <span :class="$style['container-list-content-body-item-flex2']">
            <fly-amount
              :value="d.liquidity"
              :formatOptions="{
                precision: 2,
                compact: true,
                grouped: true,
              }"
              displayPreFix="$"
            >
            </fly-amount>
          </span>
        </div>
      </div>
      <div :class="$style['container-list-content-footer']">
        <fly-pagination
          @pageEvent="pageEvent"
          :disabled="[
            state.queryParams.pageNum === 1,
            state.queryParams.hasNext,
          ]"
        ></fly-pagination>
        <!-- <pagination
          :total="state.assetsList.length"
          :assetsList="state.assetsList"
          v-model:currentPage="currentPage"
          @current-change="handleCurrentChange"
          @prev-click="pageEvent({ type: 'prev', currentPage: currentPage })"
          @next-click="pageEvent({ type: 'next', currentPage: currentPage })"
        ></pagination> -->
      </div>
    </div>
    <fly-loading-fish
      v-if="!state.assetsList || state.assetsList.length === 0"
    ></fly-loading-fish>
    <FlySpecialBg></FlySpecialBg>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive } from "vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import FlyPagination from "@FlyUI/FlyPagination.vue";
// import Pagination from "@FlyUI/Pagination.vue";
import FlyAmount from "@FlyUI/FlyAmount.vue";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import FlySpecialBg from "@FlyUI/FlySpecialBg.vue";
import { useStore } from "vuex";
const store = useStore();
let state = reactive({
  tabs: ["#", "名称", "价格", "价格变化", "24小时交易额", "TVL"],
  assetsList: computed(() => store.state.StoreInfo.assetsList),
  queryParams: computed(() => store.state.StoreInfo.queryParams),
});

onMounted(() => {
  store.dispatch("StoreInfo/getAssetsList", { type: "init" });
});

// let currentPage = ref(1);

const pageEvent = (type) => {
  store.dispatch("StoreInfo/getAssetsList", { type });
};

// const handleCurrentChange = (val) => {
//   pageEvent({ type: "current", currentPage: val });
// };
</script>
<style lang="scss" module>
.container-list {
  width: 100%;
  padding-top: 72px;
  .container-list-title {
    color: #fff;
    font-weight: 500;
    font-size: 24px;
  }
  .container-list-content {
    width: 100%;
    border-radius: 8px;
    .container-list-content-tabs {
      padding: 0px 24px;
      display: flex;
      font-weight: 600;
      height: 66px;
      color: #fff;
      justify-content: space-around;
      align-items: center;
      .container-list-content-tabs-item:first-child {
        flex: 0.3;
      }
      .container-list-content-tabs-item:not(:first-child) {
        flex: 2;
        display: flex;
        justify-content: flex-end;
        overflow: hidden;
      }
      .container-list-content-tabs-item:nth-child(2) {
        flex: 2;
        display: flex;
        justify-content: flex-start;
        overflow: hidden;
      }
    }
    .container-list-content-body {
      .container-list-content-body-item {
        display: flex;
        padding: 0px 24px;
        height: 89px;
        align-items: center;
        margin-top: 16px;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.09);
        border-radius: 8px;
        .container-list-content-body-item-ml {
          color: #fff;
          flex: 0.3;
        }
        .container-list-content-body-item-name {
          color: #fff;
          flex: 2;
          display: flex;
          align-items: center;
          overflow: hidden;
          img {
            width: 30px;
          }
          img + span {
            margin-left: 10px;
          }
        }
        .container-list-content-body-item-flex2 {
          flex: 2;
          display: flex;
          overflow: hidden;
          color: #fff;
          font-weight: 400;
          justify-content: flex-end;
        }
        &:hover {
          opacity: 0.7;
        }
      }
    }
    .container-list-content-footer {
      padding: 20px 0px;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
