<template>
  <div class="star-dialog">
    <ElDialog
      v-model="state.visible"
      :width="`${props.width ? props.width + 'px' : '440px'}`"
      custom-class="star-dialog-el"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="props.isClickModal"
      :modal="props.isHasModal"
      :show-close="false"
    >
      <template #title>
        <div class="star-dialog-header">
          <span>
            {{ props.title || "" }}
          </span>
          <svg-icon
            v-if="state.isShowClose"
            name="f-dialog-close"
            class="svg"
            @click.stop="handleClose"
          ></svg-icon>
        </div>
      </template>
      <slot name="content"></slot>
    </ElDialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
// import { ElDialog } from "element-plus";

const props = defineProps({
  title: {
    type: String,
  },
  dialogVisible: {
    type: Boolean,
  },
  isClickModal: {
    type: Boolean,
    default: true,
  },
  isHasModal: {
    type: Boolean,
    default: true,
  },
  width: {
    type: Number,
  },
  isShowClose: {
    type: Boolean,
    default: true,
  },
});
const state = reactive({
  visible: props.dialogVisible,
  isShowClose: props.isShowClose,
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
.star-dialog {
  ::v-deep(.el-dialog) {
    border-radius: 34px;
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: $btn-orange-bgcolor;
    }
  }
  .star-dialog-el {
    ::v-deep(.el-dialog__header) {
      text-align: left !important;
    }
  }
  .star-dialog-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    .svg {
      width: 36px;
      height: 36px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
}
</style>
