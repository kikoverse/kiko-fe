<template>
  <div class="fly-refresh">
    <fly-dialog
      :title="!props.isCustomTitle ? $t(props.title || '') : props.title"
      :dialogVisible="state.visible"
      @handleClose="handleClose"
      :close-on-click-modal="false"
      :isShowClose="state.isShowClose"
    >
      <template #content>
        <div class="content" v-if="!props.isCustomContent">
          <slot name="image-logo"></slot>
          <p><slot name="content-text"></slot></p>
        </div>
        <slot name="core" v-if="props.isCustomContent"></slot>

        <div class="footer">
          <slot name="footer"></slot>
        </div>
      </template>
    </fly-dialog>
  </div>
</template>

<script setup>
import FlyDialog from "@FlyUI/FlyDialog.vue";
import { reactive, defineProps, watch, defineEmits } from "vue";

let state = reactive({
  visible: props.dialogVisible,
  isShowClose: props.isShowClose,
});

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  title: String,
  okText: String,
  isCustomContent: {
    type: Boolean,
    default: false,
  },
  isShowClose: {
    type: Boolean,
    default: true,
  },
  isCustomTitle: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => props.dialogVisible,
  (n) => {
    state.visible = n;
  }
);
watch(
  () => props.isShowClose,
  (n) => {
    state.isShowClose = n;
  }
);

const emits = defineEmits(["handleClose"]);

const handleClose = () => {
  emits("handleClose", false);
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.fly-refresh {
  position: relative;
  z-index: 122;
  ::v-deep(.el-dialog__header) {
    height: auto;
    line-height: 24px;
    margin-bottom: 4px;
    padding-top: 24px;
    padding-bottom: 0;
  }
  ::v-deep(.el-dialog__body) {
    padding: 0 24px 20px;
  }
  .content {
    text-align: center;
    img {
      width: 81px;
      height: 81px;
      margin: 0 auto;
    }
    p {
      font-size: 20px;
      font-family: PingFangTC-Semibold, PingFangTC;
      font-weight: 600;
      color: #010e22;
      line-height: 28px;
      text-align: center;
      margin: 0 auto;
    }
  }
  .footer {
    margin-top: 24px;
  }
}
</style>
