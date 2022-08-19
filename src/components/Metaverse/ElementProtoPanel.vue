<template>
  <div :class="$style['property-container']">
    <div
      v-for="(d, i) in state?.metaData.property"
      @click="changeProperty(d, i)"
      :key="i"
      :class="[
        $style['property-item'],
        { [$style['property-item-active']]: i === state.activeProperty },
      ]"
    >
      <div
        v-if="i === state.activeProperty"
        :class="$style['property-item-active-block']"
      ></div>
      {{ $t(`nftproperty.${d.desc}`) }}
    </div>
    <div
      :class="[$style['property-item'], $style['property-item-get']]"
      @click="
        store.commit('StoreMeta/SET_SELECTOR_DIALOG_PARAMS', {
          dialogVisible: true,
        })
      "
    >
      {{ $t("metaverse.obtain components") }}
    </div>
  </div>
</template>
<script setup>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
const store = useStore();
const state = reactive({
  activeProperty: computed(() => store.state.StoreMeta.activeProperty),
  metaData: computed(() => store.state.StoreMeta.metaData),
  elementList: computed(() => store.getters["StoreMeta/elementList"]),
});

const changeProperty = (d, i) => {
  store.commit("StoreMeta/SET_CURR_NFT_PROPERTY", d);
  store.commit("StoreMeta/SET_ACTIVE_PROPERTY", i);
};
</script>
<style lang="scss" module>
@mixin activeBtnStyle {
  background: linear-gradient(129deg, #4a4a4a 0%, #3c3c3c 100%);
  color: #ffffff;
  transition: all ease 0.2s;
}

.property-container {
  width: 183px;
  overflow: hidden;
  .property-item {
    width: 100%;
    height: 40px;
    background: linear-gradient(
      90deg,
      rgba(62, 62, 62, 1) 0%,
      rgba(62, 62, 62, 0.3) 100%
    );
    cursor: pointer;
    padding-left: 30px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 40px;
    font-size: 14px;
    border-left: 1px solid transparent;
    position: relative;
    margin-top: 4px;
    &:first-child {
      margin-top: 0px;
    }
    &:hover {
      @include activeBtnStyle();
    }
  }
  .property-item-active {
    background: linear-gradient(129deg, #4a4a4a 0%, #3c3c3c 100%);
    color: #ffffff;
    .property-item-active-block {
      left: 0px;
      position: absolute;
      width: 1px;
      height: 100%;
      background: #ffffff;
    }
  }
  .property-item-get {
    color: $theme_light_color;
    &:hover {
      color: $theme_light_color;
    }
  }
}
</style>
