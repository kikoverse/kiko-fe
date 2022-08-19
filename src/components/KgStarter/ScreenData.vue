<template>
  <div
    :class="$style['screen-data-container']"
    v-if="state.igoList && state.igoList.length > 0"
  >
    <p :class="$style['screen-data-container-title']">IGOs</p>
    <div :class="$style['data']">
      <div
        :class="$style['data-block']"
        :style="{ width: 240 * state.igoList.length - 1 + 130 + 'px' }"
      >
        <div
          @click.stop="
            () => {
              pushIgoIndex();
              setActiveItem(i);
            }
          "
          v-for="(d, i) in state.igoList"
          :key="i"
          :style="`background-image: url(${d.prdImg})`"
          :class="[
            $style['data-block-item'],
            state.activeIndex === i ? $style['data-block-item-active'] : '',
          ]"
        >
          <!-- <img :src="d.prdImg" /> -->
          <div
            :class="$style['data-block-item-bottom']"
            v-if="state.activeIndex === i"
          ></div>
        </div>
      </div>
    </div>
    <div :class="$style['data-info']">
      <p :class="$style['data-info-title']">
        {{ state.igoList[state.activeIndex].prdName }}
      </p>
      <div :class="$style['data-info-detail']">
        <div :class="$style['data-info-detail-left']">
          <div
            :class="$style['data-info-detail-btn']"
            @click="
              pushIgo(
                state.igoList[state.activeIndex].state,
                state.igoList[state.activeIndex]
              )
            "
          >
            {{
              state.igoList[state.activeIndex].state !== "preview"
                ? $t("了解更多")
                : $t("kgstarter.敬请期待")
            }}
          </div>
          <div :class="$style['data-info-detail-contact']">
            <svg-icon
              v-for="(d, i) in ['igo-a', 'igo-b', 'igo-c']"
              :key="i"
              :name="d"
              @click="pushPage(i)"
            ></svg-icon>
          </div>
        </div>
        <div :class="$style['data-info-detail-right']" v-if="state.countdown">
          <p :class="$style['data-info-detail-right-title']">
            {{ $t("kgstarter.开始倒计时") }}
          </p>
          <div :class="$style['data-info-detail-right-countdown']">
            <div
              v-for="(d, i) in new Array(4)"
              :key="i"
              :class="$style['data-info-detail-right-countdown-item']"
            >
              <template v-if="state.countdown">
                <p
                  :class="$style['data-info-detail-right-countdown-item-time']"
                >
                  {{ state.countdown && state.countdown[i] }}
                </p>
                <p
                  :class="$style['data-info-detail-right-countdown-item-flag']"
                >
                  {{ renderFlag(i) }}
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
      <p
        :class="$style['data-info-desc']"
        v-html="
          state.currLang === 'en'
            ? state.igoList[state.activeIndex].prdDescEn
            : state.igoList[state.activeIndex].prdDesc
        "
      ></p>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, watch, watchEffect } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import utilsDate from "@utils/date.js";
import { isUndefined } from "lodash";
import { useStore } from "vuex";
import dayjs from "dayjs";
import utilsTool from "@utils/tool";
const store = useStore();
let state = reactive({
  currLang: computed(() => store.state.StoreApp.currLang),
  igoList: computed(() => store.state.StoreIGO.igoList),
  countdown: null,
  activeIndex: 0,
  timer: null,
});

const pushIgo = (flag, data) => {
  if (flag === "preview") return;
  utilsTool.openNewWindow(`https://kgstarter.com/prodetail?pid=${data.id}`);
};

const pushIgoIndex = () => {
  utilsTool.openNewWindow(`https://kgstarter.com`);
};

const pushPage = (i) => {
  // const typeText = ["website", "tw", "telegram", "medium"];
  const typeText = ["website", "tw", "telegram"];
  const map = new Map();
  state.igoList[state.activeIndex].links.forEach((d) => {
    map.set(d.name, d.url || "");
  });
  if (!map.get(typeText[i])) {
    return;
  } else {
    utilsTool.openNewWindow(map.get(typeText[i]));
  }
};

