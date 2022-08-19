<template>
  <div :class="$style['role']">
    <!-- 无角色卡片 -->
    <div
      :class="$style['role-no-character']"
      v-if="!state.composeNFT || state.composeNFT.length < 1"
    >
      <!-- <p>
        {{ $t("metaverse.character nft making") }}
      </p>
      <p>
        {{ $t("metaverse.no character nft yet") }}
      </p> -->
      <div :class="$style['role-character-add']" @click="changeMainType">
        <span
          :style="{ 'margin-top': state.currLang === 'zh' ? '60px' : '50px' }"
        >
          {{ $t("metaverse.character nft making") }}
        </span>
      </div>
    </div>
    <!-- 角色卡片 -->
    <div :class="$style['role-character']" v-else>
      <div
        @click.stop="pushHeroDetail(d)"
        v-for="(d, i) in state.composeNFT"
        :key="i"
        :class="$style['role-character-item']"
        @mouseenter.stop="hoverEvent(i, true)"
        @mouseleave.stop="hoverEvent(i, false)"
      >
        <div
          :class="$style['role-character-item-mask']"
          :ref="
            (el) => {
              if (el) state.maskDOMs[i] = el;
            }
          "
        >
          <p>{{ d.customName }}</p>
          <p>{{ d.name }}</p>
        </div>
        <img :src="d.image" />
      </div>
      <div :class="$style['role-character-add']" @click="changeMainType">
        <span
          :style="{ 'margin-top': state.currLang === 'zh' ? '60px' : '50px' }"
        >
          {{ $t("metaverse.character nft making") }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, watch, nextTick } from "vue";
import { useStore } from "vuex";
const store = useStore();

const state = reactive({
  maskDOMs: [],
  type: computed(() => store.state.StoreMeta.type),
  composeNFT: computed(() => store.state.StoreMeta.composeNFT),
  currLang: computed(() => store.state.StoreApp.currLang),
});
const hoverEvent = (index, flag) => {
  nextTick(() => {
    if (flag) {
      state.maskDOMs[index].style.display = "block";
      return;
    }
    state.maskDOMs[index].style.display = "none";
  });
};
const changeMainType = () => {
  if (state.type === "not-generated") {
    // 清空所有元素
  }
  if (state.type === "generated") {
    store.commit("StoreMeta/CHANGE_MAIN_STATUS", {
      type: "not-generated",
    });
  }
};

const pushHeroDetail = (payload) => {
  if (state.type === "generated") {
    store.commit("StoreMeta/CHANGE_MAIN_STATUS", {
      data: Object.assign({}, payload, {
        imageUrl: payload.image,
      }),
      type: "generated",
    });
  }
  if (state.type === "not-generated") {
    store.commit("StoreMeta/CHANGE_MAIN_STATUS", {
      data: Object.assign({}, payload, {
        imageUrl: payload.image,
      }),
      type: "generated",
    });
  }
};
</script>
<style lang="scss" module>
@import "~@/styles/mixin.scss";

.role-character-add {
  display: inline-block;
  margin-left: 15px;
  width: 150px;
  height: 150px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-size: 16px;
  text-align: center;
  span {
    display: inline-block;
  }
  // line-height: 150px;
}
.role {
  height: 180px;
  box-sizing: border-box;
  display: flex;
  overflow-x: scroll;
  padding-right: 20px;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(151, 151, 151, 1);
  &::-webkit-scrollbar {
    // height: 1px;
    // background-color: #ffecd4;
    // border-radius: 20px;
  }
  &::-webkit-scrollbar-thumb {
    // background: rgba(255, 255, 255, 0.5);
    // border-radius: 20px;
    // width: 80%;
  }
  .role-no-character {
    font-size: 14px;
    color: #8b8b8b;
    align-self: center;
    p:first-child {
      font-size: 20px;
      color: $theme-light-color;
      font-weight: 500;
    }
  }
  .role-character {
    display: flex;
    align-self: center;
    .role-character-item {
      width: 150px;
      height: 150px;
      overflow: hidden;
      position: relative;
      background: rgba(255, 255, 255, 0.12);
      &:not(:first-child) {
        margin-left: 15px;
      }
      &:hover {
        cursor: pointer;
      }
      .role-character-item-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        color: #fff;
        display: none;
        font-size: 14px;
        padding-left: 10px;
        padding-top: 10px;
        background: rgba(0, 0, 0, 0.2);
        p {
          @include textOverflow();
          width: 90%;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
