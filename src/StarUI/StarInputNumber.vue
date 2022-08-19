<template>
  <div
    class="star-input-number"
    :style="{
      '--height': `${props.height}px`,
      '--width': `${
        typeof props.width === 'string' ? props.width : props.width + 'px'
      }`,
      '--radius': `${props.radius}px`,
    }"
  >
    <ElInputNumber
      :max="props.max"
      :min="props.min"
      :model-value="props.value"
      @change="inputEvent"
      :placeholder="props.placeholder"
      :step="1"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import utilsNumber from "@utils/number";
const props = defineProps({
  value: [String, Number],
  placeholder: String,
  max: {
    type: Number,
    default: 999,
  },
  min: {
    type: Number,
    default: 1,
  },
  height: {
    type: Number,
    default: 64,
  },
  width: {
    type: [Number, String],
    default: 388,
  },
  radius: {
    type: Number,
    default: 19,
  },
  step: {
    type: Number,
    default: 1,
  },
});

const emits = defineEmits(["inputEvent"]);

const inputEvent = (e) => {
  if (String(e)) {
    // let val = String(e).replace(/^(0+)|[^\d]+/g, "");
    if (utilsNumber.bigNum(e).gt(props.max)) {
      emits("inputEvent", props.max);
    } else {
      emits("inputEvent", e);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.star-input-number {
  ::v-deep(.el-input-number) {
    width: var(--width);
  }
  ::v-deep(.el-input-number__decrease) {
    border-radius: none;
    background: transparent;
    color: $text-orange-color;
    border: none;
    height: var(--height);
    line-height: var(--height);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    &:hover {
      border: none;
      opacity: 0.7;
    }
    .el-icon-minus {
      font-size: 23px;
    }
  }
  ::v-deep(.el-input-number__increase) {
    border-radius: none;
    background: transparent;
    border: none;
    color: $text-orange-color;
    height: var(--height);
    line-height: var(--height);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    &:hover {
      border: none;
      opacity: 0.7;
    }
    .el-icon-plus {
      font-size: 23px;
    }
  }
  ::v-deep(.el-input__inner) {
    width: 100%;
    height: var(--height);
    border: 1px solid #ededed;
    padding: 0px;
    font-size: 24px;
    font-weight: bold;
    border-radius: var(--radius);
    color: #000;
    &:focus {
      border: 1px solid #ededed;
      // color: transparent;
    }
  }
}
</style>
