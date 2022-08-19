<template>
  <div class="k-starter">
    <div class="banner">
      <div class="k-starter-text-info">
        <h3>K-STARTER</h3>
        <p>{{ $t("kgstarter.content") }}</p>
        <fly-button class="entry-btn" type="normal" @click="pushIgoIndex()">{{
          $t("kgstarter.enter")
        }}</fly-button>
      </div>
      <div class="k-starter-img-info">
        <img src="../../assets/igo/k-starter.png" alt="" />
      </div>
    </div>
    <div class="igo-list">
      <ul v-if="state.igoList && state.igoList.length > 0">
        <li
          class="igo-list-item"
          v-for="(d, i) in state.igoList"
          :key="i"
          @click.stop="
            () => {
              pushIgoIndex();
              setActiveItem(i);
            }
          "
        >
          <div class="igo-left-img-info" :style="i === 0 ? 'height:401px' : ''">
            <!-- <img :src="d.prdImg" alt="" /> -->
            <img
              v-if="i === 0"
              class="first-img-info"
              src="../../assets/igo/01.png"
              alt=""
            />
            <img v-if="i === 1" src="../../assets/igo/02.png" alt="" />
            <img v-if="i === 2" src="../../assets/igo/03.png" alt="" />
          </div>

          <div class="igo-right-text-info">
            <div class="item-project-name-link">
              <p class="item-project-name">
                {{ i !== 2 ? d.prdName : "Coming Soon" }}
              </p>
              <div class="link" v-if="i !== 2">
                <div
                  class="link-svgIcon"
                  :key="i"
                  v-for="(d, i) in ['igo-a', 'igo-b', 'igo-c']"
                >
                  <svg-icon :name="d" @click="pushPage(i)"></svg-icon>
                </div>
              </div>
            </div>
            <div class="item-igo-data">
              <div class="item-data max-increase" v-if="i !== 2">
                <p class="item-label">{{ $t("kgstarter.maxIncrease") }}</p>
                <p class="item-value" v-if="i === 0">500%</p>
                <p class="item-value" v-else-if="i === 1">280%</p>
                <p class="item-value" v-else></p>
              </div>
              <div class="item-data total-staking" v-if="i !== 2">
                <p class="item-label">{{ $t("kgstarter.totalStaking") }}</p>
                <p class="item-value" v-if="i === 0">2,633,035 STC</p>
                <p class="item-value" v-else-if="i === 1">6,533,122 STC</p>
                <p class="item-value" v-else></p>
              </div>
            </div>
            <div class="item-project-desc" v-if="i !== 2">
              <p v-html="state.currLang === 'en' ? d.prdDescEn : d.prdDesc"></p>
            </div>
            <fly-button type="normal" v-if="i !== 2" class="learn-more">{{
              $t("home.learn-more")
            }}</fly-button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import FlyButton from "@FlyUI/FlyButton.vue";
import { computed, reactive, watch } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import { useStore } from "vuex";
import dayjs from "dayjs";
import utilsTool from "@utils/tool";
import utilsDate from "@utils/date.js";
import { isUndefined } from "lodash";
const store = useStore();
let state = reactive({
  currLang: computed(() => store.state.StoreApp.currLang),
  igoList: computed(() => store.state.StoreIGO.igoList),
  countdown: null,
  activeIndex: 0,
  timer: null,
});

store.dispatch("StoreIGO/getIgoList");
const pushIgoIndex = () => {
  utilsTool.openNewWindow(`https://kgstarter.com`);
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
<style lang="scss" scoped>
.k-starter {
  .banner {
    width: 100%;
    overflow: hidden;
    .k-starter-text-info {
      width: 490px;
      float: left;
      margin-top: 150px;
      color: #fff;
      h3 {
        font-size: 48px;
        font-weight: 900;
        font-family: Arial-Black, Arial;
      }
      p {
        width: 461px;
        margin-top: 16px;
      }
      .entry-btn {
        width: 342px;
        margin-top: 36px;
        background: #fba800;
      }
    }
    .k-starter-img-info {
      width: 710px;
      float: left;
      img {
        width: 100%;
      }
    }
  }
  .igo-list {
    width: 1200px;
    height: 100%;
    margin-bottom: 167px;
    ul {
      &:first-child {
        height: 401px;
      }
    }

    .igo-list-item {
      color: #fff;
      margin-bottom: 36px;
      list-style: none;

      .igo-left-img-info {
        width: 537px;
        height: 326px;
        display: inline-block;
        vertical-align: bottom;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .igo-right-text-info {
        width: 551px;
        height: 242px;
        display: inline-block;
        vertical-align: bottom;
        padding: 42px 56px;
        background: linear-gradient(
          180deg,
          #3e3e3e 0%,
          #3e3e3e 0%,
          #252525 100%
        );
        border-radius: 0px 16px 16px 0px;
        .item-project-name-link {
          overflow: hidden;
          .item-project-name {
            float: left;
            font-size: 24px;
            font-weight: 600;
          }
          .link {
            overflow: hidden;
            float: right;
            .link-svgIcon {
              width: 24px;
              height: 24px;
              float: left;
              margin-right: 4px;
              text-align: center;
              border-radius: 2px;
              background: rgba(171, 171, 171, 0.13);
            }
          }
        }
        .item-igo-data {
          display: flex;
          justify-content: space-between;
          div {
            flex: 1;
            .item-label {
              color: #fff;
              font-size: 14px;
              opacity: 0.3;
            }
            .item-value {
              color: #fff;
              font-weight: 600;
            }
          }
        }

        .item-project-desc {
          font-size: 14px;
          margin-top: 16px;
          margin-bottom: 17px;
        }
        .learn-more {
          height: 6px;
          background: #fba800;
          line-height: 6px;
          color: #000000;
        }
      }
    }
  }
}
</style>
