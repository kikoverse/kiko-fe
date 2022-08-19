<template>
  <div class="nft-list-screen">
    <!-- 系列 -->
    <div
      class="nft-list-screen-series"
      v-if="props.isShowSeries && state.series && state.series.length"
    >
      <span class="nft-list-screen-series-title">
        {{ $t("系列") + "：" }}
      </span>
      <div class="nft-list-screen-series-content">
        <div
          v-for="(d, i) in state.series"
          :key="d.groupId"
          class="nft-list-screen-series-content-item"
          :class="d.active ? 'active' : ''"
          @click="clickSelectJoint(d, 'series')"
        >
          <span>{{ i === 0 ? $t(d.groupName) : d.groupName }}</span>
        </div>
      </div>
    </div>
    <!-- 排序 -->
    <fly-space :size="15" v-if="props.isShowSort"></fly-space>
    <div class="nft-list-screen-sort" v-if="props.isShowSort">
      <div class="nft-list-screen-sort-tabs">
        <span class="nft-list-screen-sort-tabs-title">
          {{ $t("排序") + "：" }}
        </span>
        <div class="nft-list-screen-sort-tabs-content">
          <div
            class="nft-list-screen-sort-tabs-content-item"
            v-for="d in state.sort"
            :key="d.key"
            :class="d.active ? 'active' : ''"
            @click="clickSelectJoint(d, 'sort')"
          >
            <span>{{ $t(d.name) }}</span>
          </div>
        </div>
      </div>

      <list-screen-open-status
        v-if="props.isShowOpenStatus"
        :showTips="props.showTips"
        @clickRadio="clickRadio"
      ></list-screen-open-status>
    </div>
    <!-- 收藏使用 -->
    <!-- <fly-space :size="15" v-if="props.isShowCollection"></fly-space> -->
    <div class="nft-list-screen-collection" v-if="props.isShowCollection">
      <div class="nft-list-screen-collection-tabs">
        <div
          v-for="d in props.tabList || state.tabList"
          :key="d.key"
          class="nft-list-screen-collection-item"
          :class="{ active: d.key === state.collectionActiveTab }"
          @click="changeTab(d.key)"
        >
          {{
            d.showCount && d.num > 0
              ? $t(d.name) + "(" + d.num + ")"
              : $t(d.name)
          }}
        </div>
      </div>
      <list-screen-open-status
        v-show="props.isShowOpenStatus"
        :showTips="props.showTips"
        @clickRadio="clickRadio"
      ></list-screen-open-status>
    </div>
  </div>
</template>
<script setup>
import {
  reactive,
  defineEmits,
  defineProps,
  computed,
  onMounted,
  watch,
} from "vue";
import { useStore } from "vuex";
import FlySpace from "@FlyUI/FlySpace.vue";
import ListScreenOpenStatus from "./ListScreenOpenStatus.vue";
const store = useStore();
const props = defineProps({
  isTab: {
    type: Boolean,
    default: false,
  },
  tabType: {
    type: String,
    default: "",
  },
  tabList: {
    type: Object,
  },
  collectionActiveTab: {
    type: Number,
    default: 1,
  },
  showTips: {
    type: Boolean,
    default: true,
  },
  isShowCollection: {
    type: Boolean,
    default: false,
  },
  isShowSort: {
    type: Boolean,
    default: false,
  },
  isShowSeries: {
    type: Boolean,
    default: false,
  },
  isShowOpenStatus: {
    type: Boolean,
    default: false,
  },
});
let state = reactive({
  series: computed(() => store.state.StoreBuyBack.seriesList),
  groupId: computed(() => store.state.StoreBuyBack.groupId),
  collectionActiveTab: props.collectionActiveTab,
  tabList: null,
  sort: [
    {
      name: "默认",
      key: 4,
      value: "0",
      active: true,
    },
    {
      name: "价格从高到低",
      key: 5,
      value: "1",
      active: false,
    },
    {
      name: "价格从低到高",
      key: 6,
      value: "2",
      active: false,
    },
    {
      name: "稀有值从高到低",
      key: 7,
      value: "3",
      active: false,
    },
  ],
});
//筛选点击效果
let clickSelectJoint = (d, type) => {
  if (type === "series") {
    state.series.map((item) => {
      item.active = item.groupId === d.groupId ? true : false;
    });
  } else {
    state.sort.map((item) => {
      item.active = item.key === d.key ? true : false;
    });
  }
  emits("clickSelectJoint", {
    groupId: state.series.filter((item) => item.active)[0].groupId,
    sort: state.sort.filter((item) => item.active)[0],
  });
};

watch(
  () => props.collectionActiveTab,
  (n) => {
    state.collectionActiveTab = n;
  }
);
//未打开已打开点击效果
let clickRadio = (n) => {
  emits("clickRadio", n);
};
watch(
  () => props.tabList,
  (n) => {
    state.tabList = n;
  }
);
let changeTab = (i) => {
  emits("changeTab", i);
};
onMounted(() => {
  store.dispatch("StoreBuyBack/getSeriesList");
});
const emits = defineEmits(["clickSelectJoint", "clickRadio", "changeTab"]);
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.nft-list-screen {
  width: 100%;
  margin: 0 auto;
  font-size: 15px;
  font-weight: bold;
  .nft-list-screen-series {
    display: flex;
    .nft-list-screen-series-tabs {
      display: flex;
      justify-content: space-between;
    }
    .nft-list-screen-series-title {
      cursor: pointer;
      width: 90px;
    }
    .nft-list-screen-series-content {
      display: flex;
      flex-wrap: wrap;
      width: 80%;
      .nft-list-screen-series-content-item {
        margin: 0px 10px;
        margin-bottom: 7px;
        cursor: pointer;
        span {
          &:hover {
            cursor: pointer;
            opacity: 0.65;
          }
        }
        &.active {
          span {
            color: $text-orange-color;
          }
        }
      }
    }
  }
  .nft-list-screen-sort {
    display: flex;
    justify-content: space-between;
    .nft-list-screen-sort-tabs {
      display: flex;
      .nft-list-screen-sort-tabs-title {
        cursor: pointer;
        width: 90px;
      }
      .nft-list-screen-sort-tabs-content {
        display: flex;
        .nft-list-screen-sort-tabs-content-item {
          margin: 0 10px;
          padding-bottom: 8px;
          &.active {
            border-bottom: 4px solid $border-orange-color;
            color: $text-orange-color;
          }
          &:hover {
            cursor: pointer;
            opacity: 0.65;
          }
        }
      }
    }
  }
  .nft-list-screen-collection {
    display: flex;
    position: relative;
    .nft-list-screen-collection-tabs {
      display: flex;
      flex: 3;
      justify-content: center;
      .nft-list-screen-collection-item {
        cursor: pointer;
        padding-bottom: 8px;
        color: #8c8b8c;
        padding: 7px 18px;
        border-radius: 4px;

        &.active {
          color: $white;
          background: rgba(255, 255, 255, 0.15);
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
