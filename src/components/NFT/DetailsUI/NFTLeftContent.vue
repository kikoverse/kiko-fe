<template>
  <div class="details-img-content">
    <img
      v-if="props.box_detail.imageLink"
      :src="
        props.box_detail?.imageLink ||
        (props.action_type === 'RECOVERY' && props.box_detail.icon)
      "
      alt=""
    />
    <div class="unopen-blind" v-else>
      <img
        :src="props.box_detail.boxTokenLogo || props.box_detail.icon"
        alt=""
      />
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";
let props = defineProps({
  box_detail: {
    type: Object,
    default: () => {},
  },
  isNFT: {
    type: Boolean,
  },
});
</script>
<style scoped lang="scss">
.details-img-content {
  width: 599px;
  height: 599px;
  background: #e8906c;
  border-radius: 8px;
  font-size: 0;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
  .unopen-blind {
    margin: 0 auto;
    width: 599px;
    height: 599px;
    text-align: center;
    line-height: 424px;
    position: relative;
    img {
      vertical-align: middle;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
