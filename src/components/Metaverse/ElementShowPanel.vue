<template>
  <div :class="$style['container']">
    <div :class="$style['main']">
      <template v-if="state.elementList && state.elementList.length > 0">
        <div
          :class="[$style['main-item'], $style['main-item-pos']]"
          v-for="(d, i) in state.elementList"
          :key="i"
          @click="selectElement(d, i)"
        >
          <div
            :class="$style['main-item-img']"
            :style="{
              border: i === state.activeElement ? '2px solid #ffa400' : '',
            }"
          >
            <img :src="d.image" :class="$style['main-item-img-element']" />
            <svg-icon name="arrow"></svg-icon>
          </div>
          <div :class="$style['main-item-info']">
            <span :class="$style['main-item-info-data']">
              <svg-icon name="f-rarity"></svg-icon>
              <fly-amount
                :value="d.score"
                :formatOptions="{
                  precision: 0,
                  trailingZero: true,
                }"
              ></fly-amount>
            </span>
            <span :class="$style['main-item-info-amount']">
              <span>&times;</span>
              <span style="margin-left: 3px">{{ calcAmount(d.sum, i) }}</span>
            </span>
          </div>
        </div>
        <no-element-item
          style="margin-top: 20px"
          :class="$style['main-item-pos']"
        ></no-element-item>
      </template>
      <div :class="$style['main-no-data']" v-else>
        <no-element-item style="margin-top: 160px"></no-element-item>
        <div :class="$style['main-no-data-div']">
          <span>{{
            $t("metaverse.disassemble an nft detail description one")
          }}</span>
          <span>{{
            $t("metaverse.disassemble an nft detail description two")
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive, watch } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import NoElementItem from "./NoElementItem.vue";
import FlyAmount from "@FlyUI/FlyAmount.vue";
import { useStore } from "vuex";
const store = useStore();
const state = reactive({
  activeProperty: computed(() => store.state.StoreMeta.activeProperty),
  activeElement: null,
  metaData: computed(() => store.state.StoreMeta.metaData),
  elementList: computed(() => store.getters["StoreMeta/elementList"]),
});

const activeMap = new Map();

watch(
  () => state.activeProperty,
  () => {
    let index = null;
    if (activeMap.size) {
      index = activeMap.get(state.activeProperty);
    }
    state.activeElement = index;
  }
);

const selectElement = (ele, index) => {
  if (index === state.activeElement) {
    store.dispatch("StoreMeta/setSelectedElementList", {
      type: "delete",
      data: ele,
    });
    state.activeElement = null;
    activeMap.delete(state.activeProperty);
    return;
  }
  state.activeElement = index;
  activeMap.set(state.activeProperty, state.activeElement);
  store.dispatch("StoreMeta/setSelectedElementList", {
    type: "add",
    data: ele,
  });
};

const calcAmount = (amount, index) =>
  computed(() => {
    if (state.activeElement === index) {
      return Math.max(amount - 1, 0);
    }
    return Math.max(amount, 0);
  }).value;
</script>
<style lang="scss" module>
$mainHeight: 460px;
// ::-webkit-scrollbar {
//   width: 1px;
//   height: 1px;
// }
@mixin activeBtnStyle {
  background: #ad865c;
  color: #fff;
  transition: all ease 0.2s;
}
.container {
  // background: red;
  width: 522px;
  height: 520px;
  background: linear-gradient(117deg, #3e3e3e 0%, rgba(37, 37, 37, 0) 100%);
  padding: 16px;
  padding-top: 0px;
  box-sizing: border-box;
  .main {
    height: $mainHeight;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    // background: red;
    .main-no-data {
      align-self: center;
      width: 100%;
      height: 500px;
      display: flex;
      flex-direction: column;
      align-items: center;

      div {
        margin-top: 60px;
      }
      .main-no-data-div {
        margin-left: 40px;
      }
      span {
        font-size: 14px;
        display: inline-block;
        color: rgba(255, 255, 255, 0.5);
      }
    }
    .main-item-pos {
      float: left;
      &:not(:nth-child(4n + 1)) {
        margin-left: 25px;
      }
    }
    .main-item {
      cursor: pointer;
      margin-top: 20px;
      float: left;
      .main-item-img {
        width: 102px;
        height: 102px;
        // border-radius: 4px;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: rgba(216, 216, 216, 0.11);
        border: 2px solid transparent;
        &:hover {
          border: 2px solid #ffa400;
        }
        img {
          width: 100%;
          height: 100%;
        }
        .main-item-img-active {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 32px;
          height: 17px;
        }
      }
      .main-item-info {
        margin-top: 5px;
        max-width: 102px;
        color: $theme-light-color;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        font-size: 14px;
        .main-item-info-data {
          min-width: 40px;
          display: inline-block;
          height: 20px;
          border-radius: 14px;
          background: rgba(251, 168, 0, 0.1);
          padding-left: 10px;
          padding-right: 10px;
        }
        svg + span {
          margin-left: 3px;
        }
        .main-item-info-amount {
          color: $theme-light-color;
        }
      }
    }
  }
}
</style>
