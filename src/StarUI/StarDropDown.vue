<template>
  <ElDropdown trigger="click">
    <slot name="placeholder"></slot>
    <template #dropdown>
      <ElDropdownMenu class="star-dropdown-menu">
        <ElDropdownItem
          v-for="(d, i) in menus"
          :key="i"
          class="star-dropdown-menu-item"
          @click.stop="emitClick(d.value)"
          :class="{ 'is-active': props.activeValue === d.value }"
        >
          <span
            class="active-block"
            v-if="props.activeValue === d.value"
          ></span>
          <span class="star-dropdown-menu-item-label">
            {{ $t(`${d.label}`) }}
          </span>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
// import { ElDropdown, ElDropdownMenu, ElDropdownItem } from "element-plus";
const props = defineProps({
  menus: {
    type: Array,
  },
  activeValue: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["clickEvent"]);

const emitClick = (value) => {
  emits("clickEvent", value);
};
</script>
<style lang="scss">
.el-dropdown__popper.el-popper[role="tooltip"] .el-popper__arrow::before {
  display: none;
}
.el-dropdown__popper.el-popper.is-light.is-pure {
  border: none;
  border-radius: 16px;
  left: auto !important;
  right: 80px;
}
</style>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
// 只能操纵里面的样式
.star-dropdown-menu {
  background-color: #ffffff;
  border: none;
  border-radius: 0px;
  width: 166px !important;
  border-radius: 16px;
  color: $text-brown-color;
  overflow: hidden;
  .star-dropdown-menu-item {
    display: flex;
    align-items: center;
    font-size: 16px;
    &:hover {
      background-color: $hover-bg-color;
    }
    .active-block {
      display: inline-block;
      width: 6px;
      height: 20px;
      background-color: $btn-orange-bgcolor;
    }
    .star-dropdown-menu-item-label {
      margin-left: 20px;
    }
  }
}
</style>
