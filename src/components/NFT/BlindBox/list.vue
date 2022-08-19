<template>
  <div>
    <fly-scroll
      :hasMore="state.listStatus.hasMore"
      :isLoading="state.listStatus.isLoading"
      :isShowMore="false"
      @loadMore="loadMore"
      :textLoading="false"
      gifType="white"
      :imgLoading="true"
      v-if="state.listData && state.listData.length > 0 && !state.firstLoading"
    >
      <template #content>
        <div class="nft-list-content">
          <div class="nft-blindbox-list">
            <div
              v-for="(d, i) in state.onSellOrWillSellData"
              :key="i"
              :set="(sellInfo = sellStatus(d.type, d.sellingTime))"
              @click="pushDetailPage(d.id)"
              class="nft-blindbox-list-item"
            >
              <div
                v-if="sellInfo.status !== 'sellout'"
                class="nft-blindbox-content-box"
              >
                <p
                  class="nft-blindbox-list-item-right-status"
                  :class="sellInfo.status"
                >
                  {{ $t(sellInfo.text) }}
                </p>
                <div class="nft-blindbox-content">
                  <div class="nft-blindbox-list-item-right">
                    <p class="nft-blindbox-list-item-right-title">
                      {{ d.seriesName }}-{{ d.name }}
                    </p>
                    <fly-space :size="32"></fly-space>
                    <div class="nft-blindbox-list-item-right-detail">
                      <div class="details-item-info">
                        <p>{{ $t("售价") }}</p>
                        <span>
                          {{ d.sellingPrice }}
                          {{ utilsFormat.getTokenCurrency(d.payToken) }}
                        </span>
                      </div>
                      <div class="details-item-info">
                        <p>{{ $t("发行数量") }}</p>
                        <span>
                          {{ d.seriesQuantity }}
                        </span>
                      </div>
                      <div class="details-item-info">
                        <p>{{ $t("剩余数量") }}</p>
                        <span>
                          {{ d.amount }}
                        </span>
                      </div>
                    </div>
                    <fly-space :size="25"></fly-space>

                    <p
                      class="nft-blindbox-list-item-right-countdown"
                      v-if="sellInfo.status === 'willsell'"
                    >
                      <span>{{ $t("发售倒计时") }}</span>
                      <span class="countdown" v-if="state.countdown">
                        <i>{{ state.countdown["day"] }}</i> :
                        <i>{{ state.countdown["hours"] }}</i> :
                        <i>{{ state.countdown["minutes"] }}</i> :
                        <i>{{ state.countdown["seconds"] }}</i>
                      </span>
                    </p>
                    <div
                      v-if="sellInfo.status === 'selling'"
                      class="buy-button actions-button"
                      @click="pushDetailPage(d.id)"
                    >
                      {{ $t("购买") }}
                    </div>
                  </div>
                  <img :src="d.seriesLogo" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div
            class="nft-past-list"
            :style="
              state.onSellOrWillSellData.length === 0 ? 'padding-top:55px' : ''
            "
          >
            <nft-card-item
              v-for="d in state.listData"
              :key="d.id"
              class="blind-list-unsold-item"
              :baseData="d"
              @click="pushDetailPageNew(d)"
            >
            </nft-card-item>
          </div>
        </div>
      </template>
    </fly-scroll>
    <fly-loading-fish
      style="margin-top: 30px"
      gifType="white"
      v-if="state.firstLoading"
    ></fly-loading-fish>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, onUnmounted, watch } from "vue";
import FlySpace from "@FlyUI/FlySpace.vue";
import { cloneDeep } from "lodash";
import dayjs from "dayjs";
import utilsFormat from "@utils/format";
import FlyLoadingFish from "@FlyUI/FlyLoadingFish.vue";
import FlyScroll from "@FlyUI/FlyScroll.vue";
import NftCardItem from "@components/NFT/NFTCollectionItem.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();

let state = reactive({
  listData: computed(() => store.state.StoreBlindBox.listData),
  timers: null,
  listStatus: computed(() => store.state.StoreBlindBox.listStatus),
  firstLoading: computed(() => store.state.StoreBlindBox.firstLoading),
  hasOnSellOrWillSell: true,
  onSellOrWillSellData: [],
  soldOutData: [],
  countdown: { day: "00", hours: "00", minutes: "00", seconds: "00" },
});

// let getCountDown = (timestamp) => {
//   if (timestamp) {
//     // setTimeout(() => {
//     const res = utilsTools.getCountDownDetails(timestamp);
//     state.countdown = res;
//     // }, 1000);
//   }
// };

onUnmounted(() => {
  // getCountDown = null;
});

const loadMore = () => {
  store.dispatch("StoreBlindBox/getOfferingList", { type: "scroll" });
};

watch(
  () => state.listData,
  () => {
    setData();
    state.timers = cloneDeep(state.listData);
    state.timers.map((d) => {
      if (d.type === "willsell") {
        d.countdown = d.sellingTime;
      } else if (d.type === "sellout") {
        state.hasOnSellOrWillSell = false;
      } else {
        d.countdown = "";
      }
    });
  }
);
// onUpdated(() => {
//   store.dispatch("StoreBlindBox/getOfferingList", { type: "init" });
// });

