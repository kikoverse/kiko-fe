<template>
  <div class="star-input">
    <ElInput
      :model-value="props.value"
      @input="inputEvent"
      :placeholder="props.placeholder"
    />
  </div>
</template>

<script setup>
// import { ElInput } from "element-plus";
import { defineProps, defineEmits, reactive, watch } from "vue";
import utilsNumber from "@utils/number";
const state = reactive({
  precision: props.precision,
});
const props = defineProps({
  precision: {
    type: Number, // 小数点后精度
    default: 9,
  },
  value: String,
  placeholder: String,
  max: String,
  // 校验类型
  validateType: {
    type: String,
    default: "decimal",
  },
});
const emits = defineEmits(["inputEvent"]);

watch(
  () => props.precision,
  (n, o) => {
    if (n !== o) {
      state.precision = n;
      if (props.value) {
        inputEvent(props.value);
      }
    }
  }
);

const inputEvent = (val) => {
  val = val.toString();
  if (props.validateType === "decimal") {
    val = val
      .replace(/[^\d^\\.]+/g, "") // 把不是数字，不是小数点的过滤掉
      .replace(/^0+(\d)/, "$1") // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      .replace(/^\./, "0."); // 如果输入的第一位为小数点，则替换成 0. 实现自动补全
    let reg = new RegExp("^\\d*(\\.?\\d{0," + state.precision + "})", "g");
    val = val.match(reg)[0] || ""; // 最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
  } else if (props.validateType === "integer") {
    // 整数
    val = val
      .replace(/[^\d]/g, "")
      .replace(/^\./, "")
      .replace(/^0+(\d)/, "$1");
  }

  let emitValue = val;
  if (props.max) {
    if (utilsNumber.bigNum(val).gt(props.max)) {
      emitValue = props.max;
    }
  }
  emits("inputEvent", emitValue);
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.star-input {
  ::v-deep(.el-input) {
    border: none;
  }
  ::v-deep(.el-input__inner) {
    height: 50px;
    line-height: 50px;
    border-radius: none;
    font-weight: 500;
    padding: 0px;
    font-size: 20px;
    padding-left: 8px;
    &:focus {
      border: none;
    }
  }
}
</style>
