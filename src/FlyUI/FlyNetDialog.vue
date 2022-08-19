<template>
  <div class="fly-net-dialog">
    <ElDialog
      v-model="state.visible"
      width="440px"
      custom-class="fly-dialog-el"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal="true"
      :show-close="false"
    >
      <div class="fly-net-dialog-content">
        <fly-space :size="86"></fly-space>
        <!-- <img src="../assets/common/net-error.png" /> -->
        <svg-icon name="wifi" class="wifi"></svg-icon>
        <fly-space :size="30"></fly-space>
        <p class="fly-net-dialog-content-text">{{ $t("网络错误") }}</p>
        <p style="font-size: 14px">
          {{ $t("请切换正确的钱包网络") }}
        </p>
        <fly-space :size="20"></fly-space>
      </div>
    </ElDialog>
  </div>
</template>

<script setup>
import { reactive, defineProps, watch } from "vue";
import FlySpace from "@FlyUI/FlySpace";
import SvgIcon from "@components/SvgIcon/Index.vue";
const props = defineProps({
  visible: Boolean,
});
const state = reactive({
  visible: props.visible,
});
watch(
  () => props.visible,
  (n) => {
    state.visible = n;
  }
);
</script>

<style lang="scss" scoped>
.fly-net-dialog {
  ::v-deep(.el-dialog) {
    border-radius: 16px;
    height: 373px;
    background: linear-gradient(180deg, #3e3e3e 0%, #3e3e3e 0%, #252525 100%);
  }
  ::v-deep(.el-dialog__body) {
    padding-top: 10px !important;
  }

  .fly-net-dialog-content {
    text-align: center;
    img {
      display: inline-block;
      width: 70px;
      user-select: none;
    }
    .fly-net-dialog-content-text {
      font-size: 20px;
      color: $white;
      font-weight: 600;
    }
  }
  .wifi {
    width: 62px;
    height: 43px;
  }
}
</style>