const setActiveItem = (i) => {
  state.activeIndex = i;
  clearTimeout(state.timer);
  state.timer = null;
  state.countdown = null;
  const timestamp = state.igoList && state.igoList[state.activeIndex].startTime;
  if (!timestamp) return;
  if (!dayjs().isBefore(state.igoList[state.activeIndex].startTime)) {
    return;
  }
  const setCountDown = () => {
    state.countdown = formateDate(
      utilsDate.countdown(state.igoList[state.activeIndex].startTime)
    );
    if (!state.countdown) {
      clearTimeout(state.timer);
      return;
    }

    state.timer = setTimeout(() => setCountDown(), 1000);
  };
  setCountDown();
};

const formateDate = (timeObj) => {
  const { day, hour, minute, second } = timeObj;
  if (
    isUndefined(day) &&
    isUndefined(hour) &&
    isUndefined(minute) &&
    isUndefined(second)
  ) {
    return null;
  }
  return [day, hour, minute, second];
};

const renderFlag = (i) => {
  const text = ["days", "hours", "minutes", "seconds"];
  return text[i];
};

watch(
  () => state.igoList,
  () => {
    setActiveItem(0);
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<style lang="scss" module>
@import "~@/styles/mixin.scss";

.screen-data-container {
  background-image: url("../../assets/igo/kg-content-main.png");
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  position: absolute;
  top: 340px;
  z-index: 111;
  .screen-data-container-title {
    display: none;
    color: #fec944;
    font-size: 26px;
    font-weight: bolder;
    margin-top: 25px;
    margin-bottom: 15px;
    font-family: DenmarkRegular;
  }
  .data {
    margin: 25px auto 15px;
    width: calc(100% - 60px);
    overflow-x: scroll;
    .data-block {
      width: 100%;
      display: flex;
      padding-bottom: 10px;
      .data-block-item {
        &:not(:first-child) {
          margin-left: 20px;
        }
        cursor: pointer;
        // overflow: hidden;
        width: 220px;
        height: 155px;
        float: left;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        position: relative;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        .data-block-item-bottom {
          width: 100%;
          height: 3px;
          position: absolute;
          background: #fec944;
          bottom: -10px;
        }
      }
      .data-block-item-active {
        width: 286px !important;
      }
    }
  }
  .data-info {
    margin: 0 auto;
    width: calc(100% - 60px);
    padding: 0px 20px;
    margin-top: 5px;
    padding-bottom: 30px;
    .data-info-title {
      text-align: left;
      color: #fff;
      font-size: 24px;
      font-family: DenmarkRegular;
      margin-top: 20px;
    }
    .data-info-detail {
      height: 70px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .data-info-detail-left {
        display: flex;
        align-items: center;
        .data-info-detail-btn {
          background-image: url("../../assets/igo/btn-bg.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          height: 35px;
          width: 110px;
          text-align: center;
          line-height: 35px;
          font-size: 15px;
          cursor: pointer;
        }
        .data-info-detail-contact {
          margin-left: 15px;
          height: 35px;
          background: rgba(216, 216, 216, 0.2);
          width: 140px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0px 20px;
          svg {
            &:hover {
              opacity: 0.5 !important;
            }
            width: 28px;
            height: 28px;
            cursor: pointer;

            // margin-left: 10px;
          }
        }
      }

      .data-info-detail-right {
        text-align: right;
        color: #ffffff;
        .data-info-detail-right-title {
          font-size: 14px;
          font-weight: bold;
        }
        .data-info-detail-right-countdown {
          margin-top: 5px;
          display: flex;
          .data-info-detail-right-countdown-item {
            text-align: center;
            &:not(:first-child) {
              margin-left: 10px;
            }
            background: #d27c1a;
            width: 48px;
            padding: 2px 3px 5px;
            // padding-bottom: 3px;
            .data-info-detail-right-countdown-item-time {
              font-size: 16px;
              font-weight: bold;
              // margin-top: 2px;
            }
            .data-info-detail-right-countdown-item-flag {
              font-size: 10px;
              margin-top: -4px;
            }
          }
        }
      }
    }
    .data-info-desc {
      text-align: left;
      margin-top: 30px;
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
