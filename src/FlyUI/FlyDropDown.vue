<template>
  <ElDropdown trigger="click">
    <slot name="placeholder"></slot>
    <template #dropdown>
      <ElDropdownMenu class="fly-dropdown-menu">
        <ElDropdownItem
          v-for="(d, i) in menus"
          :key="i"
          class="fly-dropdown-menu-item"
          @click.stop="emitClick(d.value)"
          :class="{ 'is-active': props.activeValue === d.value }"
        >
          <span class="fly-dropdown-menu-item-label">
            {{ $t(`${d.label}`) }}
          </span>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
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
.fly-dropdown-menu {
  background-color: $theme_gray_color;
  border: none;
  border-radius: 0px;
  width: 124px !important;
  border-radius: 8px;
  overflow: hidden;
  padding: 15px 0px;
  .fly-dropdown-menu-item {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: $white;
    &:hover {
      background-color: $gray;
      color: $white;
      opacity: 0.8;
    }
    &.is-active {
      background: $gary_dark;
    }
    .fly-dropdown-menu-item-label {
      margin-left: 20px;
    }
  }
}
</style>
