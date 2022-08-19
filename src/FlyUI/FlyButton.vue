<template>
  <button type="button" class="fly-button" :class="{ [props.type]: true }">
    <slot></slot>
  </button>
</template>
<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "normal",
  },
});
</script>
<style lang="scss" scoped>
$text-brow-color: #744600;
.fly-button {
  padding: 15px 25px;
  text-align: center;
  border: none;
  outline: none;
  border-radius: 8px;
  box-sizing: content-box;
  font-weight: bold;
  font-size: 16px;
  &:hover {
    cursor: pointer;
    opacity: 0.85;
    transition: all 0.3s ease-in-out;
  }
}
.fly-button.normal {
  color: $text-brow-color;
  background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
  box-shadow: 0px 12px 15px 0px rgba(253, 168, 0, 0.39);
}
.fly-button.dark {
  color: $white;
  background-color: transparent;
  background-color: $theme_gray_color;
}
.fly-button.danger_ghost {
  color: $theme_danger_color;
  background-color: transparent;
  border: 1px solid $theme_danger_color;
}
.fly-button.success_ghost {
  color: $theme_light-color;
  background-color: transparent;
  border: 1px solid $theme_light-color;
}
.fly-button.light {
  color: $orange;
  border: 1px solid $orange;
  padding: 14px 25px;
}
.fly-button.disabled {
  background: $gray_light;
  // color: $black;
  color: rgba(0, 0, 0, 0.54);
}
.fly-button.success {
  border: 1px solid #fba800;
  background: none;
  color: #fba800;
}
.fly-button.cancel {
  border: 1px solid #fba800;
  background: none;
  color: #fba800;
}
.fly-button.red {
  border: 1px solid #f36346;
  background: none;
  color: #f36346;
}
</style>
