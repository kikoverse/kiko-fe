<template>
  <div class="loop-list">
    <div v-if="props.data && props.data.length > 0">
      <div v-for="(d, i) in props.data" :key="i" class="loop-list-item">
        <span>{{ d.lpToken }}</span>
        <span>{{ d.poolAmount }}</span>
        <span @click="delPool(d)">{{ $t("移除") }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";
import { useStore } from "vuex";
const store = useStore();
const props = defineProps({
  data: Object,
});
const delPool = (item) => {
  store.commit("StoreLiquidity/SET_DEL_POOL_INFO", item);
  store.commit("StoreLiquidity/CHANGE_POOL_TYPE", "delete");
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/mixin.scss";
.loop-list {
  color: $text-white-color;
  font-size: 14px;
  .loop-list-item {
    width: 100%;
    // background: $btn-gray2-bgcolor;
    height: 40px;
    // border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0px 17px;
    box-sizing: border-box;
    font-weight: bold;
    span {
      display: inline-block;
      flex: 3;
      text-align: right;
      @include textOverflow();
    }
    span:first-child {
      text-align: left;
    }
    span:last-child {
      width: 100px;
      text-align: right;
      flex: 1;
      cursor: pointer;
      color: $text-orange-color2;
    }
  }
  .loop-list-item:not(:last-child) {
    // margin-bottom: 12px;
    border-bottom: 0.5px solid #3e3e3e;
  }
}
</style>