onMounted(async () => {
  setData();
  if (!state.listData || (state.listData && state.listData.length === 0)) {
    const data = await store.dispatch("StoreBlindBox/getOfferingList", {
      type: "init",
    });
    if (data && data.length) {
      state.timers = cloneDeep(data);
      state.timers.map((d) => {
        if (d.type === "willsell") {
          d.countdown = d.sellingTime;
        } else if (d.type === "sellout") {
          state.hasOnSellOrWillSell = false;
        } else {
          d.countdown = "";
        }
      });
    }
  }
});

const setData = () => {
  let newListData = state.listData.map((d) => {
    return {
      ...d,
      status: sellStatus(d.type, d.sellingTime).status,
    };
  });
  state.onSellOrWillSellData = newListData.filter(
    (d) => d.status !== "sellout"
  );
  state.soldOutData = newListData.filter((d) => d.status === "sellout");
};

onUnmounted(() => {
  // store.commit("StoreBlindBox/CLEAR_DATA");
});

const pushDetailPageNew = (data) => {
  if (data.seriesType == 1) {
    router.push({
      path: "/myCollectionDetail",
      query: { groupId: data.id },
    });
  } else {
    router.push({
      path: `/nftblindbox/${data.id}`,
    });
  }
};
const pushDetailPage = (groupId) => {
  router.push({
    path: `/nftblindbox/${groupId}`,
  });
};

const sellStatus = (type, sellingTime) =>
  /* eslint-disable-next-line */
  computed(() => {
    {
      if (type === "willsell") {
        if (dayjs().isAfter(sellingTime)) {
          return {
            status: "selling",
            text: "正在发售",
          };
        }
        return {
          status: "willsell",
          text: "即将发售",
        };
      }
      if (type === "selling") {
        return {
          status: "selling",
          text: "正在发售",
        };
      }
      if (type === "sellout") {
        return {
          status: "sellout",
          text: "已售罄",
        };
      }
    }
  }).value;
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.blind-list-unsold-item {
  margin-right: 28px;
  &:nth-child(3n) {
    margin-right: 0;
  }
}
.nft-blindbox-list {
  margin-top: 47px;
  position: relative;
  .nft-blindbox-list-item-right-status {
    font-size: 24px;
    color: $white;
    font-weight: bold;
  }
  .nft-blindbox-list-item:not(:first-child) {
    margin-top: 20px;
  }
  .nft-blindbox-list-item {
    width: 100%;
    cursor: pointer;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 72px;
    &:hover {
      opacity: 0.9;
    }
    .nft-blindbox-content-box {
      position: relative;
    }
    .nft-blindbox-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
    }
    img {
      width: 600px;
      height: 326px;
      border-radius: 16px;
    }
    .nft-blindbox-list-item-right {
      text-align: left;
      width: calc(100% - 672px);
      height: 243px;
      background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
      position: relative;
      top: 16px;
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      padding-left: 73px;
      padding-top: 51px;
      .nft-blindbox-list-item-right-title {
        width: 90%;
        color: $white;
        font-size: 32px;
        font-weight: 600;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .nft-blindbox-list-item-right-detail {
        display: flex;
        color: $white;
        font-size: 14px;
        justify-content: space-between;

        .details-item-info {
          flex: 1;
          span {
            font-size: 20px;
          }
        }
      }
      .nft-blindbox-list-item-right-countdown {
        font-size: 24px;
        color: $white;
        span {
          font-size: 14px;
          display: block;
        }
        .countdown {
          margin-top: 6px;
          i {
            font-style: normal;
            display: inline-block;
            width: 35px;
            height: 33px;
            font-size: 20px;
            background: rgba(250, 250, 250, 0.2);
            text-align: center;
            line-height: 33px;
            font-weight: normal;
            border-radius: 3px;
          }
        }
      }
      .buy-button {
        width: 217px;
        color: #923b00;
        padding: 10px 0;
        background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
        box-shadow: 0px 12px 15px 0px rgba(253, 168, 0, 0.39);
        border-radius: 16px;
        text-align: center;
      }
    }
  }
}
.nft-past-list {
  margin-top: 47px;
  position: relative;
  overflow: hidden;
  padding-top: 55px;
  display: flex;
  flex-wrap: wrap;
  .nft-soldout-blindbox-item {
    width: 368px;
    height: 445px;
    float: left;
    cursor: pointer;
    margin-right: 47px;
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
    border-radius: 16px;
    margin-bottom: 40px;
    &:nth-child(3n) {
      margin-right: 0;
    }
    &:hover {
      opacity: 0.9;
    }
    img {
      width: 368px;
      height: 200px;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }
    .nft-soldout-title-status {
      position: absolute;
      color: $white;
      top: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .item-content-title {
      width: 95%;
      color: $white;
      font-size: 20px;
      text-indent: 30px;
      margin-top: 18px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .item-content-info {
      width: 309px;
      display: flex;
      color: $white;
      justify-content: space-between;
      margin: 0 30px;
      padding-bottom: 30px;
      .details-item-info {
        flex: 1;
        p {
          font-size: 14px;
        }

        span {
          font-size: 18px;
        }
      }
      .item-left {
        text-align: left;
      }
      .item-center {
        text-align: center;
      }
      .item-right {
        text-align: right;
      }
      border-bottom: 2px solid rgba(255, 255, 255, 0.14);
    }
    .nft-soldout-status {
      text-align: center;
      font-size: 20px;
      color: $white;
      margin-top: 20px;
    }
  }
}
</style>
