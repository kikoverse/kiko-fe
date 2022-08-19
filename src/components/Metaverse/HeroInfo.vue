<template>
  <div :class="$style['hero-info']">
    <div v-if="state.metaData.occupations" :class="$style['wrap']">
      <div :class="$style['hero-info-skills']">
        <img src="../../assets/metaverse/fire.png" />
        <img src="../../assets/metaverse/ice.png" />
        <img src="../../assets/metaverse/fire.png" />
        <img src="../../assets/metaverse/ice.png" />
      </div>

      <div :class="$style['hero-info-occupations']">
        <div
          v-for="(d, i) in state.metaData.occupations"
          :key="i"
          :class="$style['hero-info-occupations-item']"
        >
          <img :src="d.image" />
          <p :class="$style['hero-info-occupations-item-num']">{{ d.sum }}</p>
          <p>{{ state.currLang === "zh" ? d.cnDesc : d.desc }}</p>
        </div>
      </div>

      <div :class="$style['hero-info-imgs']">
        <img src="../../assets/metaverse/a.png" />
        <img src="../../assets/metaverse/b.png" />
        <img src="../../assets/metaverse/c.png" />
        <img src="../../assets/metaverse/d.png" />
      </div>
    </div>

    <div :class="$style['hero-info-mask']">
      <p :class="$style['hero-info-tips']">COMING SOON..</p>
    </div>
  </div>
  <validate-error-modal></validate-error-modal>
</template>
<script setup>
/* eslint-disable*/
import { computed, reactive } from "vue-demi";
import { useStore } from "vuex";
import ValidateErrorModal from "./ValidateErrorModal.vue";
const store = useStore();
const state = reactive({
  metaData: computed(() => store.state.StoreMeta.metaData),
  currLang: computed(() => store.state.StoreApp.currLang),
});
</script>
<style lang="scss" module>
.hero-info {
  // background-image: url("../../assets/metaverse/right-bg.png");
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  // width: 400px;
  width: calc(100% - 500px);
  margin-left: 50px;
  padding: 30px;
  box-sizing: border-box;
  position: relative;
  height: 436px;
  background: linear-gradient(117deg, rgba(37, 37, 37, 0) 0%, #3e3e3e 100%);
  .wrap {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    height: 100%;
  }
  .hero-info-skills {
    display: flex;
    justify-content: flex-start;
    img {
      width: 100px;
      height: 72px;
      margin-right: 10px;
    }
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  }

  .hero-info-occupations {
    overflow: hidden;
    width: 100%;
    position: relative;
    padding-bottom: 20px;
    margin-top: 30px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    .hero-info-occupations-item {
      // width: 25%;
      // margin-left: 6%;
      margin-right: 10px;
      float: left;
      text-align: center;
      position: relative;
      border-radius: 4px;
    }
    img {
      display: inline-block;
      width: 100px;
      height: 72px;
    }
    p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
    }
    .hero-info-occupations-item-num {
      position: absolute;
      bottom: 25px;
      left: 50%;
      transform: translate(-50%, 0);
      z-index: 2;
      background-color: rgba(255, 255, 255, 0.5);
      width: 60%;
      border-radius: 10px;
      // color: #391b0f;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .hero-info-imgs {
    display: flex;
    margin-top: 30px;
    justify-content: flex-start;
    img {
      width: 100px;
      height: 72px;
      margin-right: 10px;
    }
    padding-bottom: 40px;
  }

  .hero-info-mask {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.6);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    // transform: scale(0.925, 0.95);
    z-index: 9;
    cursor: not-allowed;
    // display: flex;
    // align-items: flex-start;
    .hero-info-tips {
      color: #fff;
      text-align: center;
      position: absolute;
      // bottom: 20px;
      top: 50%;
      left: 0;
      right: 0;
      font-size: 24px;
    }
  }
}
</style>
