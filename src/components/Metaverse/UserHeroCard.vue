<template>
  <div :class="$style['role-box']">
    <div :class="$style['role-box-score']" v-if="state.heroInfo">
      <svg-icon name="f-rarity" style="margin-right: 3px"></svg-icon>
      <fly-amount
        :value="state.totalScore || state.heroInfo.score"
        :formatOptions="{ precision: 0, trailingZero: true }"
      >
      </fly-amount>
    </div>
    <img v-if="state.heroInfo.imageUrl" :src="state.heroInfo.imageUrl" />
  </div>
</template>
<script setup>
import { computed, reactive } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import FlyAmount from "@FlyUI/FlyAmount.vue";
import { useStore } from "vuex";
const store = useStore();
const state = reactive({
  heroInfo: computed(() => store.state.StoreMeta.heroInfo),
  currLang: computed(() => store.state.StoreApp.currLang),
  totalScore: computed(() => store.getters["StoreMeta/totalScore"]),
});
</script>
<style lang="scss" module>
.role-box {
  position: relative;
  text-align: center;
  width: 426px;
  height: 436px;
  background: rgba(216, 216, 216, 0.2);
  .role-box-score {
    z-index: 99;
    min-width: 62px;
    height: 24px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 16px;
    position: absolute;
    padding: 0px 5px;
    right: 5px;
    top: 5px;
    line-height: 24px;
    color: $theme-light-color;
    font-size: 14px;
  }
  img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}
</style>
